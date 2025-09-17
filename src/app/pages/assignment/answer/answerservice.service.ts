import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// DTOs
export interface AssignmentAnswerDto {
  answerId: string;
  submissionId: string;
  questionId: string;
  answerText: string;
  selectedOptionId?: string;
}

export interface AssignmentOptionDto {
  optionId: string;
  optionText: string;
}

export interface AssignmentQuestionDto {
  questionId: string;
  assignmentId: string;
  questionText: string;
  questionType: string; // 'truefalse' or 'mcq'
  options?: AssignmentOptionDto[];
  answers?: AssignmentAnswerDto[];
}

@Injectable({
  providedIn: 'root'
})

export class AnswerserviceService {

  private submissionUrl = environment.LMSAPIUrl + 'AssignmentSubmission';

  constructor(private http: HttpClient) { }

  getallsubmission(): Observable <any[]> {
    return this.http.get<any[]>(`${this.submissionUrl}`);
  }

  // Get questions with answers by submissionId
  getQuestionsWithAnswers(submissionId: string): Observable<AssignmentQuestionDto[]> {
    return this.http.get<AssignmentQuestionDto[]>(`${this.submissionUrl}/${submissionId}/questions-with-answers`);
  }

}
