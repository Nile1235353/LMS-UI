import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-question',
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,ReactiveFormsModule,FormsModule
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent implements OnInit{
  assignments: any[] = [];
  selectedAssignment: any = null;
  assignmentForm!: FormGroup;
currentPages: number = 1;
createModel: boolean = false;
createQuestionModel: boolean = false;
editModel: boolean = false;
questionModal: boolean = false;
optionModal: boolean = false;
questions: any[] = [];   // ✅ Add questions array
selectedAssignmentId: string | null = null;
questionForm!: FormGroup; // declare only


// ngOnInit(): void {
//   this.getallassignments();
// }

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

// openOptionModal() {
//   this.optionModal = true;
// }

// closeOptionModal() {
//   this.optionModal = false;
// }

// openQuestionModal() {
//   this.questionModal = true;
// }

// closeQuestionModal() {
//   this.questionModal = false;
// }

// openEditModal() {
//   this.editModel = true;
// }

// closeEditModal() {
//   this.editModel = false;
// }

// opencreateQuestionModel() {
//   this.createQuestionModel = true;
// }

// closeCreateQuestionModel() {
//   this.createQuestionModel = false;
// }

// openCreateModal() {
//   this.createModel = true;
// }

// closeCreateModal() {
//   this.createModel = false;
// }

// CreateAssignment() {
//   this.closeCreateModal();
//   this.setPage(2);
// }

// setPage(pageNumber: number): void {
//   this.currentPages = pageNumber;

// }


//This is Add Question


questionshowModal = false;
  // Question Form
  questionType = '';
  questionText = '';
  multipleOptions: { text: string; correct: boolean }[] = [{ text: '', correct: false }];
  trueFalseAnswer: boolean | null = null;

constructor(private assignmentService: QuestionService,  private fb: FormBuilder,) {}

onSelectAssignment(item: any) {
  this.selectedAssignmentId = item.assignmentId;
}

// getallassignments(): void {
//   this.assignmentService.getAllAssignments().subscribe({
//     next: (data) => {
//       this.assignments = data;
//     },

//     error: (err) => {
//       console.error('Error fetching assignments:', err);
//     }
//   });
// }

getAllAssignments(): void {
  this.assignmentService.getAllAssignments().subscribe({
    next: (data) => (this.assignments = data),
    error: (err) => console.error('Error fetching assignments:', err),
  });
}

ngOnInit(): void {
  // Form initialization
  this.assignmentForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    minimumScore: ['', Validators.required],
    maxScore: ['', Validators.required],
    department: ['', Validators.required],
    startDate: ['', Validators.required],
    dueDate: ['', Validators.required],

  });

  // this.questionForm = this.fb.group({
  //   questionText: ['', Validators.required],
  //   questionType: ['', Validators.required], // MCQ or True/False
  //   trueFalseAnswer: [null],                 // for True/False
  //   options: this.fb.array<FormGroup>([])             // for MCQ
  //   //points: [0, Validators.required],
  // });
  // Load all assignments
  this.getAllAssignments();
}

createAssignment() {
  // 1️⃣ Check if form is valid
  if (!this.assignmentForm.valid) {
    alert('❌ Please fill all required fields!');
    console.warn('Invalid Form:', this.assignmentForm.value);
    return;
  }

  // 2️⃣ Prepare assignment data with defaults
  const newAssignment = {
    ...this.assignmentForm.value,
    dueDate: this.assignmentForm.value.dueDate ?? new Date(), // required
    maxScore: this.assignmentForm.value.maxScore ?? 100,      // default 100
    minimumScore: this.assignmentForm.value.minimumScore ?? 0,// default 0
    questions: []
  };

  console.log('Creating Assignment:', newAssignment);

  // 3️⃣ Call API
  this.assignmentService.createAssignment(newAssignment).subscribe({
    next: (res) => {
      console.log('Assignment Created:', res);
      alert('✅ Assignment Created Successfully!');

      // Close modal if using modal
      this.closeCreateModal();

      // Update table: add new assignment at top
      this.assignments.unshift(res);
      this.assignments = [...this.assignments];

      // Update detail view
      this.selectedAssignment = res;
      this.selectedAssignmentId = res.assignmentId;
      this.setPage(2); // Load detail page
    },
    error: (err) => {
      console.error('Create Assignment Error:', err);

      // Show backend error if available
      const message = err?.error?.message || err?.message || 'Unknown error';
      alert(`❌ Failed to create assignment: ${message}`);
    }
  });
}


