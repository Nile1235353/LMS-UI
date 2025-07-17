// import { CommonModule } from '@angular/common';
//import { HttpClientModule } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// interface TableRow {
//   selected: boolean;
//   ID: number;
//   name: string;
//   NRC: string;
//   phone: string;
//   employee_no: number;
//   department: string;
//   position: string;
//   user_role:string;
// }

// @Component({
//   selector: 'app-user',
//   standalone:true,
//   imports: [
//     RouterModule,
//     CommonModule
//   ],
//   templateUrl: './user.component.html',
//   styleUrl: './user.component.scss'
// })
// export class UserComponent {
//     rowsPerPage = 10;
//     currentPage = 1;

//     // Sample data (replace with your actual data)
//     tableRows: TableRow[] = [
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },

//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },
//       {
//         ID: 1, name: 'Nile Nile Wai', NRC: '8/Ta Ta Ka (N) 274036', phone: '09765635868', employee_no: 1, department: '', position: 'Assistant Supervisor', user_role: 'Yangon',
//         selected: false
//       },

//     ];

//     selectAllChecked: any;
//     items: any;



//     toggleCheckbox(index: number, event: Event) {
//       this.paginatedRows[index].selected = !this.paginatedRows[index].selected;
//     }

//     toggleAllCheckboxes(event: Event): void {
//       const checked = (event.target as HTMLInputElement).checked;
//       this.tableRows.forEach(row => row.selected = checked);
//     }

//     isAllSelected(): boolean {
//       return this.tableRows.every(row => row.selected);
//     }

//     get totalPages(): number {
//       return Math.ceil(this.tableRows.length / this.rowsPerPage);
//     }

//     get paginatedRows(): TableRow[] {
//       const start = (this.currentPage - 4) * this.rowsPerPage;
//       return this.tableRows.slice(start, start + this.rowsPerPage);
//     }

//     goToPage(page: number): void {
//       if(page >= 1 && page <= this.totalPages) {
//         this.currentPage = page;
//       }
//     }

//     previousPage(): void {
//       if(this.currentPage > 1) {
//         this.currentPage--;
//       }
//     }

//     nextPage(): void {
//       if(this.currentPage < this.totalPages) {
//         this.currentPage++;
//       }
//     }

//     currentPages: number = 1;

//     setPage(page: number) {
//       this.currentPages = page;
//     }
// }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { UserserviceService } from './userservice.service';
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http'; // ✅ Add this line


// @Component({
//   selector: 'app-user',
//   standalone:true,
//   imports: [
//          RouterModule,
//          CommonModule,
//          ReactiveFormsModule,

//        ],
//   templateUrl: './user.component.html',
//   styleUrl: './user.component.scss'
// })
// export class UserComponent implements OnInit {
//   userForm!: FormGroup;
//   users: any[] = [];
//   roles: string[] = [];
//   isEditMode = false;

//   constructor(private fb: FormBuilder, private userService: UserserviceService) {}
//   userRoles = [
//     { label: 'Admin', value: 0 },
//     { label: 'User', value: 1 },
//     { label: 'Manager', value: 2 }
//   ];

//   ngOnInit(): void {
//     this.initForm();
//     this.loadUsers();
//     this.loadRoles();
//   }

//   initForm() {
//     this.userForm = this.fb.group({
//       userId: [''],
//       fullName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       passwordHash: [''],
//       role: ['', Validators.required],
//       nrc: [''],
//       phoneNumber: [''],
//       employeeId: [''],
//       department: [''],
//       position: [''],
//       remark: [''],
//       isActive: [true]
//     });
//   }

//   loadUsers() {
//     this.userService.getUsers().subscribe(data => {
//       this.users = data;
//     });
//   }

//   loadRoles() {
//     this.userService.getRoles().subscribe(data => {
//       this.roles = data;
//     });
//   }


//   onSubmit() {
//     const formData = new FormData();
// formData.append('UserId', this.userForm.value.userId ?? '');
// formData.append('FullName', this.userForm.value.fullName ?? '');
// formData.append('Email', this.userForm.value.email ?? '');
// formData.append('PasswordHash', this.userForm.value.passwordHash ?? '');
// formData.append('Role', this.userForm.value.role.toString());
// formData.append('NRC', this.userForm.value.nrc ?? '');
// formData.append('PhoneNumber', this.userForm.value.phoneNumber ?? '');
// formData.append('EmployeeId', this.userForm.value.employeeId ?? '');
// formData.append('Department', this.userForm.value.department ?? '');
// formData.append('Position', this.userForm.value.position ?? '');
// formData.append('Remark', this.userForm.value.remark ?? '');
// formData.append('IsActive', this.userForm.value.isActive ? 'true' : 'false');


