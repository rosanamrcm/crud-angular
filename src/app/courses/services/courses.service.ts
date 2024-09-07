import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, first } from 'rxjs';
import { Course } from '../model/course';




@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly api = "http://localhost:3000/cursos";

  constructor(private http: HttpClient) { }

  list() {
   return this.http.get<Course[]>(this.api)
   .pipe(
      first(),
      delay(1000)
   );
  }

  loadById(id: string) {
    return this.http.get<Course>(`${this.api}/${id}`);
  }

  save(record: Partial<Course>) {
    console.log(record)
    if(record.id) {
      console.log('update')
      return this.update(record);
    }
    console.log('create')
    return this.create(record) 
  }

  private create(record: Partial<Course>) {
    return this.http.post<Course>(`${this.api}`,record).pipe(first());
  }

  private update(record: Partial<Course>) {
    return this.http.put<Course>(`${this.api}/${record.id}`,record).pipe(first());
  }

  remove(id: string) {
    return this.http.delete<Course>(`${this.api}/${id}`).pipe(first());

  }
  
}

