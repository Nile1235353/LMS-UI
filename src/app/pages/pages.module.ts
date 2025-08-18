
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LayoutComponent } from '../layout/layout.component';

import { PagesRoutingModule } from './pages-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ViewcoursesComponent } from './courses/viewcourses/viewcourses.component';
import { ProfileComponent } from './profile/profile.component';
import { QuestionComponent } from './assignment/question/question.component';
import { HttpClientModule } from '@angular/common/http';
import { AnswerComponent } from './assignment/answer/answer.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PagesRoutingModule,
    NgxSpinnerModule,
    LayoutComponent,
    HomeComponent,
    ViewcoursesComponent,
    ProfileComponent,
    QuestionComponent,
    AnswerComponent,
    HttpClientModule
  ],
})
export class PagesModule {}