openOptionModal() {this.optionModal = true;}

closeOptionModal() {this.optionModal = false;}

openQuestionModal() {this.questionModal = true;}

closeQuestionModal() {this.questionModal = false;}

openEditModal() {this.editModel = true;}

closeEditModal() {this.editModel = false;}

opencreateQuestionModel() {this.createQuestionModel = true;}

closeCreateQuestionModel() {this.createQuestionModel = false;}
// Modal controls
openCreateQuestionModel() {
  this.createQuestionModel = true;
  this.questionForm.reset();
  this.options.clear();
  this.addOption();
}


openCreateModal() {this.createModel = true;}

closeCreateModal() {
  this.createModel = false;
  this.assignmentForm.reset();
}
openModal() { this.questionshowModal = true; }
closeModal() { this.questionshowModal = false; }
addOption() { this.multipleOptions.push({ text: '', correct: false }); }

  //removeOption(i: number) { this.multipleOptions.splice(i, 1); }



setPage(pageNumber: number): void {
  this.currentPages = pageNumber;
  if (pageNumber === 1) {
    this.loadAssignments();
  } else if (pageNumber === 2 && this.selectedAssignmentId) {
    // Detail view load
    this.loadAssignmentDetail(this.selectedAssignmentId);
  }
}

// Detail load function
loadAssignmentDetail(id: string) {
  this.assignmentService.getAssignmentById(id).subscribe({
    next: (res) => {
      this.selectedAssignment = res;
      this.questions = res.questions || [];
    },
    error: (err) => {
      console.error('Failed to load assignment detail', err);
    }
  });
}


// Page 1 table အတွက် assignments load function
loadAssignments() {
  this.assignmentService.getAllAssignments().subscribe({
    next: (res) => {
      this.assignments = res; // Table data update
    },
    error: (err) => {
      console.error('Failed to load assignments', err);
    }
  });
}

resetQuestionForm() {
  this.questionText = '';
  this.questionType = '';
  this.multipleOptions = [{ text: '', correct: false }];
  this.trueFalseAnswer = null;
}


get options(): FormArray {
  return this.questionForm.get('options') as FormArray;
}



removeOption(index: number) {
  if (this.options.length > 1) {
    this.options.removeAt(index,);
  }
}

// Helper function for timestamps
private now() {
  return new Date().toISOString();
}


saveQuestion(form: NgForm) {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  const formValue = form.value;
  const now = new Date().toISOString();

  const baseQuestion = {
    questionId: "",
    assignmentId: this.selectedAssignment.assignmentId,
    questionText: formValue.questionText,
    questionType: formValue.questionType,
    trueFalseAnswer: formValue.questionType === 'True/False' ? formValue.trueFalseAnswer : null,
    points: formValue.points || 0,
    createdDate: now,
    createdUser: "system",
    updatedDate: now,
    updatedUser: "system",
    options: [] as any[]
  };

  if (formValue.questionType === 'True/False') {
    baseQuestion.options = [{
      optionId: "",
      questionId: "",
      optionText: formValue.trueFalseAnswer ? "True" : "False",
      isCorrect: true,
      createdDate: now,
      createdUser: "system",
      updatedDate: now,
      updatedUser: "system"
    }];
  }

  if (formValue.questionType === 'Multiple Choice') {
    baseQuestion.options = this.multipleOptions.map(opt => ({
      optionId: "",
      questionId: "",
      optionText: opt.text,
      isCorrect: opt.correct,
      createdDate: now,
      createdUser: "system",
      updatedDate: now,
      updatedUser: "system"
    }));
  }

  const payload = [baseQuestion];
  console.log("➡️ Final payload:", payload);

  this.assignmentService.createQuestion(this.selectedAssignment.assignmentId, payload)
    .subscribe({
      next: res => {
        console.log('✅ Question saved', res);
        form.resetForm();
        this.multipleOptions = [];
      },
      error: err => console.error('❌ Error saving question', err)
    });
}

resetForm() {
  this.questionForm.reset();
  this.options.clear();
}

}
