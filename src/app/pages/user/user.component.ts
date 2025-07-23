
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
      next: data => {
        this.users = data;
        this.selectedUser = null; // Reset selection on reload
      },
      error: err => console.error('Error loading users:', err)
    });
  }

  // editUser() {
  //   if (!this.selectedUser?.UserId) return;

  //   this.userService.getUserById(this.selectedUser.UserId).subscribe({
  //     next: (data) => {
  //       const formattedUser = {
  //         userId: data.UserId,
  //         fullName: data.FullName,
  //         email: data.Email,
  //         passwordHash: data.PasswordHash,
  //         role: data.Role,
  //         nrc: data.NRC,
  //         phoneNumber: data.PhoneNumber,
  //         employeeId: data.EmployeeId,
  //         department: data.Department,
  //         position: data.Position,
  //         remark: data.Remark,
  //         isActive: data.IsActive
  //       };
  //       this.userForm.patchValue(formattedUser);
  //       this.setPage(3);
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch user by ID:', err);
  //     }
  //   });
  // }

  selectUser(user: any) {
    this.selectedUser = user;
    console.log("Selected user:", this.selectedUser);
  }

  setPage(pageNumber: number) {
    this.currentPages = pageNumber;
    if (pageNumber === 2) {
      this.resetForm(); // for new user
    } else if (pageNumber === 3 && this.selectedUser) {
      // Manually map user object properties (PascalCase -> camelCase)
      this.userForm.patchValue({
        userId: this.selectedUser.UserId,
        fullName: this.selectedUser.FullName,
        email: this.selectedUser.Email,
        passwordHash: this.selectedUser.PasswordHash,
        role: this.selectedUser.Role,
        nrc: this.selectedUser.NRC,
        phoneNumber: this.selectedUser.PhoneNumber,
        employeeId: this.selectedUser.EmployeeId,
        department: this.selectedUser.Department,
        position: this.selectedUser.Position,
        remark: this.selectedUser.Remark,
        isActive: this.selectedUser.IsActive
      });
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('UserId', this.userForm.value.userId ?? '');
    formData.append('FullName', this.userForm.value.fullName ?? '');
    formData.append('Email', this.userForm.value.email ?? '');
    formData.append('PasswordHash', this.userForm.value.passwordHash ?? '');
    formData.append('Role', this.userForm.value.role.toString());
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
      formData.append('Role', this.userForm.value.role.toString());

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
