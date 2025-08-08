import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HomeService } from './home.service';

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
searchTerm = '';
  selectedCategory = 'All';
  showModal = false;
  selectedVideo: { title: string; url: SafeResourceUrl; thumbnail: string } | null = null;

  videos = [
    {
      title: 'Mountain Adventure',
      url: 'https://www.youtube.com/embed/Scxs7L0vhZ4',
      category: 'Adventure',
      thumbnail: 'https://img.youtube.com/vi/Scxs7L0vhZ4/0.jpg'
    },
    {
      title: 'Beautiful Nature',
      url: 'https://www.youtube.com/embed/TlB_eWDSMt4',
      category: 'Nature',
      thumbnail: 'https://img.youtube.com/vi/TlB_eWDSMt4/0.jpg'
    },
    {
      title: 'Angular Tutorial',
      url: 'https://www.youtube.com/embed/2OHbjep_WjQ',
      category: 'Tutorial',
      thumbnail: 'https://img.youtube.com/vi/2OHbjep_WjQ/0.jpg'
    }
  ];
  courses: any[] = [];
  videoLinks: any[] = [];
  extract: any[] = [];

  constructor(private sanitizer: DomSanitizer,private homeservice: HomeService) {}

  ngOnInit() {
    this.loadHome();
    this.extractPlaylistId(this.url)
  }

  loadHome() {
    this.homeservice.getCourseList().subscribe({
      next: (res) => {
        console.log('Loaded Courses:', res);
        // this.tableRows = res;
        // this.courses = res;
        this.courses = res;
        this.videoLinks = this.courses
          .filter(course => course.videoLink)
          .map(course => this.extractYouTubeVideoId(course.videoLink));
        this.extract = this.courses
          .filter(course => course.videoLink)
          .map(course => this.extractPlaylistId(course.videoLink));
        console.log("this is Play List ID !=",this.extract)
        console.log("This is Videos Links !=",this.videoLinks)


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

  extractYouTubeVideoId(url: string): string {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?]+)/;
    const match = url.match(regExp);
    return match ? match[1] : '';
  }



  get filteredVideos() {
    return this.videos.filter(video =>
      (this.selectedCategory === 'All' || video.category === this.selectedCategory) &&
      video.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openModal(video: any) {
    this.selectedVideo = {
      ...video,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(video.url)
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedVideo = null;
  }

  url = "https://www.youtube.com/embed/_ayEkOh3SWs?list=RD7Ut4TmCcgZg"

  extractPlaylistId(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const searchParams = parsedUrl.searchParams;

      if (searchParams.has("list")) {
        return searchParams.get("list");
      }
    } catch (error) {
      console.error("Invalid URL:", url);
    }

    return null;
  }

}
