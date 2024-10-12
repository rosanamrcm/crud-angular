import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';



@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.sass']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]> | null = null;
  displayedColumns = ['name', 'category', 'actions'];

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.refresh();
  }
  
  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  ngOnInit(): void {
    
  }

  onAdd() {
    this.router.navigate(['new'], {relativeTo: this.route})  
  }

  onEdit(course: Course) {
    this.router.navigate(['edit/', course.id], {relativeTo: this.route}) 
  }

  refresh() {
    this.courses$ = this.coursesService.list()
    .pipe(
      catchError(error => {
       this.onError('Erro ao carregar cursos')
        return of([])
      })
    );
  }
 
  onDelete(course: Course) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: 'Tem certeza que deseja remover este curso?'
      });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coursesService.remove(course.id).subscribe({
          next: (): void => {
            this.refresh();
            this.snackBar.open('Curso removido com sucesso!', 'X', {
              duration: 2000,
              verticalPosition:'top',
              horizontalPosition: 'center'
            });
          },
          error: (): void => { 
            return this.onError('Erro ao tentar remover curso.');
          }
        });   
      }
    });
  }
}
