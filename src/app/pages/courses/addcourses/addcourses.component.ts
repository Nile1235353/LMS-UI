// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// interface TableRow {
//   selected: boolean;
//   ID: number;
//   name: string;
//   description: string;
//   video_link: string;
//   department: string;
// }

// @Component({
//   selector: 'app-addcourses',
//   imports: [ CommonModule,
//     RouterModule],

//   templateUrl: './addcourses.component.html',
//   styleUrl: './addcourses.component.scss'
// })
// export class AddcoursesComponent {
//   rowsPerPage = 10;
//   currentPage = 1;

//   // Sample data (replace with your actual data)
//   tableRows: TableRow[] = [
//     {
//       ID: 1, name: 'WMS Reporting', description: 'Warehouse In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
//       selected: false
//     },
//     {
//       ID: 1, name: 'Portal Reporting', description: 'Portal In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
//       selected: false
//     },
//     {
//       ID: 1, name: 'WMS Reporting', description: 'Warehouse In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
//       selected: false
//     },
//      {
//        ID: 1, name: 'WMS Reporting', description: 'Warehouse In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
//        selected: false
//      },
//     {
//       ID: 1, name: 'Portal Reporting', description: 'Portal In / Out and Report', video_link: 'https://www.youtube.com/embed/ZBbXUR9PVzw', department: 'IT and Process',
//       selected: false
//     }
//   ];
//   selectAllChecked: any;
//   items: any;

//   toggleCheckbox(index: number, event: Event) {
//     this.paginatedRows[index].selected = !this.paginatedRows[index].selected;
//   }

//   toggleAllCheckboxes(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.tableRows.forEach(row => row.selected = checked);
//   }

//   isAllSelected(): boolean {
//     return this.tableRows.every(row => row.selected);
//   }

//   get totalPages(): number {
//     return Math.ceil(this.tableRows.length / this.rowsPerPage);
//   }

//   get paginatedRows(): TableRow[] {
//     const start = (this.currentPage - 1) * this.rowsPerPage;
//     return this.tableRows.slice(start, start + this.rowsPerPage);
//   }

//   goToPage(page: number): void {
//     if(page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//     }
//   }

//   previousPage(): void {
//     if(this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

//   nextPage(): void {
//     if(this.currentPage < this.totalPages) {
//       this.currentPage++;
//     }
//   }

//   public currentPages: number = 1;

//   setPage(page: number) {
//     this.currentPages = page;
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AddcoursesService } from './addcourses.service';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-addcourses',

//     imports: [ CommonModule,
//     RouterModule,ReactiveFormsModule],

//   templateUrl: './addcourses.component.html',
//   styleUrls: ['./addcourses.component.scss'],

// })
// export class AddcoursesComponent implements OnInit {
//   courseForm!: FormGroup;
//   currentPages: number = 1;

//   roles: string[] = ['Admin', 'Instructor'];
//    userIds: string[] = [];
//   userList: any[] = [];
//   name: string = '';

//   tableRows: any[] = [];
//   paginatedRows: any[] = [];
//   pageSize = 5;
//   currentPage = 1;

//   constructor(
//     private fb: FormBuilder,
//     private courseservice: AddcoursesService
//   ) {}

//   ngOnInit(): void {
//     this.courseForm = this.fb.group({
//       Role: ['', Validators.required],
//       UserId: ['', Validators.required],
//       name: ['', Validators.required],
//       Department: [''],
//       Description: [''],
//       Title: [''],
//       videoLink: ['']
//     });

//     this.loadCourses();

//   //   this.courseForm.get('Role')?.valueChanges.subscribe((role: string) => {
//   //     this.loadUserIds(role);
//   //     this.courseForm.patchValue({ UserId: '', name: '' });
//   //   });

//   //   this.courseForm.get('UserId')?.valueChanges.subscribe((userId: string) => {
//   //     const role = this.courseForm.get('Role')?.value;
//   //    // this.loadUserName(role, userId);
//   //   });
//   // }

//   this.courseForm.get('Role')?.valueChanges.subscribe((role: string) => {
//     this.loadUserIds(role);
//     this.courseForm.patchValue({ UserId: '', name: '' });
//   });

// }
// loadUserIds(role: string) {
//   this.courseservice.getUsersByRole(role).subscribe(res => {
//     this.userList = res; // Full user object list
//     this.userIds = res.map((user: any) => user.userId); // userId တွေကို array ထဲထည့်
//   });
// }

//   // Load user name based on role and userId
//   // loadUserName(role: string, userId: string) {
//   //   this.courseservice.getCourseById(role, userId).subscribe(res => {
//   //     this.name = res;
//   //     this.courseForm.patchValue({ name: this.name });
//   //   });
//   // }

//   // Submit form
//   onSubmit(): void {
//     if (this.courseForm.invalid) {
//       this.courseForm.markAllAsTouched();
//       return;
//     }

