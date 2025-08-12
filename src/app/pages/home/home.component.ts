import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HomeService } from './home.service';

export interface Course {
  id: number;
  title: string;
  department: string; 
  videoLink: string;
  safeUrl?: SafeResourceUrl;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,RouterModule
  ]
})
export class HomeComponent {
  searchTerm: string = '';
  selectedCategory: string = 'All';
  allCourses: Course[] = [];
  showModal = false;
  selectedCourse: any;
  safeVideoUrl?: SafeResourceUrl;
  safeVideoUrls: any[] = [];
  selectedVideo: { title: string; url: SafeResourceUrl; thumbnail: string;videoLink: string; } | null = null;
  courses: any[] = [];
  videoLinks: any[] = [];
  extract: any[] = [];
  course: any[] = [];

  constructor(private sanitizer: DomSanitizer,private homeservice: HomeService) {}

  ngOnInit() {
    this.loadHome();
  }

  get filteredVideos(): Course[] {
    if (!this.allCourses) {
      return [];
    }

    let items = this.allCourses;

    if (this.selectedCategory && this.selectedCategory !== 'All') {
      items = items.filter(course => course.department === this.selectedCategory);
    }

    console.log("This is Selected All Course ", items)

    if (this.searchTerm) {
      items = items.filter(course =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    console.log("This is Search Box Selected Course ",items)

    return items;
  }

  loadHome() {
    this.homeservice.getCourseList().subscribe({
      next: (res: Course[]) => {
        console.log('Loaded Courses:', res);
        this.courses = res;
        console.log("This is Course",this.course);
        // this.safeVideoUrls = this.courses.map(course => {
        //   const videoUrl = course.videoLink.includes("?")
        //     ? course.videoLink + "&mute=0&modestbranding=1&rel=0&controls=0&autohide=1&playsinline=0"
        //     : course.videoLink + "?mute=0&modestbranding=1&rel=0&controls=0&autohide=1&playsinline=0";

        //   return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
        // });

        this.safeVideoUrls = this.courses.map(course => {
          const videoUrl = course.videoLink.includes("?")
            ? course.videoLink + "&autoplay=0&mute=1&modestbranding=1&rel=0&controls=0&playsinline=1"
            : course.videoLink + "?autoplay=0&mute=1&modestbranding=1&rel=0&controls=0&playsinline=1";

            const extractUrl = this.extractYouTubeVideoId(course.videoLink);

            console.log("This is Course dot videoLink !=", extractUrl)

            const embedUrl = `https://www.youtube.com/embed/${extractUrl}?autoplay=0&mute=1&modestbranding=1&rel=0&controls=1&playsinline=1`;

            console.log("This is Embed Url !=", embedUrl)

          return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        });

        // this.videoLinks = this.courses
        //   .filter(course => course.videoLink)
        //   .map(course => this.extractYouTubeVideoId(course.videoLink));
        console.log("Safe Video Links:", this.safeVideoUrls);
        // this.safeVideoUrls = this.videoLinks.map(link =>
        //   this.sanitizer.bypassSecurityTrustResourceUrl(link)
        // );
        // this.extract = this.courses
        //   .filter(course => course.videoLink)
        //   .map(course => this.extractPlaylistId(course.videoLink));
        // console.log("Extracted Playlist IDs:", this.extract);

        this.allCourses = res.map(course => {
          const videoUrl = course.videoLink.includes("?")
            ? course.videoLink + "&autoplay=0&mute=1&modestbranding=1&rel=0&controls=0&playsinline=1"
            : course.videoLink + "?autoplay=0&mute=1&modestbranding=1&rel=0&controls=0&playsinline=1";
          return {
            ...course,
            safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl)
          };
        });
        
        console.log('Loaded and Processed Courses:', this.allCourses);
        },
        error: (err) => {
          console.error('Load courses error:', err);
        }
    });
  }

  // private extractYouTubeVideoId(url: string): string {
  //   const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^\?&]+)/);
  //   return match ? match[1] : '';
  // }

  private extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    // Regex pattern to match YouTube video IDs from various link formats
    const pattern = /(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);

    return match ? match[1] : null;
  }

  openModal(course: any) {
    const videoId = this.extractYouTubeVideoId(course.videoLink);

    console.log("This is one video ID = ",videoId)
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&modestbranding=1&rel=0&controls=1&playsinline=1`;
    
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.selectedCourse = course;
    this.showModal = true;
    console.log("This is Selected Course ", this.safeVideoUrl);
  }

  closeModal() {
    this.showModal = false;
    this.selectedCourse = null;
    this.safeVideoUrl = undefined;
  }

}
