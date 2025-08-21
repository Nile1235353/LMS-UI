import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private baseUrl = environment.LMSAPIUrl + 'Assignment';

  constructor(private http: HttpClient) { }

//#region Assignment CRUD
getAllAssignments(): Observable <any[]> {
  return this.http.get<any[]>(`${this.baseUrl}`);
}
getAssignmentById(id: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}
createAssignment(assignment: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}`, assignment);
}
updateAssignment(id: string, assignment: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/${id}`, assignment);
}
deleteAssignment(id: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/${id}`);
}
//#endregion

//#region Question CRUD
getQuestionsByAssignment(assignmentId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/${assignmentId}/questions`);
}

// createQuestion(assignmentId: string, question: any): Observable<any> {
//   return this.http.post<any>(`${this.baseUrl}/${assignmentId}/questions`, question);
// }

createQuestion(id: string, question: any): Observable<any> {

  const payload = [question];
  console.log('ERROR',question)
  console.log(JSON.stringify(question));

  return this.http.post<any>(`${this.baseUrl}/AddQuestions?assignmentId=${id}`, payload);
}

// createQuestion(assignmentId: string, question: any): Observable<any> {
//   return this.http.post<any>(`${this.baseUrl}/${assignmentId}/questions`, question);
// }



updateQuestion(assignmentId: string, questionId: string, question: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/${assignmentId}/questions/${questionId}`, question);
}

deleteQuestion(assignmentId: string, questionId: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/${assignmentId}/questions/${questionId}`);
}

//#endregion

//#region Option CRUD
getOptionsByQuestion(questionId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/questions/${questionId}/options`);
}

createOption(questionId: string, option: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/questions/${questionId}/options`, option);
}

updateOption(questionId: string, optionId: string, option: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/questions/${questionId}/options/${optionId}`, option);
}

deleteOption(questionId: string, optionId: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/questions/${questionId}/options/${optionId}`);
}
//#endregion

}
