import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ViewcoursesService {
    // private apiUrl = environment.LMSAPIUrl + 'ViewCourse/';
    private courseapiUrl = environment.LMSAPIUrl + 'Course/';
    private baseUrl = environment.LMSAPIUrl+'ViewCourse';
    private apiUrl = environment.LMSAPIUrl + 'User';

    constructor(private http: HttpClient) { }

    getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.courseapiUrl}GetById/${id}`);
  }

  getUserList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetUserList`);
  }

  // getUserById(userId: string) {
  //   return this.http.get<any>(`${this.baseUrl}/GetUserById/${userId}`);
  // }

  createViewCourse(data: any) {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

}
