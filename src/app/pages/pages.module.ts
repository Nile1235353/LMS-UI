
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LayoutComponent } from '../layout/layout.component';

import { PagesRoutingModule } from './pages-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ViewcoursesComponent } from './courses/viewcourses/viewcourses.component';

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
    ViewcoursesComponent
  ],
})
export class PagesModule {}
