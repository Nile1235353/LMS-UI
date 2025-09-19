import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ViewcoursedetailserviceService } from './viewcoursedetailservice.service';

interface Course {
  id: string;
  viewCourseId: string;
  name:string;
  userId:string;
  title:string;
  videoLink:string;
  viewCount:string;
  department:string;
  employeeId:string;
  status:string;
}

@Component({
  selector: 'app-viewcoursedetails',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './viewcoursedetails.component.html',
  styleUrl: './viewcoursedetails.component.scss'
})

export class ViewcoursedetailsComponent implements OnInit{
  viewCourses: any[] = [];
  pageSize = 7;
  currentPage = 1;
  totalpage = 7;
  searchTerm: string = '';

  constructor(private viewCourseService: ViewcoursedetailserviceService) {}

  ngOnInit(): void {
    this.loadViewCourses();
  }

  loadViewCourses(): void {
    this.viewCourseService.getAllViewCourses().subscribe({
      next: (res) => {
        this.viewCourses = res;
        this.originalUsers = [...res]; // store original order for reset
        console.log("This is All View Courses !=",this.viewCourses)
        console.log("This is original Users !=",this.originalUsers)
      },
      error: (err) => {
        console.error('Failed to load view courses', err);
      }
    });
  }


  // get filteredVideos(): Course[] {
  //     if (!this.viewCourses) {
  //       return [];
  //     }
    
  //     let items = this.viewCourses;
    
  //     // if (this.selectedCategory && this.selectedCategory !== 'All') {
  //     //   items = items.filter(course => course.department === this.selectedCategory);
  //     // }
    
  //     console.log("This is Selected All Course ", items)
    
  //     if (this.searchTerm) {
  //       items = items.filter(course =>
  //         course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
  //         course.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //       );
  //     }

      
    
  //     console.log("This is Search Box Selected Course ",items)
    
  //     return items;
  
  //   }

  // get filteredVideos(): Course[] { ... } // <-- ဒီ function အဟောင်းကို ဖျက်ပါ
  
  // အောက်က function အသစ်နဲ့ အစားထိုးပါ
  get filteredAndSortedCourses(): Course[] {
    if (!this.originalUsers) {
      return [];
    }
  
    // 1. မူရင်း Data (originalUsers) ကနေ စပါ
    let items: Course[] = [...this.originalUsers]; 
  
    // 2. Apply Filter (Search Term)
    if (this.searchTerm) {
      items = items.filter(course =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        course.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    // 3. Apply Sorting (Sorting Logic ကို ဒီထဲ ပေါင်းထည့်ပါ)
    if (this.sortState !== 'normal' && this.sortedColumn) {
      const column = this.sortedColumn;
      
      items.sort((a, b) => {
        const aValue = a[column as keyof Course];
        const bValue = b[column as keyof Course];
        
        // သင့်ရဲ့ sorting logic (number, string, date)
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return this.sortState === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortState === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (
          typeof aValue === 'object' && aValue !== null && (aValue as any) instanceof Date &&
          typeof bValue === 'object' && bValue !== null && (bValue as any) instanceof Date
        ) {
          const aTime = (aValue as Date).getTime();
          const bTime = (bValue as Date).getTime();
          return this.sortState === 'asc' ? aTime - bTime : bTime - aTime;
        }
        return 0;
      });
    }
  
    // 4. Filter + Sort လုပ်ပြီးသား data ကို ပြန်ပေးပါ
    return items;
  }

  

  // get paginatedCourse() {
  //   const start = (this.currentPage - 1) * this.pageSize;
  //   return this.viewCourses.slice(start, start + this.pageSize);
  // }

  // get totalPage() {
  //   return Math.ceil(this.viewCourses.length / this.pageSize);
  // }

  // `get paginatedCourse()` ကို `get paginatedCourses()` လို့ ပြောင်းရေးပါ
  get paginatedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    // `viewCourses` မဟုတ်ဘဲ၊ `filteredAndSortedCourses` ကို slice လုပ်ပါ
    return this.filteredAndSortedCourses.slice(start, end);
  }

  get totalPage() {
    // `viewCourses` မဟုတ်ဘဲ၊ `filteredAndSortedCourses` ကို သုံးပါ
    return Math.ceil(this.filteredAndSortedCourses.length / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
    }
  }

  // Sorting Table Fields

  user: Course[] = [];
  originalUsers: Course[] = []; // Store original unsorted data
  sortedColumn: string | null = null;
  sortState: 'normal' | 'asc' | 'desc' = 'normal';
  courses: any[] = [];

  onHeaderDoubleClick(column: string): void {
    console.log(column)
    console.log(this.sortedColumn)
    if (this.sortedColumn !== column) {
      // New column - start with ascending
      this.sortedColumn = column;
      this.sortState = 'asc';
    } else {
      // Same column - cycle through states
      switch (this.sortState) {
        case 'normal':
          this.sortState = 'asc';
          this.sortedColumn = column;
          break;
        case 'asc':
          this.sortState = 'desc';
          break;
        case 'desc':
          this.sortState = 'normal';
          this.sortedColumn = null;
          break;
      }
    }
    console.log(this.sortState)
    // this.applySorting(); // <-- (ဒီလိုင်းကို ဖျက်ပါ) DELETE THIS LINE
  }

  // applySorting(): void {
  //   if (this.sortState === 'normal') {
  //     // Reset to original order
  //     this.viewCourses = [...this.originalUsers];
  //     return;
  //   }

  //   // Create a new array to sort
  //   this.viewCourses = [...this.viewCourses].sort((a, b) => {
  //     const aValue = a[this.sortedColumn as keyof Course];
  //     const bValue = b[this.sortedColumn as keyof Course];

  //     // For numeric values
  //     if (typeof aValue === 'number' && typeof bValue === 'number') {
  //       return this.sortState === 'asc' ? aValue - bValue : bValue - aValue;
  //     }

  //     // For string values
  //     if (typeof aValue === 'string' && typeof bValue === 'string') {
  //       return this.sortState === 'asc'
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     }

  //     // For date values
  //     if (aValue instanceof Date && bValue instanceof Date) {
  //       const aTime = aValue.getTime();
  //       const bTime = bValue.getTime();
  //       return this.sortState === 'asc' ? aTime - bTime : bTime - aTime;
  //     }

  //     console.log("This is aValue = !",aValue)

  //     return 0;
  //   });
  // }

}
