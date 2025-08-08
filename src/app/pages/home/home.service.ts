
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = environment.LMSAPIUrl + 'Course/';
  private apiUrl_viewCourse = environment.LMSAPIUrl + 'ViewCourse/';

  constructor(private http: HttpClient) { }

  getRoles(): string[] {
    return ['Admin', 'Instructor'];
  }

  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}GetUsersByRole/${role}`);
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetById/${id}`);
  }

  getViewCourseById(CourseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl_viewCourse}GetCourseById/${CourseId}`);
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

  deleteCourse(id: string): Observable<any> {
    console.log(id)
    console.log(`${this.apiUrl}${id}`)
    return this.http.delete<any>(`${this.apiUrl}${id}`);

    // deleteUser(id: string): Observable<any> {
    //   return this.http.delete<any>(`${this.apiUrl}/${id}`);
    // }
  }

}
