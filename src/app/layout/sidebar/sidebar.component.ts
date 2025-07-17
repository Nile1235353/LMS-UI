import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit{

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

  
}