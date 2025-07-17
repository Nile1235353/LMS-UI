import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { LayoutComponent } from '../layout/layout.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    LayoutComponent,
    ReactiveFormsModule
  ]
})
export class PagesModule {

}
