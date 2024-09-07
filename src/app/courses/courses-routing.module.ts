import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseFormComponent } from './course-form/course-form.component';
import { CoursesComponent } from './courses/courses.component';
import { coursesResolver } from './guard/courses.resolver';


const routes: Routes = [
  { path: '',
    component: CoursesComponent
  },
  { path: 'new',
    component: CourseFormComponent,
    resolve: { course: coursesResolver }   
  },
  { path: 'edit/:id',
    component: CourseFormComponent,
    resolve: { course: coursesResolver }
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
