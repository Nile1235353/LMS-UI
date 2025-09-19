
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuestionService } from './question.service';

interface Assignment {
  assignmentId: string; // ID ဖြစ်တဲ့အတွက် number (သို့မဟုတ် string)
  title: string;
  description: string;
  department: string;
  startDate: string | Date;
  dueDate: string | Date;
  maxScore: number;
  minimumScore: number;
  createdDate: string | Date;

}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  assignments: any[] = [];
  selectedAssignment: any = null;
  selectedAssignmentId: string | null = null;
  currentPages: number = 1;
  createModel = false;
  createQuestionModel = false;
  editModel = false;
  questionModal = false;
  optionModal = false;
  questions: any[] = [];
  assignmentForm!: FormGroup;
  questionForm!: FormGroup;
  questionType = '';
  questionText = '';
  multipleOptions: { text: string; correct: boolean }[] = [{ text: '', correct: false }];
  trueFalseAnswer = false;
  editForm!: FormGroup;
  points?: number;

  currentPage = 1;
  // totalPages = 1; // Removed duplicate property
  paginatedCourses: any[] = [];
  courses: any[] = [];
  pageSize = 7;
  tableRows: any[] = [];
  searchTerm: any;

  selectedCourseId: string | null = null;


  constructor(private assignmentService: QuestionService, private fb: FormBuilder) {}

  ngOnInit(): void {
    // Assignment form
    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      minimumScore: ['', Validators.required],
      maxScore: ['', Validators.required],
      department: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],

    });

    // Question form
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['', Validators.required],
      trueFalseAnswer: [false],
      options: this.fb.array<FormGroup>([])
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      minimumScore: [0, Validators.required],
      maxScore: [0, Validators.required],
      department: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
    this.getAllAssignments();
  }

  toggleCourseSelection(courseId: string): void {
    if (this.selectedAssignment === courseId) {
      this.selectedAssignment = null; // deselect
    } else {
      this.selectedAssignment = courseId; // select
    }
    console.log('Selected Course ID:', this.selectedAssignment);
  }

  toggleAllCheckboxes(event: any) {
    const checked = event.target.checked;
    this.assignments.forEach(row => (row.selected = checked));
    this.paginate();
  }

  // Assignments
  // getAllAssignments(): void {
  //   this.assignmentService.getAllAssignments().subscribe({
  //     next: (data) => (this.assignments = data),
  //     error: (err) => console.error('Error fetching assignments:', err)
  //   });
  // }

  getAllAssignments(): void {
    this.assignmentService.getAllAssignments().subscribe({
      next: (data) => {
        this.assignments = data;
        this.originalUsers = [...data]; // <-- FIX: Original data ကို copy ကူးထားပါ
      },
      error: (err) => console.error('Error fetching assignments:', err)
    });
  }

  isAllSelected() {
    return this.assignments.length > 0 && this.assignments.every(row => row.selected);
  }

  goback() {
    // This is Go Back Function
    this.selectedAssignment = false;
    this.setPage(1);
    this.getAllAssignments();
  }


  createAssignment() {
    if (!this.assignmentForm.valid) {
      alert('❌ Please fill all required fields!');
      return;
    }

    const newAssignment = {
      ...this.assignmentForm.value,
      dueDate: this.assignmentForm.value.dueDate ?? new Date(),
      maxScore: this.assignmentForm.value.maxScore ?? 100,
      minimumScore: this.assignmentForm.value.minimumScore ?? 0,

      questions: []
    };

    this.assignmentService.createAssignment(newAssignment).subscribe({
      next: (res) => {
        alert('✅ Assignment Created Successfully!');
        this.closeCreateModal();
        this.assignments.unshift(res);
        this.assignments = [...this.assignments];
        this.selectedAssignment = res;
        this.selectedAssignmentId = res.assignmentId;
        this.setPage(2);
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Unknown error';
        alert(`❌ Failed to create assignment: ${message}`);
      }
    });
  }

  // Modal controls
  openCreateModal() { this.createModel = true; }
  closeCreateModal() { this.createModel = false; this.assignmentForm.reset(); }

  openCreateQuestionModel() {
    this.createQuestionModel = true;
    this.resetQuestionForm();
    this.options.clear();
    this.addOption();
  }
  closeCreateQuestionModel() { this.createQuestionModel = false; }
  closeModal() { this.questionshowModal = false; }
  questionshowModal = false;
  openModal() { this.questionshowModal = true; }
  openQuestionModal() { this.questionModal = true; }
  closeQuestionModal() { this.questionModal = false; }

  openOptionModal() { this.optionModal = true; }
  closeOptionModal() { this.optionModal = false; }

  //openEditModal() { this.editModel = true; }
  //closeEditModal() { this.editModel = false; }

  // Pagination
  setPage(pageNumber: number): void {
    this.currentPages = pageNumber;
    if (pageNumber === 1) this.loadAssignments();
    else if (pageNumber === 2 && this.selectedAssignmentId) this.loadAssignmentDetail(this.selectedAssignmentId);
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCourses = this.courses.slice(start, start + this.pageSize);
  }

  // toggleAllCheckboxes(event: any) {
  //   const checked = event.target.checked;
  //   this.tableRows.forEach(row => (row.selected = checked));
  //   this.paginate();
  // }

  loadAssignments() {
    this.assignmentService.getAllAssignments().subscribe({
      next: (res) => { 
        this.assignments = res,
        this.originalUsers = [...res]
      },
      error: (err) => console.error('Failed to load assignments', err)
    });
  }

  loadAssignmentDetail(id: string) {
    this.assignmentService.getAssignmentById(id).subscribe({
      next: (res) => {
        this.selectedAssignment = res;
        console.log(this.selectedAssignment);
        this.questions = res.questions || [];
      },
      error: (err) => console.error('Failed to load assignment detail', err)
    });
  }

  // Question form helpers
  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() { this.multipleOptions.push({ text: '', correct: false }); }

  removeOption(index: number) {
    if (this.options.length > 1) this.options.removeAt(index);
    this.multipleOptions.splice(index, 1);
  }

  resetQuestionForm() {
    this.questionText = '';
    this.questionType = '';
    this.multipleOptions = [{ text: '', correct: false }];
    this.trueFalseAnswer = false;
    this.points = undefined; // clear previous value
  }

  saveQuestion(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    const formValue = form.value;
    const now = new Date().toISOString();
    console.log("Raw Form Data:", formValue);

    const baseQuestion = {
      questionText: formValue.questionText,
      questionType: formValue.questionType,
      points: this.points,
      trueFalseAnswer: formValue.questionType === 'True/False' ? formValue.trueFalseAnswer : null,
      //point: formValue.points || 0, // <-- Use 'point' to match your table binding


      createdDate: now,
      createdUser: "system",
      updatedDate: now,
      updatedUser: "system",
      options: [] as any[]
    };

    // Populate options based on question type
    if (formValue.questionType === 'True/False') {
      baseQuestion.options = [
        {
          optionText: "True",
          isCorrect: formValue.trueFalseAnswer === true,
          createdDate: now,
          createdUser: "system",
          updatedDate: now,
          updatedUser: "system"
        },
        {
          optionText: "False",
          isCorrect: formValue.trueFalseAnswer === false,
          createdDate: now,
          createdUser: "system",
          updatedDate: now,
          updatedUser: "system"
        }
      ];
    } else if (formValue.questionType === 'Multiple Choice') {
      baseQuestion.options = this.multipleOptions.map(opt => ({
        optionText: opt.text,
        isCorrect: opt.correct,
        createdDate: now,
        createdUser: "system",
        updatedDate: now,
        updatedUser: "system"
      }));
    }

    console.log("Final Question Payload:", baseQuestion);

    this.assignmentService.createQuestion(this.selectedAssignment.assignmentId, [baseQuestion])
      .subscribe({
        next: (res) => {
          console.log('✅ Question saved', res);
          alert('✅ Question saved successfully!');

  // ✅ Refresh questions from backend
  this.assignmentService.getQuestionsByAssignment(this.selectedAssignment.assignmentId)
    .subscribe(qs => {
      this.selectedAssignment.questions = qs;
    });

         form.resetForm();
          this.resetQuestionForm();
        this.closeModal();
        },
        error: (err) => {
          console.error('❌ Error saving question', err);
          alert('❌ Error saving question. Please try again.');
        }
      });
  }

