import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ViewcoursedetailserviceService } from './viewcoursedetailservice.service';

@Component({
  selector: 'app-viewcoursedetails',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './viewcoursedetails.component.html',
  styleUrl: './viewcoursedetails.component.scss'
})

export class ViewcoursedetailsComponent implements OnInit{
  viewCourses: any[] = [];

  constructor(private viewCourseService: ViewcoursedetailserviceService) {}

  ngOnInit(): void {
    this.loadViewCourses();
  }

  loadViewCourses(): void {
    this.viewCourseService.getAllViewCourses().subscribe({
      next: (res) => {
        this.viewCourses = res;
      },
      error: (err) => {
        console.error('Failed to load view courses', err);
      }
    });
  }

}
