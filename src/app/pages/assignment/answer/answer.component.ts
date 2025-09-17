import { Component, OnInit } from '@angular/core';
import bootstrap from '../../../../main.server';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormsModule } from '@angular/forms';
import { AnswerserviceService, AssignmentAnswerDto, AssignmentQuestionDto } from './answerservice.service';

@Component({
  selector: 'app-answer',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss'
})

export class AnswerComponent implements OnInit {

  submissions: any[] = [];
  currentPages: number = 1;
  selectedSubmissionId!: string;

  questions: AssignmentQuestionDto[] = [];
  answers: { [questionId: string]: any } = {};


  constructor(private AnswerserviceService: AnswerserviceService,private fb: FormBuilder) {

  }

  setPage(pageNumber: number): void {
    this.currentPages = pageNumber;
  }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.AnswerserviceService.getallsubmission().subscribe({
      next: (res) => {
        this.submissions = res;
        console.log("All Submissions:", this.submissions);
      },
      error: (err) => {
        console.error("Error fetching submissions:", err);
      }
    });
  }

// Map of answers: questionId -> selected option(s)
//answers: { [questionId: string]: any } = {};

// MCQ checkbox change handler
onCheckboxChange(event: any, questionId: string) {
  if (!this.answers[questionId]) {
    this.answers[questionId] = [];
  }

  const checked = event.target.checked;
  const value = event.target.value;

  if (checked) {
    this.answers[questionId].push(value);
  } else {
    const index = this.answers[questionId].indexOf(value);
    if (index > -1) this.answers[questionId].splice(index, 1);
  }
}



viewDetails(submissionId: string) {
  this.AnswerserviceService.getQuestionsWithAnswers(submissionId).subscribe({
    next: (res) => {
      this.questions = res;

      this.questions.forEach(q => {
        if (q.questionType === 'truefalse') {
          // Map first answerText as boolean
          this.answers[q.questionId] = q.answers?.[0]?.answerText === 'true';
        } else if (q.questionType === 'mcq') {
          // Map selected optionIds
          this.answers[q.questionId] = q.answers?.map(a => a.selectedOptionId) || [];
        }
      });

      this.currentPages = 2;
    },
    error: (err) => console.error(err)
  });
}

}

  // Answer Detail

  // questions = [
  //   { id: 'q1', text: 'The Earth is flat.', type: 'truefalse', correctAnswer: 'false' },
  //   { id: 'q2', text: 'Which of the following are programming languages?', type: 'mcq',
  //     options: ['Python', 'HTML', 'C++', 'Photoshop'], correctAnswer: ['Python', 'C++'] },
  //     { id: 'q3', text: 'The Earth is flat.', type: 'truefalse', correctAnswer: 'false' },
  //     { id: 'q4', text: 'Which of the following are programming languages?', type: 'mcq',
  //     options: ['Python', 'HTML', 'C++', 'Photoshop'], correctAnswer: ['Python', 'C++'] },
  // ];

  // answers: any = {
  //   q1: 'true',
  //   q2: ['Python', 'HTML'],
  //   q3: 'false',
  //   q4: ['C++','Photoshop']
  // };

  // questionshowModal = false;
  // questionType = '';
  // questionText = '';
  // multipleOptions: { text: string; correct: boolean }[] = [{ text: '', correct: false }];
  // trueFalseAnswer = '';

  // openModal() { this.questionshowModal = true; }
  // closeModal() { this.questionshowModal = false; }

  // addOption() { this.multipleOptions.push({ text: '', correct: false }); }
  // removeOption(i: number) { this.multipleOptions.splice(i, 1); }

  // submitQuestion() {
  //   console.log('Question Type:', this.questionType);
  //   console.log('Question Text:', this.questionText);
  //   if (this.questionType === 'Multiple Choice') {
  //     console.log('Options:', this.multipleOptions);
  //   } else if (this.questionType === 'True/False') {
  //     console.log('Answer:', this.trueFalseAnswer);
  //   }
  //   this.closeModal();
  // }