/// radio button change event
// onSelectAssignment(item: any) {
//   this.selectedAssignment = item;
// }

onSelectAssignment(item: any): void {
  if (this.selectedAssignment === item) {
    // (Row တူတူကို ထပ်နှိပ်ရင်)
    this.selectedAssignment = null; // null (deselect) လုပ်လိုက်ပါ
  } else {
    // (Row အသစ်ကို နှိပ်ရင်)
    this.selectedAssignment = item; // select လုပ်ပါ
  }
}

// modal open function
openEditModal() {
  if (!this.selectedAssignment) {
    alert('❌ Please select an assignment first!');
    return;
  }

  this.editModel = true;

  this.editForm.patchValue({
    title: this.selectedAssignment.title,
    description: this.selectedAssignment.description,
    minimumScore: this.selectedAssignment.minimumScore,
    maxScore: this.selectedAssignment.maxScore,
    department: this.selectedAssignment.department,
    startDate: this.selectedAssignment.startDate,
    dueDate: this.selectedAssignment.dueDate
  });
}

// update assignment
updateAssignment() {
  if (!this.editForm.valid || !this.selectedAssignment) return;

  const updatedAssignment = {
    ...this.editForm.value,
    assignmentId: this.selectedAssignment.assignmentId
  };

  this.assignmentService.updateAssignment(this.selectedAssignment.assignmentId, updatedAssignment)
    .subscribe({
      next: (res) => {
        alert('✅ Assignment Updated Successfully!');
        this.closeEditModal();

        // update locally
        const index = this.assignments.findIndex(a => a.assignmentId === this.selectedAssignment.assignmentId);
        if (index > -1) {
          this.assignments[index] = res;
          this.assignments = [...this.assignments]; // trigger change detection
        }
      },
      error: (err) => {
        alert(`❌ Failed to update assignment: ${err?.error?.message || err?.message}`);
      }
    });
}

