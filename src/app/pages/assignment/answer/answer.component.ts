import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormsModule } from '@angular/forms';
import { AnswerserviceService, AssignmentQuestionDto } from './answerservice.service';
import { Subscription } from 'rxjs';

interface Submission {
  submissionId: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentDescription: string;
  userId: string;
  fullName: string;
  score: number;
  examResult: string;
  submittedAt: string | Date;
  selected?: boolean; // Add selected property
  [key: string]: any; 
}

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

  submissions: Submission[] = [];
  originalSubmissions: Submission[] = []; 

  currentPages: number = 1; 
  selectedSubmissionId: string | null = null; 

  // Filter, Sort, Paginate properties
  searchTerm: string = '';
  sortedColumn: string | null = null;
  sortState: 'normal' | 'asc' | 'desc' = 'normal';
  currentPage = 1;  
  pageSize = 7;

  // Detail page properties
  questions: AssignmentQuestionDto[] = [];
  answers: { [questionId: string]: any } = {};

  constructor(private AnswerserviceService: AnswerserviceService) {}

  ngOnInit(): void {
    this.getAllData();
  }

  setPage(pageNumber: number): void {
    this.currentPages = pageNumber;
  }

  getAllData(): void {
    this.AnswerserviceService.getallsubmission().subscribe({
      next: (res: Submission[]) => { 
        this.submissions = res;
        this.originalSubmissions = [...res];
        console.log("All Submissions:", this.submissions);
      },
      error: (err) => {
        console.error("Error fetching submissions:", err);
      }
    });
  }

  viewDetails(submissionId: string | null) {
    if (!submissionId) {
        console.error("Submission ID is null, cannot view details.");
        return;
    }
    this.AnswerserviceService.getQuestionsWithAnswers(submissionId).subscribe({
      next: (res) => {
        this.questions = res;
        this.answers = {};
        this.questions.forEach(q => {
          if (q.questionType === 'truefalse') {
            this.answers[q.questionId] = q.answers?.[0]?.answerText === 'true';
          } else if (q.questionType === 'mcq') {
            this.answers[q.questionId] = q.answers?.map(a => a.selectedOptionId) || [];
          }
        });
        this.currentPages = 2; // Switch to detail view
      },
      error: (err) => console.error(err)
    });
  }

  // =================================================================
  // --- START: Filter, Sort, Paginate Logic Functions ---
  // =================================================================

  applyFilterAndSort(): void {
    let items: Submission[] = [...this.originalSubmissions];

    // Filter Logic
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      items = items.filter(sub =>
        (sub.fullName && sub.fullName.toLowerCase().includes(lowerSearchTerm)) ||
        (sub.assignmentTitle && sub.assignmentTitle.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Sorting Logic
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
          return this.sortState === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if ((typeof aValue === 'string' || aValue instanceof Date) && (typeof bValue === 'string' || bValue instanceof Date)) {
          const aTime = new Date(aValue).getTime();
          const bTime = new Date(bValue).getTime();
          return this.sortState === 'asc' ? aTime - bTime : bTime - aTime;
        }
        return 0;
      });
    }
    this.submissions = items;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilterAndSort();
  }

  onHeaderDoubleClick(column: string): void {
    if (this.sortedColumn !== column) {
      this.sortedColumn = column;
      this.sortState = 'asc';
    } else {
      switch (this.sortState) {
        case 'normal': this.sortState = 'asc'; this.sortedColumn = column; break;
        case 'asc': this.sortState = 'desc'; break;
        case 'desc': this.sortState = 'normal'; this.sortedColumn = null; break;
      }
    }
    this.currentPage = 1;
    this.applyFilterAndSort();
  }

  get paginatedSubmissions(): Submission[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.submissions.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.submissions.length / this.pageSize);
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

  onSelectSubmission(item: Submission): void {
    this.selectedSubmissionId = (this.selectedSubmissionId === item.submissionId) ? null : item.submissionId;
    console.log('Selected Submission ID:', this.selectedSubmissionId);
  }

  toggleAllCheckboxes(event: any) {
    const checked = event.target.checked;
    this.submissions.forEach(row => (row.selected = checked));
    this.applyFilterAndSort(); // To update the displayed list based on selection
  }

  isAllSelected() {
    return this.submissions.length > 0 && this.submissions.every(row => row.selected);
  }
}