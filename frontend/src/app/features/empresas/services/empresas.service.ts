// src/app/features/empresas/services/empresas.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root',
})
export class EmpresasService {
  private readonly api = `${environment.apiUrl}/empresas`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.api);
  }

  getById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.api}/${id}`);
  }

  create(data: Partial<Empresa>): Observable<Empresa> {
    return this.http.post<Empresa>(this.api, data);
  }

  update(id: number, data: Partial<Empresa>): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
