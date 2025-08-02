import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showConfirm: boolean = false;
  deleteUserId: string | null = null;

  askDeleteUser() {
    // this.deleteUserId = id;
    this.showConfirm = true;
    // console.log("Asking to delete user with ID:", id);
  }
}
