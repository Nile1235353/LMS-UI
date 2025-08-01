//import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
//import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AddcoursesService {

  private apiUrl = environment.LMSAPIUrl + 'Course/';

  constructor(private http: HttpClient) { }

  getRoles(): string[] {
    return ['Admin', 'Instructor'];
  }

  // Corrected API path
  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}GetUsersByRole/${role}`);
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetById/${id}`);
  }

  getCourseList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}GetAll`);
  }

  saveCourse(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Create`, formData);
  }

  updateCourse(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}Update`, formData);
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${courseId}`);
  }

}
