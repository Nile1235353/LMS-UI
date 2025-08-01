import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface TableRow {
  selected: boolean;
  ID: number;
  name: string;
  description: string;
  video_link: string;
  department: string;
}

@Component({
  selector: 'app-addcourses',
  imports: [ CommonModule,
    RouterModule],

  templateUrl: './addcourses.component.html',
  styleUrl: './addcourses.component.scss'
})
export class AddcoursesComponent {
  rowsPerPage = 10;
  currentPage = 1;

  // Sample data (replace with your actual data)
  tableRows: TableRow[] = [
    {
      ID: 1, name: 'WMS Reporting', description: 'Warehouse In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
      selected: false
    },
    {
      ID: 1, name: 'Portal Reporting', description: 'Portal In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
      selected: false
    },
    {
      ID: 1, name: 'WMS Reporting', description: 'Warehouse In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
      selected: false
    },
     {
       ID: 1, name: 'WMS Reporting', description: 'Warehouse In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
       selected: false
     },
    {
      ID: 1, name: 'Portal Reporting', description: 'Portal In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
      selected: false
    }
  ];
  selectAllChecked: any;
  items: any;

  toggleCheckbox(index: number, event: Event) {
    this.paginatedRows[index].selected = !this.paginatedRows[index].selected;
  }

  toggleAllCheckboxes(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableRows.forEach(row => row.selected = checked);
  }

  isAllSelected(): boolean {
    return this.tableRows.every(row => row.selected);
  }

  get totalPages(): number {
    return Math.ceil(this.tableRows.length / this.rowsPerPage);
  }

  get paginatedRows(): TableRow[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.tableRows.slice(start, start + this.rowsPerPage);
  }

  goToPage(page: number): void {
    if(page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if(this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if(this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }


  public currentPages: number = 1;

  setPage(page: number) {
    this.currentPages = page;
  }
}
