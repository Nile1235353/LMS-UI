// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })

// export class UserserviceService {
//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ This makes Angular inject it globally
})
export class UserserviceService {
  private apiUrl = 'https://localhost:44320/api/User';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetUserList`);
  }

  saveUser(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateUser(formData: FormData): Observable<any> {
    return this.http.put(this.apiUrl, formData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }
}