//     const formData = new FormData();
//     formData.append('Role', this.courseForm.value.Role);
//     formData.append('UserId', this.courseForm.value.UserId);
//     formData.append('Name', this.courseForm.value.Name);
//     formData.append('Department', this.courseForm.value.Department);
//     formData.append('Title', this.courseForm.value.Title);
//     formData.append('Description', this.courseForm.value.Description);
//     formData.append('VideoLink', this.courseForm.value.videoLink);

//     this.courseservice.saveCourse(formData).subscribe({
//       next: () => {
//         alert('Course Created Successfully!');
//         this.courseForm.reset();
//         this.setPage(1);
//         this.loadCourses();
//       },
//       error: (err: any) => {
//         console.error('Error creating course', err);
//         alert('Failed to create course!');
//       }
//     });
//   }

//   setPage(page: number) {
//     this.currentPages = page;
//   }

//   // Load courses from backend
//   loadCourses() {
//     this.courseservice.getCourseList().subscribe(res => {
//       this.tableRows = res.map((r: any) => ({ ...r, selected: false }));
//       this.totalPages = Math.ceil(this.tableRows.length / this.pageSize);
//       this.paginate();
//     });
//   }

//   totalPages = 1;

//   paginate() {
//     const start = (this.currentPage - 1) * this.pageSize;
//     this.paginatedRows = this.tableRows.slice(start, start + this.pageSize);
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.paginate();
//     }
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.paginate();
//     }
//   }

//   goToPage(page: number) {
//     this.currentPage = page;
//     this.paginate();
//   }

//   toggleAllCheckboxes(event: any) {
//     const checked = event.target.checked;
//     this.tableRows.forEach(row => (row.selected = checked));
//     this.paginate();
//   }

//   isAllSelected() {
//     return this.tableRows.length > 0 && this.tableRows.every(row => row.selected);
//   }

//   toggleCheckbox(index: number, event: any) {
//     this.paginatedRows[index].selected = event.target.checked;
//   }
//   goBack() {
//     this.currentPages = 1;  // Set the page back to the course list
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddcoursesService } from './addcourses.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-addcourses',

      imports: [ CommonModule,
     RouterModule,ReactiveFormsModule],
  templateUrl: './addcourses.component.html',
  styleUrls: ['./addcourses.component.scss'],
})
export class AddcoursesComponent implements OnInit {
  courseForm!: FormGroup;
  courses: any[] = [];
  roles: string[] = ['Admin', 'Instructor'];
userList: any[] = [];
  userIds: string[] = [];
  name: string = '';
  tableRows: any[] = [];
  paginatedRows: any[] = [];
  currentPages: number = 1;
  pageSize = 20;
  currentPage = 1;
  totalPages = 1;
  paginatedCourses: any[] = [];
  editingCourseId: string | null = null;
  constructor(private fb: FormBuilder, private courseservice: AddcoursesService) {}


  ngOnInit(): void {
    this.courseForm = this.fb.group({
      Role: ['', Validators.required],
      UserId: ['', Validators.required],
      Name: [''],
      Department: [''],
      Title: ['', Validators.required],
      Description: [''],
      VideoLink: [''],
    });

    // Role selection change listener
    this.courseForm.get('Role')?.valueChanges.subscribe(role => {
      this.onRoleChange(role);
    });

    // UserId selection change listener
    this.courseForm.get('UserId')?.valueChanges.subscribe(userId => {
      this.onUserIdChange(userId);
    });
    this.loadCourses();
  }
   // Load all courses (Read)
  //  loadCourses(): void {
  //   this.courseservice.getCourseList().subscribe({
  //     next: (res) => {
  //       this.courses = res;
  //       this.totalPages = Math.ceil(this.courses.length / this.pageSize);
  //       this.paginate();
  //     },
  //     error: (err) => {
  //       console.error('Error loading courses', err);
  //     },
  //   });
  // }

