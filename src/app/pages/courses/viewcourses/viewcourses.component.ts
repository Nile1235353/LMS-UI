import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ViewcoursesService } from './viewcourses.service';
import { FormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewcourses',
  standalone:true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './viewcourses.component.html',
  //styleUrl: ['./viewcourses.component.scss'],
  styleUrls: ['./viewcourses.component.scss']
})
export class ViewcoursesComponent implements OnInit {
  courseForm: any;
  fb: any;
  FinishModal: boolean = false;
  safeVideoUrl: SafeResourceUrl | undefined;
  constructor(private route: ActivatedRoute, private viewcourseservice: ViewcoursesService, private sanitizer: DomSanitizer, private router: Router) {}
  userList: any[] = [];
  selectedUserId: string = '';
  //userData: any = {}; // Selected use
  selectedUserName: string = '';
  userData: any = {};
  Id :number = 0;

  courses: {
    courseId?: string;
    title?: string;
    name?: string;
    department?: string;
    description?: string;
    videoLink?: string | undefined;
    // other fields...
  } = {};

  ngOnInit() {
    // this.courseForm = this.fb.group({
    //   CourseId: [''],
    //   Role: ['', Validators.required],
    //   UserId: ['', Validators.required],
    //   Name: [''],
    //   Department: [''],
    //   Title: ['', Validators.required],
    //   Description: [''],
    //   VideoLink: [''],

    // });
    const id = this.route.snapshot.paramMap.get('id');
    this.Id = id ? +id : 0; // Convert to number, default to 0 if not found
    console.log('View Course ID:', this.Id);

    this.loadCourses();
    this.loadUsers();
  }

  loadUsers() {
    this.viewcourseservice.getUserList().subscribe({
      next: (res) => {
        this.userList = res;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  onNameSelect() {
    const foundUser = this.userList.find(u => u.FullName === this.selectedUserName);
    if (foundUser) {
      this.userData = {
        UserId: foundUser.UserId,
        Department: foundUser.Department,
        EmployeeId: foundUser.EmployeeId,
        FullName: foundUser.FullName,
        // Add more if needed (e.g., nrc, phoneNumber)
      };
    } else {
      this.userData = {};
    }
  }

  extractVideoId(url: string): string | null {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  loadCourses() {
    this.viewcourseservice.getCourseById(this.Id).subscribe({
      next: (res) => {
        console.log('Loaded Courses:', res);
        // this.tableRows = res;
        this.courses = res;
        console.log(this.courses.courseId)
        console.log(res.videoLink)

        // Add autoplay parameter to the video link
        let videoLink = this.extractVideoId(res.videoLink) || res.videoLink;

        // let extractedVideoId = this.extractVideoId(videoLink);
        // if (extractedVideoId !== null) {
        //   // extractedVideoId is string here, safe to use
        //   console.log('Video ID:', extractedVideoId);
        // } else {
        //   console.log('Invalid or no video ID found');
        // }

        console.log("This is Super Video Link ", videoLink)

        // Check if videoLink already has query params
        if (videoLink.includes('?')) {
          videoLink = `https://www.youtube.com/embed/${videoLink}&autoplay=1&mute=0&modestbranding=1&rel=0&controls=1&playsinline=1`;
        } else {
          videoLink = `https://www.youtube.com/embed/${videoLink}?autoplay=1&mute=0&modestbranding=1&rel=0&controls=1&playsinline=1`;
        }

        console.log("This is Very Super Video Link ", videoLink);

        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
        console.log("this is Video Link ",this.safeVideoUrl)
      },
      error: (err) => {
        console.error('Load courses error:', err);
      }
    });
  }

  openFinishedModal() {
    //this.courses = course;
    this.viewcourseservice.getUserList().subscribe({
      next: (res) => this.userList = res,
      error: (err) => console.error("Failed to load user list", err)
    });
    this.FinishModal = true;
  }

  doneFinishedCourse() {
    if (!this.userData || !this.selectedUserName) {
      alert('Please select a user.');
      return;
    }

    const payload = {

      courseId: this.courses.courseId,
      title: this.courses.title,
      description: this.courses.description,
      videoLink: this.courses.videoLink,
      status: 'finished',
      userId: this.userData?.UserId,
      department: this.userData?.Department,
      employeeId: this.userData?.EmployeeId,
      name: this.userData?.FullName,



    };

    console.log("Payload to send:", payload);

    this.viewcourseservice.createViewCourse(payload).subscribe({
      next: () => {
        alert("Course marked as finished successfully!");
        this.closeFinishedModal();
         this.router.navigate(['/viewcoursedetail']);
        // this.router.navigate(['/viewcoursedetail', this.courses?.courseId]);
      },
      error: (err) => {
        console.error("Error submitting finished course", err);
      }
    });
  }
  closeFinishedModal() {
    this.FinishModal = false;
  }
}
