import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.sass']
})
export class CourseFormComponent implements OnInit {

  form!:FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private coursesService: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({
      name: [course.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      category: [course.category, [Validators.required]],
    });
    console.log(this.form);
    console.log(this.form.value);
    const path = this.router.url;
    if(path.includes('edit')){
      this.route.params.subscribe((data: { id?: string }) => {
        if(data && data.id){
          this.coursesService.loadById(data.id).subscribe((courseResponse) => {
            this.form.addControl('id', this.formBuilder.control(courseResponse.id));
            this.form.patchValue({
              'name': courseResponse.name
            })
            this.form.patchValue({
              'category': courseResponse.category
            })
          })
        }
      })
    }
  }

 
  onSubmit() {
    console.log("Forms: ", this.form.value)
    if(this.form.valid) {
      this.coursesService.save(this.form.value).subscribe({
          next: (result): void => {
          return this.onSucess();
          },
          error: (error): void => { 
          return this.onError();
          }
      });  
    } else {
      alert('form invalid')
    }
  }

  onCancel() {
    this.location.back();   
  }

  private onSucess() {
    this.snackBar.open('Curso salvo com sucesso.', '', {duration: 2000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao Salvar curso.', '', {duration: 2000 });   
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);

    if(field?.hasError('required')) {
      return 'Campo obrigatório.';
    }

    if(field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 3;
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres.`;
    }

    if(field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `Tamanho máximo precisa ser de  ${requiredLength} caracteres.`;
    }

    return 'Campo inválido.'
  }
 
}
