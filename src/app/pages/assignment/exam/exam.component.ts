import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
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
  // styleUrl: './exam.component.scss'
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit{
  currentPages: number = 1;

  assignments: any[] = [];
  selectedAssignment: any;
  questions: any[] = [];
  //answers: any = {};
  //answers: { [key: string]: any } = {};
  userList: any[] = [];
  selectedUser: any = null;
  form: FormGroup;
  FinishModal: boolean = false;
  selectedUserId: string = '';

  selectedUserName: string = '';
  selectedEmployeeId: string = '';

  answers: { [questionId: string]: any } = {};   // true/false or text
  multiAnswers: { [questionId: string]: string[] } = {}; // multiple choice

  originalAssignments: any[] = [];
  searchTerm: string = '';           
  paginatedCourses: any;

  constructor(private examService: ExamService,private fb: FormBuilder) {
    this.form = this.fb.group({
      userId: [''],
      userName: [''],
      department: [''],
      employeeId: ['']
    });
  }
  setPage(pageNumber: number): void {
    this.currentPages = pageNumber;
  }

  ngOnInit() {

    this.loadAssignments();
    this.loadUsers();
  }
  // loadAssignments() {
  //   this.examService.getAllAssignments().subscribe({
  //     next: res => this.assignments = res,
  //     error: err => console.error(err)
  //   });
  //   //console.log("Assignment:", this.selectedAssignment)
  // }

  loadAssignments() {
    this.examService.getAllAssignments().subscribe({
      next: res => {
        this.assignments = res;
        console.log("This is All Assignments Before Filter !=",this.assignments);
        this.originalAssignments = [...res]; // <-- FIX: Backup copy ကူးထားပါ
        console.log("This is All Assignments !=",this.assignments);
      },
      error: err => console.error(err)
    });
  }

// Load all users

  loadUsers() {
    this.examService.getUserList().subscribe({
      next: res => this.userList = res,
      error: err => console.error(err)
    });
  }
// select assignment row
  // selectRow(assignment: any) {
  //   this.selectedAssignment = assignment;
  // }

  selectRow(a: any): void {
    this.selectedAssignment = (this.selectedAssignment === a) ? null : a;
  }

  toggleAllCheckboxes(event: any) {
    const checked = event.target.checked;
    this.assignments.forEach(row => (row.selected = checked));
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCourses = this.assignments.slice(start, start + this.pageSize);
  }

  isAllSelected() {
    return this.assignments.length > 0 && this.assignments.every(row => row.selected);
  }

  goToDetail() {
    if (!this.selectedAssignment) return;
    this.setPage(3);
  }

  onUserIdChange(userId: string) {
    console.log('Dropdown selected userId:', userId);
    this.selectedUser = this.userList.find(u => u.UserId === userId) || null;
    console.log('selectedUser after lookup:', this.selectedUser);

    if (this.selectedUser) {
        this.form.patchValue({
            userId: this.selectedUser.UserId,
            userName: this.selectedUser.FullName,
            department: this.selectedUser.Department,
            employeeId: this.selectedUser.EmployeeId
        });
    } else {
        this.form.reset();
    }
}

gotoexam() {

  if (!this.selectedAssignment) {
    alert('Please select assignment!');
    return;
  }

console.log("Assignment:", this.selectedAssignment)

  if (!this.selectedUser) {
    alert('Please select user!');
    return;
  }

  //console.log("SelectedUserId:", this.selectedUser);
  //console.log("SelectedUserId:", this.selectedUserId);
 // console.log("SelectedUserName:", this.selectedUserName);
  //console.log("SelectedEmployeeId:", this.selectedEmployeeId);

  this.examService.getQuestionsByAssignment(this.selectedAssignment.assignmentId).subscribe({
    next: res => {
     // console.log("📌 Raw Questions from API:", res); // check API response

      this.questions = res.map(q => {
        let type = q.questionType?.toLowerCase().replace(' ', '_');
        //console.log("➡️ Before normalize:", q.questionType, "➡️ After:", type);

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
      //console.log("SelectedUserId:" , this.selectedUserId)
      console.log("📌 Selected User Info:", {
        userId: this.selectedUserId,
        name: this.selectedUserName,
        employeeId: this.selectedEmployeeId
      });

      this.answers = {};
      this.closeFinishedModal();
      this.setPage(2); // show quiz
      console.log("QuestionList:",this.questions)
    },
    error: err => console.error("❌ Error loading questions:", err)
  });
}

openFinishedModal() {
  if (!this.selectedAssignment) {
    alert('Please select an assignment first!');
    return;
  }
  this.FinishModal = true;
}
closeFinishedModal() {
  this.FinishModal = false;
  this.form.reset();
  this.selectedUser = null;
}

onUserChange(user: any) {
  this.selectedUser = user;
  if (user) {
    this.form.patchValue({
      userId: user.UserId,
      userName: user.FullName,
      department: user.Department,
      employeeId: user.EmployeeId
    });
    this.selectedUserId = user.UserId;
    this.selectedUserName = user.FullName;
    this.selectedEmployeeId = user.EmployeeId;
  } else {
    // reset
    this.selectedUserId = '';
    this.selectedUserName = '';
    this.selectedEmployeeId = '';
  }
}

onCheckboxChange(event: any, questionId: string) {
  if (!this.multiAnswers[questionId]) {
    this.multiAnswers[questionId] = [];
  }

  if (event.target.checked) {
    this.multiAnswers[questionId].push(event.target.value);
  } else {
    this.multiAnswers[questionId] = this.multiAnswers[questionId].filter(id => id !== event.target.value);
  }
}


submitAnswers() {
  if (!this.selectedAssignment) {
    alert("Please select an assignment!");
    return;
  }

  const user = this.userList.find(u => u.UserId === this.selectedUserId);
  if (!user) {
    alert("Please select a user!");
    return;
  }

  const answersPayload: any[] = [];

  for (const q of this.questions || []) {
    const answerValue = this.answers[q.id];

    // True/False question
    if (q.type === "true_false" || q.type === "true/false") {
      const submittedAnswer = answerValue === true ? "true" : answerValue === false ? "false" : "";

      let optionId: string | null = null;
      if (submittedAnswer && q.options) {
        const option = q.options.find((o: any) => o.optionText.toLowerCase() === submittedAnswer.toLowerCase());
        optionId = option ? option.optionId.toString() : null;
      }

      answersPayload.push({
        QuestionId: q.id.toString(),
        AnswerText: submittedAnswer,
        SelectedOptionId: optionId,
        //CreatedDate: new Date().toISOString(),
        CreatedUser: user.FullName,
        UpdatedUser: null,
        //UpdatedDate: new Date().toISOString()
      });
      continue;
    }

    // Multiple-choice question
    if (q.type === "multiple_choice" && q.options) {
      const selectedOptions = this.multiAnswers[q.id] || [];
      for (const optId of selectedOptions) {
        const selectedOption = q.options.find((o:any) => o.optionId.toString() === optId.toString());
        answersPayload.push({
          QuestionId: q.id.toString(),
          AnswerText: selectedOption ? selectedOption.optionText : "",
          SelectedOptionId: optId.toString(),
          //CreatedDate: new Date().toISOString(),
          CreatedUser: user.FullName,
          UpdatedUser: null,
          //UpdatedDate: new Date().toISOString()
        });
      }
      continue;
    }

    // Other question types (text)
    answersPayload.push({
      QuestionId: q.id.toString(),
      AnswerText: answerValue?.toString() || "",
      SelectedOptionId: null,
      //CreatedDate: new Date().toISOString(),
      CreatedUser: user.FullName,
      UpdatedUser: null,
      //UpdatedDate: new Date().toISOString()
    });
  }
  console.log("Answer payload:", answersPayload);
  const submissionPayload: any = {
    AssignmentId: this.selectedAssignment.assignmentId,
    UserId: user.UserId,
    FullName: user.FullName,
    Score: 0,
    ExamResult: "",
    SubmittedAt: new Date().toISOString(),
    CreatedDate: new Date().toISOString(),
    CreatedUser: user.FullName,
    UpdatedUser: null,
    UpdatedDate: new Date().toISOString(),
    AnswerList: answersPayload
  };

  console.log("Submitting payload:", submissionPayload);

  this.examService.submitAssignment(submissionPayload).subscribe({
    next: () => {
      alert("Answers submitted successfully!");
      this.setPage(1);
      this.selectedAssignment = null;
     this.selectedUserId = "";
     this.answers = {};
    },
    error: err => {
      console.error("Submission error:", err);
      alert("Failed to submit answers!");
    }
  });
}

sortedColumn: string | null = null;
sortState: 'normal' | 'asc' | 'desc' = 'normal';

currentPage = 1;
pageSize = 7; 

applyFilterAndSort(): void {
    
    let items: any[] = [...this.originalAssignments];

    // 2. Filter Logic (Search Term)
    // assignment data 'title'
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      items = items.filter(item => 
        (item.title && item.title.toLowerCase().includes(lowerSearchTerm)) ||
        (item.department && item.department.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // 3. Sorting Logic
    if (this.sortState !== 'normal' && this.sortedColumn) {
      const col = this.sortedColumn;
      items.sort((a, b) => {
        const aValue = a[col];
        const bValue = b[col];

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
    
    this.assignments = items;
  }

  onSearch(): void {
    this.currentPage = 1; // Search to page 1
    this.applyFilterAndSort();
  }

  /**
   * Header Double Click
   */
  onHeaderDoubleClick(column: string): void {
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
    this.currentPage = 1; // Sort to page 1
    this.applyFilterAndSort();
  }

  /**
   * HTML in *ngFor 
   */
  get paginatedAssignments(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.assignments.slice(start, end); // assignments array (Filter+Sort )
  }

  /**
   * Page Getter
   */
  get totalPages(): number {
    return Math.ceil(this.assignments.length / this.pageSize); // assignments (Filter+Sort )
  }

  /**
   * Page changing Function
   */
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
