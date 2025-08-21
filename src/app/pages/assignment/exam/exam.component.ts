import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exam',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  standalone:true,
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent {
  currentPages: number = 1;

  setPage(pageNumber: number): void {
    this.currentPages = pageNumber;

  }


  // Answer Assignment

  questions = [
    { id: 1, text: "The Earth is flat.", type: "true_false" },
    { id: 2, text: "The Earth is Football.", type: "true_false" },
    { id: 3, text: "Which of the following are programming languages?", type: "multiple_choice", options: ["Python", "HTML", "C++", "CSS"] },
    { id: 4, text: "Which of the following are programming languages?", type: "multiple_choice", options: ["Python", "HTML", "C++", "CSS"] }
  ];

  answers: any = {};

  onCheckboxChange(event: any, questionId: number) {
    if (!this.answers[questionId]) {
      this.answers[questionId] = [];
    }
    if (event.target.checked) {
      this.answers[questionId].push(event.target.value);
    } else {
      this.answers[questionId] = this.answers[questionId].filter((o: any) => o !== event.target.value);
    }
  }

  submitAnswers() {
    console.log(this.answers); // Database သို့ POST လုပ်လို့ရမယ်
  }


  // Assignment Detail
  assignment = {
    title: 'Assignment 1: Write about Artificial Intelligence',
    description: 'Write at least 500 words explaining how AI can improve education.',
    deadline: new Date('2025-08-30T23:59:00'),
    totalMarks: 20,
    file: 'https://example.com/assignment1.pdf'
  };

  // goBack() {
  //   // navigation logic (e.g., router.navigate(['/assignments']))
  //   console.log('Back to assignment list');
  // }


}
