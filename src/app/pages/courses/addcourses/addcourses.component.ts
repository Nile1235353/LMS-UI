
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddcoursesService } from './addcourses.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addcourses',
  imports: [ CommonModule,
     RouterModule,ReactiveFormsModule,FormsModule,NgxSpinnerModule],
     standalone: true,
  templateUrl: './addcourses.component.html',
  styleUrls: ['./addcourses.component.scss'],
})

export class AddcoursesComponent implements OnInit {
  courseForm!: FormGroup;
  courses: any[] = [];

selectedCourse: any;
  roles: string[] = ['Admin', 'Instructor'];
  departmentList: string[] = [
    "CS",
    "BD",
    "F & A",
    "IT",
    "Admin & HR",
    "QEHS",
    "ICD",
    "M & E",
    "CCA",
    "M & R",
    "Warehouse",
    "Yard & Rail",
    "Truck"
  ];

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
  userToDeleteId: string | null = null;
showModal: boolean = false;
selectedCourseId: string | null = null;

  constructor(private spinner: NgxSpinnerService,private fb: FormBuilder, private courseservice: AddcoursesService) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      CourseId: [''],
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


  loadCourses() {
    this.courseservice.getCourseList().subscribe({
      next: (res) => {
        console.log('Loaded Courses:', res);
        this.tableRows = res;
        this.courses = res;

        this.paginatedRows = res.slice(0, this.pageSize);
        this.totalPages = Math.ceil(res.length / this.pageSize);
        this.currentPage = 1;
        //this.selectedCourseId = ''; // Reset selected ID
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


  // loadUserIds(role: string) {
  //   this.courseservice.getUsersByRole(role).subscribe(res => {
  //     this.userList = res; // full user objects
  //     this.userIds = res.map((user: any) => user.userId);
  //   });
  // }

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


  updateCourse(): void {
    if (!this.selectedCourseId) {
      alert('No course selected for update.');
      return;
    }

    if (this.courseForm.invalid) {
      alert('Please fill all required fields.');
      this.courseForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
formData.append('CourseId', this.courseForm.value.CourseId);
formData.append('Title', this.courseForm.value.Title);
formData.append('VideoLink', this.courseForm.value.VideoLink);
formData.append('Department', this.courseForm.value.Department);
formData.append('Description', this.courseForm.value.Description);
formData.append('Role', this.courseForm.value.Role);       // if Role is int, send as string
formData.append('UserId', this.courseForm.value.UserId);
formData.append('Name', this.courseForm.value.Name);
//formData.append('IsActive', this.courseForm.value.IsActive.toString());

    this.spinner.show();
    this.courseservice.updateCourse(formData).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.status) {
          alert('Course updated successfully!');
          this.loadCourses();
          this.resetForm();
          this.setPage(1); // Go back to list
        } else {
          alert(res.messageContent || 'Update failed.');
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Update error:', err);
        alert('Something went wrong while updating.');
      }
    });
  }


// setPage(pageNumber: number): void {
//   this.currentPages = pageNumber;

//   if (pageNumber === 3) {
//     this.loadSelectedCourseToForm();
//   }
// }

setPage(pageNumber: number): void {
  this.currentPages = pageNumber;

  if (pageNumber === 3 && this.selectedCourseId) {
    //this.editCourse(this.selectedCourseId); // Load course for editing
  }
}

onUserIdChange(userId: string): void {
  const user = this.userList.find(u => u.userId === userId);
  this.courseForm.patchValue({ Name: user?.name || '' });
}


loadCourseForEdit(): void {
  if (this.selectedCourseId === null) {
    alert('Please select a course.');
    return;
  }

  this.courseservice.getCourseById(this.selectedCourseId).subscribe({
    next: (course) => {
      if (!course) {
        alert('Course not found.');
        return;
      }

      this.courseForm.patchValue({
        CourseId: course.courseId,
        Title: course.title,
        VideoLink: course.videoLink,
        Department: course.department,
        Description: course.description,
        Role: course.role,
        UserId: course.userId,
        Name: course.name,
        IsActive: course.isActive
      });

      this.setPage(3); // Go to edit form
    },
    error: (err) => {
      console.error('Error fetching course:', err);
      alert('Failed to load course details.');
    }
  });
}

//Method to confirm before deleting
confirmDeleteCourse(): void {
  // console.log('Selected Course ID', this.selectedCourseId)
  // if (this.selectedCourseId) {
  //   console.log('Selected Course ID', this.selectedCourseId)
  //   this.courseservice.deleteCourse(this.selectedCourseId).subscribe(() => {
  //     this.loadCourses();
  //     this.selectedCourseId = null;
  //     // this.closeModal();
  //   });
  // }

  if (!this.selectedCourseId) {
    alert("Please select a course to delete.");
    return;
  }
  console.log('Selected Course ID', this.selectedCourseId)

  const confirmed = confirm("Are you sure you want to delete this course?");
  if (confirmed) {
    console.log('Selected Course ID', this.selectedCourseId)
    this.courseservice.deleteCourse(this.selectedCourseId).subscribe({
      next: (res) => {
        console.log('Selected Course ID', this.selectedCourseId)
        alert("Course deleted successfully.");

        this.loadCourses(); // Reload updated list after deletion
        this.selectedCourseId = null;
      },
      error: (err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete course.");
      }
    });
  }
}


// Method to call service and handle result
// deleteCourseById(CourseId: string): void {

//   if (!CourseId) {
//     alert("Invalid Course ID.");
//     return;
//   }

//   this.courseservice.deleteCourse(CourseId).subscribe({
//     next: (res) => {
//       alert("Course deleted successfully.");
//       //console.log('Is API confirm?');
//       //this.loadCourses(); // Reload data from server
//       this.selectedCourseId = null;
//     },
//     error: (err) => {
//       console.error("Delete failed:", err);
//       alert("Failed to delete course.");
//     }
//   });
// }

  selectCourse(course: any) {
    this.selectedCourseId = course.courseId;
    this.selectedCourse = course;
    this.courseForm.patchValue({
      CourseId:course.courseId,
      //Role: course.role,
     // UserId: course.userId,
      //Name: course.name,
      Title: course.title,
      Department: course.department,
      Description: course.description,
      VideoLink: course.videoLink,
    });
    this.currentPages = 3; // Assuming 3 is the edit page
  }

  onSaveOrUpdate() {
    if (this.selectedCourseId) {
      this.updateCourse();
    } else {
      this.onSubmit();
    }
    this.currentPages = 3;
  }

  resetForm() {
    this.courseForm.reset();
    this.selectedCourseId = '';
    this.currentPages = 1; // go back to list view
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
