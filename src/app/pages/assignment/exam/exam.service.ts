import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExamService {

  private baseUrl = environment.LMSAPIUrl + 'Assignment';
  private apiUrl = environment.LMSAPIUrl + 'User';
  private submissionUrl = environment.LMSAPIUrl + 'AssignmentSubmission';

  constructor(private http: HttpClient) { }

  getAllAssignments(): Observable <any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getQuestionsByAssignment(assignmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${assignmentId}/questions`);
  }

  getUserList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetUserList`);
  }

  // Submit assignment (answers)
  submitAssignment(payload: any): Observable<any> {
    return this.http.post<any>(`${this.submissionUrl}`, payload);
  }


}


