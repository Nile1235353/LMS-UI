import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {

currentPages: number = 1;
createModel: boolean = false;
createQuestionModel: boolean = false;
editModel: boolean = false;
questionModal: boolean = false;
optionModal: boolean = false;

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

  // if (pageNumber === 3 && this.selectedCourseId) {
  //   //this.editCourse(this.selectedCourseId); // Load course for editing
  // }
}

}
