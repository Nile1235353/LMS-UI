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
  answers: { [key: string]: any } = {};
  userList: any[] = [];
  selectedUser: any = null;
  form: FormGroup;
  FinishModal: boolean = false;
  selectedUserId: string = '';

  selectedUserName: string = '';
selectedEmployeeId: string = '';

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
  loadAssignments() {
    this.examService.getAllAssignments().subscribe({
      next: res => this.assignments = res,
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
  selectRow(assignment: any) {
    this.selectedAssignment = assignment;
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

  console.log("SelectedUserId:", this.selectedUser);
  console.log("SelectedUserId:", this.selectedUserId);
  console.log("SelectedUserName:", this.selectedUserName);
  console.log("SelectedEmployeeId:", this.selectedEmployeeId);

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
  if (!this.answers[questionId]) this.answers[questionId] = [];

  const value: string = event.target.value; // string အနေနဲ့ ထားမယ်

  if (event.target.checked) {
    this.answers[questionId].push(value);
  } else {
    // ✅ filter v ကို string type နဲ့ သတ်မှတ်
    this.answers[questionId] = this.answers[questionId].filter((v: string) => v !== value);
  }
}


// Checkbox change for multiple-choice
// onCheckboxChange(event: any, questionId: string) {
//   if (!this.answers[questionId]) this.answers[questionId] = [];

//   const value = Number(event.target.value); // convert to number

//   if (event.target.checked) {
//     this.answers[questionId].push(value);
//   } else {
//     this.answers[questionId] = this.answers[questionId].filter(o => o !== value);
//   }
// }

//submitAnswers
// submitAnswers() {
//   if (!this.selectedAssignment) {
//     alert('Please select assignment!');
//     return;
//   }

//   const user = this.userList.find(u => u.UserId === this.selectedUserId);
//   if (!user) {
//     alert('Please select user!');
//     return;
//   }
//   this.selectedUser = user;

//   // Build answers properly per question type
//   const answersPayload = this.questions.flatMap(q => {
//     if (q.type === 'true_false') {
//       return [{
//         AnswerId: null,
//         SubmissionId: null,
//         OptionId: "", // string field, keep "" instead of null
//         QuestionId: q.id.toString(), // DTO expects string
//         AnswerText: this.answers[q.id]?.toString() || "",
//         SelectedOptionId: null,
//         CreatedDate: new Date().toISOString(),
//         CreatedUser: user.FullName,
//         UpdatedUser: "",
//         UpdatedDate: new Date().toISOString()
//       }];
//     } else if (q.type === 'multiple_choice') {
//       return (this.answers[q.id] || []).map((optId: number) => ({
//         AnswerId: null,
//         SubmissionId: null,
//         OptionId: optId.toString(), // convert to string
//         QuestionId: q.id.toString(),
//         AnswerText: "",
//         SelectedOptionId: optId,
//         CreatedDate: new Date().toISOString(),
//         CreatedUser: user.FullName,
//         UpdatedUser: "",
//         UpdatedDate: new Date().toISOString()
//       }));
//     } else {
//       return [{
//         AnswerId: null,
//         SubmissionId: null,
//         OptionId: "",
//         QuestionId: q.id.toString(),
//         AnswerText: this.answers[q.id] || "",
//         SelectedOptionId: null,
//         CreatedDate: new Date().toISOString(),
//         CreatedUser: user.FullName,
//         UpdatedUser: "",
//         UpdatedDate: new Date().toISOString()
//       }];
//     }
//   });

//   // Final submission payload
//   const submissionPayload = {
//     SubmissionId: null,
//     AssignmentId: this.selectedAssignment.assignmentId,
//     UserId: this.selectedUser.UserId,   // ✅ use correct property from user
//     FullName: this.selectedUser.FullName,
//     Score: 0,
//     ExamResult: "",
//     SubmittedAt: new Date().toISOString(),
//     CreatedDate: new Date().toISOString(),
//     CreatedUser: this.selectedUser.FullName,
//     UpdatedUser: "",
//     UpdatedDate: new Date().toISOString(),
//     Answers: answersPayload
//   };

//   console.log("Submitting payload:", JSON.stringify(submissionPayload, null, 2));

//   this.examService.submitAssignment(submissionPayload).subscribe({
//     next: res => {
//       alert("Answers submitted successfully!");
//       this.setPage(1);
//       this.selectedAssignment = null;
//       this.selectedUserId = "";
//       this.answers = {};
//     },
//     error: err => {
//       console.error("Submission error:", err);
//       alert("Failed to submit answers!");
//     }
//   });
// }

submitAnswers() {
  if (!this.selectedAssignment) {
    alert("Please select assignment!");
    return;
  }

  const user = this.userList.find(u => u.UserId === this.selectedUserId);
  if (!user) {
    alert("Please select user!");
    return;
  }
  this.selectedUser = user;

  // Build payload for answers
  const answersPayload = this.questions.flatMap(q => {
    const answerValue = this.answers[q.id];

    // True/False question
    if (q.type === 'true_false' || q.type === 'true/false') {
      const selectedValue = answerValue === true ? 1 : answerValue === false ? 0 : null;

      return [{
        QuestionId: q.id.toString(),
        AnswerText: selectedValue !== null ? answerValue.toString() : "",
        OptionId: null,
        SelectedOptionId: selectedValue, // ✅ int
        CreatedDate: new Date().toISOString(),
        CreatedUser: user.FullName,
        UpdatedUser: null,
        UpdatedDate: new Date().toISOString()
      }];
    }

    // Multiple choice question
    // if (q.type === 'multiple_choice') {
    //   return (answerValue || []).map((optId: string | number) => ({
    //     QuestionId: q.id.toString(),
    //     AnswerText: "",
    //     OptionId: optId.toString(),
    //     SelectedOptionId: optId.toString(),
    //     CreatedDate: new Date().toISOString(),
    //     CreatedUser: user.FullName,
    //     UpdatedUser: null,
    //     UpdatedDate: new Date().toISOString()
    //   }));
    // }

    // Other question types (text)
    return [{
      QuestionId: q.id.toString(),
      AnswerText: answerValue?.toString() || "",
      OptionId: null,
      SelectedOptionId: null,
      CreatedDate: new Date().toISOString(),
      CreatedUser: user.FullName,
      UpdatedUser: null,
      UpdatedDate: new Date().toISOString()
    }];
  });

  // Final submission payload
  const submissionPayload = {
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
    Answers: answersPayload
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


}
