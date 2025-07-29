import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { CourseComponent } from "./courses/course.component";

const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' }  },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },

  // User
  { path: 'user', component: UserComponent, data: { breadcrumb: 'User' } },
  
  //Course
  { path: 'courses', component: CourseComponent, data: { breadcrumb: 'Courses' } },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }


