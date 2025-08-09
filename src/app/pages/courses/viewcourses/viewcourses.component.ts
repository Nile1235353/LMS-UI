import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ViewcoursesService } from './viewcourses.service';
import { Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-viewcourses',
  standalone:true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './viewcourses.component.html',
  styleUrl: './viewcourses.component.scss'
})
export class ViewcoursesComponent implements OnInit {
  courseForm: any;
  fb: any;
  FinishModal: boolean = false;
  safeVideoUrl: SafeResourceUrl | undefined;
  constructor(private route: ActivatedRoute, private courseservice: ViewcoursesService,private sanitizer: DomSanitizer) {}

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
  }

  ExampleMethod() {
    // Example method to demonstrate functionality
    console.log('Example method called with ID:', this.Id);
  }

  loadCourses() {
    this.courseservice.getCourseById(this.Id).subscribe({
      next: (res) => {
        console.log('Loaded Courses:', res);
        // this.tableRows = res;
        this.courses = res;
        console.log(this.courses.courseId)
        console.log(res.videoLink)

        // Add autoplay parameter to the video link
        let videoLink = res.videoLink;

        console.log("This is Super Video Link ", videoLink)

        // Check if videoLink already has query params
        if (videoLink.includes('?')) {
          videoLink += '&autoplay=1&mute=0&modestbranding=0&rel=0&controls=1&playsinline=0&loop=1';
        } else {
          videoLink += '?autoplay=1&mute=0&modestbranding=0&rel=0&controls=1&playsinline=0&loop=1';
        }

        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
        console.log("this is Video Link ",this.safeVideoUrl)
        // this.paginatedRows = res.slice(0, this.pageSize);
        // this.totalPages = Math.ceil(res.length / this.pageSize);
        // this.currentPage = 1;
        // this.originalUsers = [...this.courses]; // Store original unsorted data
        //this.selectedCourseId = ''; // Reset selected ID
      },
      error: (err) => {
        console.error('Load courses error:', err);
      }
    });
  }

  openFinishedModal(){
    this.FinishModal = true;
  }

  closeFinishedModal(){
    this.FinishModal = false;
  }
}
