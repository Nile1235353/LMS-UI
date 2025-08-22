import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExamService } from './exam.service';

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
export class ExamComponent implements OnInit{
  currentPages: number = 1;

  assignments: any[] = [];
  selectedAssignment: any;
  questions: any[] = [];
  answers: any = {};

  constructor(private examService: ExamService) {}

  setPage(pageNumber: number): void {
    this.currentPages = pageNumber;
  }

  ngOnInit() {
    this.loadAssignments();
  }

  loadAssignments() {
    this.examService.getAllAssignments().subscribe({
      next: res => this.assignments = res,
      error: err => console.error(err)
    });
  }
  selectRow(assignment: any) {
    this.selectedAssignment = assignment;
  }

  // gotoexam() {
  //   if (!this.selectedAssignment) return;
  //   this.selectAssignment(this.selectedAssignment);
  // }

  goToDetail() {
    if (!this.selectedAssignment) return;
    this.setPage(3);
  }

  // Called when clicking the Exam button
// gotoexam() {
//   if (!this.selectedAssignment) return;

//   this.examService.getQuestionsByAssignment(this.selectedAssignment.assignmentId).subscribe({
//     next: res => {
//       this.questions = res.map(q => ({

//         id: q.questionId,
//         text: q.questionText,
//         type: q.questionType.toLowerCase().replace(' ', '_'),
//         options: q.options || [],
//         trueFalseAnswer: q.trueFalseAnswer
//       }));
//       this.answers = {};
//       this.setPage(2); // show quiz
//     },
//     error: err => console.error(err)
//   });
// }

gotoexam() {
  if (!this.selectedAssignment) return;

  this.examService.getQuestionsByAssignment(this.selectedAssignment.assignmentId).subscribe({
    next: res => {
      console.log("📌 Raw Questions from API:", res); // check API response

      this.questions = res.map(q => {
        let type = q.questionType?.toLowerCase().replace(' ', '_');
        console.log("➡️ Before normalize:", q.questionType, "➡️ After:", type);

        // normalize
        if (type === 'truefalse' || type === 'true_false') {
          type = 'true_false';
        } else if (type === 'multiplechoice' || type === 'multiple_choice') {
          type = 'multiple_choice';
        }

        return {
          id: q.questionId,
          text: q.questionText,
          type: type,
          options: q.options || [],
          trueFalseAnswer: q.trueFalseAnswer
        };
      });

      console.log("✅ Final Questions:", this.questions);

      this.answers = {};
      this.setPage(2); // show quiz
    },
    error: err => console.error("❌ Error loading questions:", err)
  });
}


  // Answer Assignment

  // questions = [
  //   { id: 1, text: "The Earth is flat.", type: "true_false" },
  //   { id: 2, text: "The Earth is Football.", type: "true_false" },
  //   { id: 3, text: "The Earth is Football.", type: "true_false" },
  //   { id: 4, text: "Which of the following are programming languages?", type: "multiple_choice", options: ["Python", "HTML", "C++", "CSS"] },
  //   { id: 5, text: "Which of the following are programming languages?", type: "multiple_choice", options: ["Python", "HTML", "C++", "CSS"] }
  // ];



  onCheckboxChange(event: any, questionId: string) {
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
    if (!this.selectedAssignment) return;

    const payload = this.questions.map(q => {
      if (q.type === 'true_false') {
        return { questionId: q.id, TrueFalseAnswer: this.answers[q.id] || null };
      } else if (q.type === 'multiple_choice') {
        return { questionId: q.id, SelectedOptionIds: this.answers[q.id] || [] };
      } else {
        return { questionId: q.id, AnswerText: this.answers[q.id] || '' };
      }
    });
    console.log('Submitting answers:', payload);

  }



  // Assignment Detail
  // assignment = {
  //   title: 'Assignment 1: Write about Artificial Intelligence',
  //   description: 'Write at least 500 words explaining how AI can improve education.',
  //   deadline: new Date('2025-08-30T23:59:00'),
  //   totalMarks: 20,
  //   file: 'https://example.com/assignment1.pdf'
  // };

  // goBack() {
  //   // navigation logic (e.g., router.navigate(['/assignments']))
  //   console.log('Back to assignment list');
  // }


}
