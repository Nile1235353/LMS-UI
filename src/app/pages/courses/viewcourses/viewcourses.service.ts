import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ViewcoursesService {
    // private apiUrl = environment.LMSAPIUrl + 'ViewCourse/';
    private apiUrl = environment.LMSAPIUrl + 'Course/';

    constructor(private http: HttpClient) { }

//     getViewCourseById(Id: number): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}GetCourseById/${Id}`);
//     console.log(`${this.apiUrl}GetCourseById/${Id}`);
//   }

    getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetById/${id}`);
  }

}