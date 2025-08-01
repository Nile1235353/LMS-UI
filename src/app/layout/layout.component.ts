import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    SidebarComponent,
    RouterModule,
    CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  title = 'LMS';
  imagePath = '../assets/images/logo.png';
  public isCollapsed: boolean = false;
  public currentTheme: 'light' | 'dark' = 'light';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.updateSidebarOnResize();

      // Load theme from localStorage on app init
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.currentTheme = 'dark';
        this.renderer.addClass(document.body, 'dark-mode');
      } else {
        this.currentTheme = 'light';
        this.renderer.removeClass(document.body, 'dark-mode');
      }
    }
  }

  @HostListener('window:resize')
  public onResize() {
    this.updateSidebarOnResize();
  }

  public updateSidebarOnResize() {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      this.isCollapsed = isMobile;
    }
  }

  public applyTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  public toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  // Profile dropdown functionality
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log("Dropdown toggled:", this.dropdownOpen);
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    console.log("Logging out...");
    // Redirect to login or clear session
  }
}



