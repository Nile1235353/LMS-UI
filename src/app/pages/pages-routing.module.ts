import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { AddcoursesComponent } from "./courses/addcourses/addcourses.component";
import { ViewcoursesComponent } from "./courses/viewcourses/viewcourses.component";
import { ProfileComponent } from "./profile/profile.component";
import { ViewcoursedetailsComponent } from "./courses/viewcoursedetails/viewcoursedetails.component";
import { QuestionComponent } from "./assignment/question/question.component";
import { AnswerComponent } from "./assignment/answer/answer.component";

const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' }  },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },


  // User
  { path: 'user', component: UserComponent},

   // Course
   //{ path: 'courses', component: CourseComponent},

   //Courses
   {path:'addcourses', component:AddcoursesComponent},
   {path:'viewcourses/:id', component:ViewcoursesComponent},

   //Profile
   {path:'profile', component:ProfileComponent},
   {path:'viewcoursedetail',component:ViewcoursedetailsComponent},

   //Assignment
   {path:'question',component:QuestionComponent},
   {path:'answer',component:AnswerComponent}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }


