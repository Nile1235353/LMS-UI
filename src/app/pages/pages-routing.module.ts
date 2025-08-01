import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { AddcoursesComponent } from "./courses/addcourses/addcourses.component";

const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' }  },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },


  // User
  { path: 'user', component: UserComponent},

   // Course
   //{ path: 'courses', component: CourseComponent},

   //addcourses
   {path:'addcourses', component:AddcoursesComponent}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }


