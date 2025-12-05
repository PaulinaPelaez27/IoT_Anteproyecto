import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Nodo } from '../models/nodo.model';

@Injectable({
  providedIn: 'root',
})
export class NodosService {
  private readonly api = `${environment.apiUrl}/nodos`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Nodo[]> {
    return this.http.get<Nodo[]>(this.api);
  }

  getById(id: number): Observable<Nodo> {
    return this.http.get<Nodo>(`${this.api}/${id}`);
  }

  create(data: Partial<Nodo>): Observable<Nodo> {
    return this.http.post<Nodo>(this.api, data);
  }

  update(id: number, data: Partial<Nodo>): Observable<Nodo> {
    return this.http.patch<Nodo>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}