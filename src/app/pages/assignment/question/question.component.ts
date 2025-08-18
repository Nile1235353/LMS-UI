import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    RouterModule,ReactiveFormsModule
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {
  assignments: any[] = [];

currentPages: number = 1;
createModel: boolean = false;
createQuestionModel: boolean = false;
editModel: boolean = false;
questionModal: boolean = false;
optionModal: boolean = false;

constructor(private assignmentService: QuestionService) {}

ngOnInit(): void {
  this.getallassignments();
}

getallassignments(): void {
  this.assignmentService.getAllAssignments().subscribe({
    next: (data) => {
      this.assignments = data;
    },

    error: (err) => {
      console.error('Error fetching assignments:', err);
    }
  });
}
openOptionModal() {
  this.optionModal = true;
}

closeOptionModal() {
  this.optionModal = false;
}

openQuestionModal() {
  this.questionModal = true;
}

closeQuestionModal() {
  this.questionModal = false;
}

openEditModal() {
  this.editModel = true;
}

closeEditModal() {
  this.editModel = false;
}

opencreateQuestionModel() {
  this.createQuestionModel = true;
}

closeCreateQuestionModel() {
  this.createQuestionModel = false;
}

openCreateModal() {
  this.createModel = true;
}

closeCreateModal() {
  this.createModel = false;
}

CreateAssignment() {
  this.closeCreateModal();
  this.setPage(2);
}

setPage(pageNumber: number): void {
  this.currentPages = pageNumber;

}

}