// Modal close function
closeEditModal() {
  this.editModel = false;
  this.editForm.reset();
  this.selectedAssignmentId = null;
}

deleteSelectedQuestions() {
  const selected = this.selectedAssignment.questions.filter((q: any) => q.selected);

  if (!selected.length) {
    alert('Please select at least one question to delete.');
    return;
  }

  if (confirm(`Are you sure you want to delete ${selected.length} question(s)?`)) {
    selected.forEach((q: any) => {
      this.assignmentService.deleteQuestion(this.selectedAssignment.assignmentId, q.questionId).subscribe({
        next: () => {

          this.selectedAssignment.questions = this.selectedAssignment.questions.filter(
            (x: any) => x.questionId !== q.questionId
          );
        },
        error: (err) => {
          console.error('Error deleting question', err);
        }
      });
    });
  }
}

 // Sorting Table Fields

  // user: Assignment[] = [];
  originalUsers: Assignment[] = []; // Store original unsorted data
  sortedColumn: string | null = null;
  sortState: 'normal' | 'asc' | 'desc' = 'normal';
  // courses: any[] = [];

  // onHeaderDoubleClick(column: string): void {
  //   console.log(column)
  //   console.log(this.sortedColumn)
  //   if (this.sortedColumn !== column) {
  //     // New column - start with ascending
  //     this.sortedColumn = column;
  //     this.sortState = 'asc';
  //     // console.log(this.sortedColumn);
  //   } else {
  //     // Same column - cycle through states
  //     switch (this.sortState) {
  //       case 'normal':
  //         this.sortState = 'asc';
  //         this.sortedColumn = column;
  //         break;
  //       case 'asc':
  //         this.sortState = 'desc';
  //         break;
  //       case 'desc':
  //         this.sortState = 'normal';
  //         this.sortedColumn = null;
  //         break;
  //     }
  //   }

  //   console.log(this.sortState)

  //   // this.applySorting();
  // }

  onHeaderDoubleClick(column: string): void {
    console.log(column);
    console.log(this.sortedColumn);

    if (this.sortedColumn !== column) {
      this.sortedColumn = column;
      this.sortState = 'asc';
    } else {
      switch (this.sortState) {
        case 'normal':
          this.sortState = 'asc';
          this.sortedColumn = column;
          break;
        case 'asc':
          this.sortState = 'desc';
          break;
        case 'desc':
          this.sortState = 'normal';
          this.sortedColumn = null;
          break;
      }
    }

    this.currentPage = 1; // Reset page
    
    // function အသစ်ကို ခေါ်ပါ
    this.applyFilterAndSort(); // <-- (applySorting() အစား ဒါကို ပြောင်းခေါ်ပါ)
  }

  // applySorting(): void {
    
  //   if (this.sortState === 'normal') {
  //     // Reset to original order
  //     this.assignments = [...this.originalUsers];
  //     return;
  //   }

  //   // Create a new array to sort
  //   this.assignments = [...this.assignments].sort((a, b) => {
  //     const aValue = a[this.sortedColumn as keyof Assignment];
  //     const bValue = b[this.sortedColumn as keyof Assignment];

  //     // For numeric values
  //     if (typeof aValue === 'number' && typeof bValue === 'number') {
  //       return this.sortState === 'asc' ? aValue - bValue : bValue - aValue;
  //     }

  //     // For string values
  //     if (typeof aValue === 'string' && typeof bValue === 'string') {
  //       return this.sortState === 'asc'
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     }

  //     if (aValue == null) return 1;
  //     if (bValue == null) return -1;

  //     // For date values (string or Date)
  //     if ((typeof aValue === 'string' || aValue instanceof Date) &&
  //         (typeof bValue === 'string' || bValue instanceof Date)) {
  //       const aTime = new Date(aValue).getTime();
  //       const bTime = new Date(bValue).getTime();
  //       return this.sortState === 'asc' ? aTime - bTime : bTime - aTime;
  //     }

  //     console.log("This is aValue = !",aValue)

  //     return 0;
  //   });
  // }

  /**
   * Filter (Search) အရင်လုပ်ပြီး၊ ရလာတဲ့ Data ကိုမှ Sort ဆက်လုပ်မယ့် Function
   */
  applyFilterAndSort(): void {
    
    // 1. မူရင်း data (originalUsers) ကနေ အမြဲတမ်း ပြန်စပါ
    let items: Assignment[] = [...this.originalUsers];

    // 2. Filter Logic (Search Term)
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      items = items.filter(assignment => 
        (assignment.title && assignment.title.toLowerCase().includes(lowerSearchTerm)) ||
        (assignment.department && assignment.department.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // 3. Sorting Logic (သင့် logic အတိုင်းပါပဲ)
    if (this.sortState !== 'normal' && this.sortedColumn) {
      items.sort((a, b) => {
        const aValue = a[this.sortedColumn as keyof Assignment];
        const bValue = b[this.sortedColumn as keyof Assignment];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return this.sortState === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortState === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if ((typeof aValue === 'string' || aValue instanceof Date) &&
            (typeof bValue === 'string' || bValue instanceof Date)) {
          const aTime = new Date(aValue).getTime();
          const bTime = new Date(bValue).getTime();
          return this.sortState === 'asc' ? aTime - bTime : bTime - aTime;
        }
        return 0;
      });
    }
    
    // 4. အဓိက 'assignments' array ကို Filter + Sort လုပ်ပြီးသား data နဲ့ အစားထိုးပါ
    this.assignments = items;
  }

  onSearch(): void {
    this.currentPage = 1; // Search လုပ်ရင် Page 1 ကို အမြဲပြန်သွားပါ
    this.applyFilterAndSort();
  }


  get paginatedAssignments(): Assignment[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.assignments.slice(start, end); // assignments array (Filter+Sort လုပ်ပြီးသား) ကို ဖြတ်ပါ
  }

  get totalPages(): number {
    return Math.ceil(this.assignments.length / this.pageSize); // assignments (Filter+Sort လုပ်ပြီးသား) အရေအတွက်ပေါ် တွက်ပါ
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  prevPage(): void {
    this.changePage(this.currentPage - 1);
  }

}