  loadCourses() {
    this.courseservice.getCourseList().subscribe({
      next: (res) => {
        this.tableRows = res;
        this.paginatedRows = res.slice(0, this.pageSize);
        this.totalPages = Math.ceil(res.length / this.pageSize);
        this.currentPage = 1;
      },
      error: (err) => {
        console.error('Load courses error:', err);
      }
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCourses = this.courses.slice(start, start + this.pageSize);
  }

  // setPage(page: number) {
  //   if (page < 1 || page > this.totalPages) return;
  //   this.currentPage = page;
  //   this.paginate();
  // }



  onRoleChange(role: string): void {
    if (!role) {
      this.userList = [];
      this.courseForm.patchValue({ UserId: '',Name:'' });
      return;
    }
    this.courseservice.getUsersByRole(role).subscribe({
      next: (users) => {
        console.log('Users loaded for role:', role, users); // ✅ Debug line
        this.userList = users;
        this.courseForm.patchValue({ UserId: '', Name: '' });
      },
      error: (err) => {
        console.error('Error fetching users by role', err);
      }
    });

  }

   // Handle UserId change → fill Name field automatically
   onUserIdChange(userId: string): void {
    const selectedUser = this.userList.find(u => u.userId === userId);
    this.courseForm.patchValue({ Name: selectedUser?.name || '' });
  }

  loadUserIds(role: string) {
    this.courseservice.getUsersByRole(role).subscribe(res => {
      this.userList = res; // full user objects
      this.userIds = res.map((user: any) => user.userId);
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('UserId', this.courseForm.value.UserId || '');
    formData.append('Name', this.courseForm.value.Name || '');
    formData.append('IsActive', 'true');
    formData.append('Department', this.courseForm.value.Department || '');
    formData.append('CreatedUser', 'system');
    formData.append('VideoLink', this.courseForm.value.VideoLink || '');
    formData.append('Role', this.courseForm.value.Role.toString() || '');
    formData.append('CreatedDate', new Date().toISOString());
    formData.append('Title', this.courseForm.value.Title || '');
    formData.append('Description', this.courseForm.value.Description || '');

    this.courseservice.saveCourse(formData).subscribe({
      next: () => {
        alert('Course Created Successfully!');
        this.courseForm.reset();
        this.loadCourses();
        this.currentPages = 1;
      },
      error: (err) => {
        console.error('Save error:', err);
        alert('Failed to save course.');
      }
    });
  }

// Call this method when clicking the Edit button in your list to load the selected course
editCourse(course: any) {
  this.selectedCourseId = course.id; // ← this is the int 'Id'

  this.courseservice.getCourseById(course.id).subscribe({
    next: (res) => {
      console.log("Response from GetById =>", res);
      this.currentPages = 3;
      this.courseForm.patchValue({
        Role: res.role,
        UserId: res.userId,
        Name: res.name,
        Title: res.title,
        VideoLink: res.videoLink,
        Department: res.department,
        Description: res.description
      });
    },
    error: (err) => {
      console.error('Error loading course:', err);
      alert('Failed to load course by Id.');
    }
  });
}


// Submit update form
onUpdate(): void {
  if (this.courseForm.invalid) {
    this.courseForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  formData.append('Id', this.selectedCourseId.toString());
  formData.append('UserId', this.courseForm.value.UserId);
  formData.append('Name', this.courseForm.value.Name);
  formData.append('Role', this.courseForm.value.Role);
  formData.append('Title', this.courseForm.value.Title);
  formData.append('VideoLink', this.courseForm.value.VideoLink);
  formData.append('Department', this.courseForm.value.Department);
  formData.append('Description', this.courseForm.value.Description);

  this.courseservice.updateCourse(formData).subscribe({
    next: () => {
      alert('Course updated successfully!');
      this.courseForm.reset();
      this.loadCourses();
      this.currentPages = 1;
    },
    error: (err) => {
      console.error('Update error:', err);
      alert('Failed to update course.');
    }
  });
}


// Make sure you have selectedCourseId saved when calling editCourse
selectedCourseId!: number;

// Example: When clicking Edit button on the list
onEditButtonClick(course: any) {
  this.selectedCourseId = course.id;
  this.editCourse(course.id);
}

setPage(pageNumber: number): void {
  this.currentPages = pageNumber;

  if (pageNumber === 3) {
    this.loadSelectedCourseToForm();
  }
}

// setPage(page: number): void {
//   this.currentPages = page;
// }

selectCourse(id: number): void {
  this.selectedCourseId = id;
}

loadSelectedCourseToForm(): void {
  const course = this.courses.find(c => c.courseId === this.selectedCourseId);
  if (course) {
    this.courseForm.patchValue({
      UserId: course.userId,
      Name: course.name,
      Role: course.role,
      Title: course.title,
      VideoLink: course.videoLink,
      Department: course.department,
      Description: course.description
    });
  }
}

    // Delete Course
  deleteCourse(courseId: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseservice.deleteCourse(courseId).subscribe({
        next: () => {
          alert('Course deleted successfully');
          this.loadCourses();
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete course');
        }
      });
    }
  }
  resetForm() {
    this.editingCourseId = null;
    this.courseForm.reset();
  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.paginate();
  }

  toggleAllCheckboxes(event: any) {
    const checked = event.target.checked;
    this.tableRows.forEach(row => (row.selected = checked));
    this.paginate();
  }

  isAllSelected() {
    return this.tableRows.length > 0 && this.tableRows.every(row => row.selected);
  }

  toggleCheckbox(index: number, event: any) {
    this.paginatedRows[index].selected = event.target.checked;
  }

  goBack() {
    this.currentPages = 1;
  }
}
