import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
showModal = false;
selectedVideo: any = null;
searchTerm: string = '';
selectedCategory: string = 'All';

videos = [
  {
    title: 'Hello Program',
    url: 'https://youtu.be/TJizaGqCQuI?t=1',
    thumbnail: 'https://img.youtube.com/vi/f3kgzgxRXJg/hqdefault.jpg',
    category: 'Tutorial'
  },
  {
    title: 'Fishing Woman in the Mountains',
    url: 'https://www.youtube.com/embed/WCpVoC847Qs',
    thumbnail: 'https://img.youtube.com/vi/WCpVoC847Qs/hqdefault.jpg',
    category: 'Nature'
  },
  {
    title: 'Mountain River Fishing',
    url: 'https://www.youtube.com/embed/grMPM0JhAcQ',
    thumbnail: 'https://img.youtube.com/vi/grMPM0JhAcQ/hqdefault.jpg',
    category: 'Nature'
  },
  {
    title: 'Nature Calm Trip',
    url: 'https://www.youtube.com/embed/ZBbXUR9PVzw',
    thumbnail: 'https://img.youtube.com/vi/ZBbXUR9PVzw/hqdefault.jpg',
    category: 'Adventure'
  }
];

get filteredVideos() {
  return this.videos.filter(video =>
    (this.selectedCategory === 'All' || video.category === this.selectedCategory) &&
    video.title.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

openModal(video: any) {
  const autoplayUrl = video.url.includes('?') ? video.url + '&autoplay=1' : video.url + '?autoplay=1';
  this.selectedVideo = { ...video, url: autoplayUrl };
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
  this.selectedVideo = null;
}


}
