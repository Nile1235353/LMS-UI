
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // ✅ change to environment.ts
@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  private apiUrl = environment.LMSAPIUrl + 'User'; // ✅ use LMSAPIUrl from environment

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getUserList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetUserList`);
  }

  saveUser(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateUser(formData: FormData): Observable<any> {
    return this.http.put<any>(this.apiUrl, formData);
  }

  deleteUser(id: string): Observable<any> {
    console.log(id)
    console.log(`${this.apiUrl}/${id}`)
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }
}


