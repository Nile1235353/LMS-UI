import { Component } from '@angular/core';
import bootstrap from '../../../../main.server';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
export class AnswerComponent {


  currentPages: number = 1;

  setPage(pageNumber: number): void {
    this.currentPages = pageNumber;

  }

  // Answer Detail

  questions = [
    { id: 'q1', text: 'The Earth is flat.', type: 'truefalse', correctAnswer: 'false' },
    { id: 'q2', text: 'Which of the following are programming languages?', type: 'mcq', 
      options: ['Python', 'HTML', 'C++', 'Photoshop'], correctAnswer: ['Python', 'C++'] },
      { id: 'q3', text: 'The Earth is flat.', type: 'truefalse', correctAnswer: 'false' },
      { id: 'q4', text: 'Which of the following are programming languages?', type: 'mcq', 
      options: ['Python', 'HTML', 'C++', 'Photoshop'], correctAnswer: ['Python', 'C++'] },
     
  ];

  answers: any = {
    q1: 'true',
    q2: ['Python', 'HTML'],
    q3: 'false',
    q4: ['C++','Photoshop']
  };


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

 
}
