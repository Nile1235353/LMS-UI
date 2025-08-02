
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserserviceService } from './userservice.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface TableRow {
  selected?: boolean;
}

interface User {
  UserId: string;
  FullName: string;
  Email: string;
  PasswordHash?: string;
  Role: number;
  NRC?: string;
  PhoneNumber?: string;
  EmployeeId?: string;
  Department?: string;
  Position?: string;
  Remark?: string;
  IsActive: boolean;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
toggleSelectAll($event: Event) {
throw new Error('Method not implemented.');
}
  userForm!: FormGroup;
  users: any[] = [];
  selectedUser: any = null;
  selectedUsers: any[] = []; // Track selected users
  allselectedUser: boolean = false; // Track if all users are selected
  // For pagination
  currentPages: number = 1;

  usersPerPage = 10; // or 5, 20, etc.
  currentPage = 1;

  userRoles = [
    { label: 'Admin', value: 0 },
    { label: 'Instructor', value: 1 },
    { label: 'Learner', value: 2 }
  ];
  column: any;
  tableRows: any;

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
        this.originalUsers = [...this.users]; // Store original unsorted data
      },
      error: err => console.error('Error loading users:', err)
    });
  }

  selectUser(user: any) {
    if (this.selectedUser?.UserId === user.UserId) {
    // If already selected, unselect
    this.selectedUser = null;
    } else {
      // Otherwise, select it
      this.selectedUser = user;
    }
    console.log("Selected user:", this.selectedUser);
  }

  allSelected(user: any) {
    if (user === 'selectAll') {
      if (this.selectedUsers.length === this.users.length) {
        // If all are selected, unselect all
        this.selectedUsers = [];
      } else {
        // Otherwise, select all
        this.selectedUsers = [...this.users];
      }
      console.log("All selected users:", this.selectedUsers);
      return;
    }
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
   // formData.append('Role', this.userForm.value.role.toString());
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
            console.log("Form Submitted", this.userForm.value);
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

  // deleteUser(id: string) {
  //   if (confirm('Are you sure to delete?')) {
  //     this.userService.deleteUser(id).subscribe(() => {
  //       this.loadUsers();
  //       this.selectedUser = null;
  //     });
  //   }
  // }

  //Custom Confirm Dialog && Delete User
  showModal = false;
  userToDeleteId: string | null = null;

  // Open modal and remember which user to delete
  openModal(id: string) {
    this.userToDeleteId = id;
    this.showModal = true;
  }

  // Close modal and reset data
  closeModal() {
    this.showModal = false;
    this.userToDeleteId = null;
  }

  // Confirm deletion
  confirmDelete() {
    if (this.userToDeleteId) {
      this.userService.deleteUser(this.userToDeleteId).subscribe(() => {
        this.loadUsers();
        this.selectedUser = null;
        this.closeModal();
      });
    }
  }

  resetForm() {
    this.userForm.reset({
      isActive: true
    });
    this.selectedUser = null;
  }

  // Pagination Methods

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.usersPerPage;
    return this.users.slice(start, start + this.usersPerPage);
  }

  get totalPages() {
    return Math.ceil(this.users.length / this.usersPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Sorting Table Fields

  user: User[] = [];
  originalUsers: User[] = []; // Store original unsorted data
  sortedColumn: string | null = null;
  sortState: 'normal' | 'asc' | 'desc' = 'normal';

  onHeaderDoubleClick(column: string): void {
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

    this.applySorting();
  }

  applySorting(): void {
    if (this.sortState === 'normal') {
      // Reset to original order
      this.users = [...this.originalUsers];
      return;
    }

    // Create a new array to sort
    this.users = [...this.users].sort((a, b) => {
      const aValue = a[this.sortedColumn as keyof User];
      const bValue = b[this.sortedColumn as keyof User];

      // For numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortState === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // For string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortState === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For date values
      if (aValue instanceof Date && bValue instanceof Date) {
        const aTime = aValue.getTime();
        const bTime = bValue.getTime();
        return this.sortState === 'asc' ? aTime - bTime : bTime - aTime;
      }

      return 0;
    });
  }

}




