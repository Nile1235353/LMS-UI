import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule
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

  constructor(private sanitizer: DomSanitizer) {}

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
}
