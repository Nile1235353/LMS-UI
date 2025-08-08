import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewcoursedetailserviceService {

  private baseUrl = environment.LMSAPIUrl+'ViewCourse/';

  constructor(private http:HttpClient) {}


    getAllViewCourses() {
      return this.http.get<any[]>(this.baseUrl + 'GetAllViewCourse');
    }

}
