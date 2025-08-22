import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExamService {

  private baseUrl = environment.LMSAPIUrl + 'Assignment';

  constructor(private http: HttpClient) { }

  getAllAssignments(): Observable <any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getQuestionsByAssignment(assignmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${assignmentId}/questions`);
  }


}
