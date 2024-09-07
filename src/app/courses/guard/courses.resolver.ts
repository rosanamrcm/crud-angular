import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';


export const coursesResolver: ResolveFn<Course> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  ): Observable<Course> => {

    if (route.params['id']) {
      console.log(route.paramMap.get('id')!);
      inject(CoursesService).loadById(route.paramMap.get('id')!);
    }
    return of({ id: '', name: '', category: '' });
  }


