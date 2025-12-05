import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Proyecto } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  private readonly api = `${environment.apiUrl}/proyectos`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.api);
  }

  getById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.api}/${id}`);
  }

  create(data: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.api, data);
  }

  update(id: number, data: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.patch<Proyecto>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
