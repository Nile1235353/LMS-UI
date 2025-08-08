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

  ExampleMethod() {
    // Example method to demonstrate functionality
    console.log('Example method called with ID:', this.Id);
  }

  loadCourses() {
    this.viewcourseservice.getCourseById(this.Id).subscribe({
      next: (res) => {
        console.log('Loaded Courses:', res);
        // this.tableRows = res;
        this.courses = res;
        console.log(this.courses.courseId)
        console.log(res.videoLink)
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.videoLink);
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