//     // ✅ inspect FormData
//     for (const [key, value] of formData.entries()) {
//       console.log(key, value);
//     }

//     if (this.isEditMode) {
//       this.userService.updateUser(formData).subscribe({
//         next: () => {
//           this.loadUsers();
//           this.resetForm();
//         },
//         error: err => {
//           console.error('Update error:', err);
//           if (err.status === 400) {
//             console.error('Validation errors:', err.error?.errors);
//           }
//         }
//       });
//     } else {
//       this.userService.saveUser(formData).subscribe({
//         next: () => {
//           this.loadUsers();
//           this.resetForm();
//         },
//         error: err => {
//           console.error('Save error:', err);
//           if (err.status === 400) {
//             console.error('Validation errors:', err.error?.errors);
//           }
//         }
//       });
//     }
//   }

//   editUser(user: any) {
//     this.userForm.patchValue(user);
//     this.isEditMode = true;
//   }

//   deleteUser(id: string) {
//     if (confirm('Are you sure to delete?')) {
//       this.userService.deleteUser(id).subscribe(() => {
//         this.loadUsers();
//       });
//     }
//   }

//   resetForm() {
//     this.userForm.reset({
//       isActive: true
//     });
//     this.isEditMode = false;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserserviceService } from './userservice.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  users: any[] = [];
  selectedUser: any = null;
  currentPages: number = 1;



  userRoles = [
    { label: 'Admin', value: 0 },
    { label: 'Instructor', value: 1 },
    { label: 'Learner', value: 2 }
  ];

  constructor(private fb: FormBuilder, private userService: UserserviceService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm() {
    this.userForm = this.fb.group({
      userId: [''],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: [''],
      role: ['', Validators.required],
      nrc: [''],
      phoneNumber: [''],
      employeeId: [''],
      department: [''],
      position: [''],
      remark: [''],
      isActive: [true]
    });
  }


  loadUsers(): void {
    this.userService.getUserList().subscribe({
      next: data => this.users = data,
      error: err => console.error('Load users error:', err)
    });
  }

  setPage(pageNumber: number) {
    this.currentPages = pageNumber;
    if (pageNumber === 2) {
      this.resetForm(); // for new user
    } else if (pageNumber === 3 && this.selectedUser) {
      this.userForm.patchValue(this.selectedUser); // for edit
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('UserId', this.userForm.value.userId ?? '');
    formData.append('FullName', this.userForm.value.fullName ?? '');
    formData.append('Email', this.userForm.value.email ?? '');
    formData.append('PasswordHash', this.userForm.value.passwordHash ?? '');
    //formData.append('Role', this.userForm.value.role.toString());
    formData.append('Role', this.userForm.value.role.toString());
    formData.append('NRC', this.userForm.value.nrc ?? '');
    formData.append('PhoneNumber', this.userForm.value.phoneNumber ?? '');
    formData.append('EmployeeId', this.userForm.value.employeeId ?? '');
    formData.append('Department', this.userForm.value.department ?? '');
    formData.append('Position', this.userForm.value.position ?? '');
    formData.append('Remark', this.userForm.value.remark ?? '');
    formData.append('IsActive', this.userForm.value.isActive ? 'true' : 'false');

    if (this.currentPages === 3) {
      // Update
      this.userService.updateUser(formData).subscribe({
        next: () => {
          this.loadUsers();
          this.setPage(1);
        },
        error: err => {
          console.error('Update error:', err);
        }
      });
    } else {
      // Save
      this.userService.saveUser(formData).subscribe({
        next: () => {
          this.loadUsers();
          this.setPage(1);
        },
        error: err => {
          console.error('Save error:', err);
        }
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure to delete?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
        this.selectedUser = null;
      });
    }
  }

  resetForm() {
    this.userForm.reset({
      isActive: true
    });
    this.selectedUser = null;
  }
}
