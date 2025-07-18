import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Fabricante } from './produto.service';

export interface FabricanteResponse {
  success: boolean;
  data: Fabricante | Fabricante[];
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {
  private apiUrl = '/api/fabricantes';

  constructor(private http: HttpClient) { }

  // Obter todos os fabricantes
  getFabricantes(): Observable<FabricanteResponse> {
    return this.http.get<FabricanteResponse>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar fabricantes', error);
          return of({ success: false, data: [], message: 'Erro ao buscar fabricantes. Tente novamente.' });
        })
      );
  }

  // Obter um fabricante específico
  getFabricante(id: string): Observable<FabricanteResponse> {
    return this.http.get<FabricanteResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar fabricante', error);
          return of({ success: false, data: {} as Fabricante, message: 'Erro ao buscar fabricante. Tente novamente.' });
        })
      );
  }
  
  // Criar um novo fabricante
  createFabricante(fabricante: Fabricante): Observable<FabricanteResponse> {
    return this.http.post<FabricanteResponse>(this.apiUrl, fabricante)
      .pipe(
        catchError(error => {
          console.error('Erro ao criar fabricante', error);
          return of({ success: false, data: {} as Fabricante, message: 'Erro ao criar fabricante. Tente novamente.' });
        })
      );
  }

  // Atualizar um fabricante existente
  updateFabricante(id: string, fabricante: Fabricante): Observable<FabricanteResponse> {
    return this.http.put<FabricanteResponse>(`${this.apiUrl}/${id}`, fabricante)
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar fabricante', error);
          return of({ success: false, data: {} as Fabricante, message: 'Erro ao atualizar fabricante. Tente novamente.' });
        })
      );
  }

  // Excluir um fabricante
  deleteFabricante(id: string): Observable<FabricanteResponse> {
    return this.http.delete<FabricanteResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao excluir fabricante', error);
          return of({ success: false, data: {} as Fabricante, message: 'Erro ao excluir fabricante. Tente novamente.' });
        })
      );
  }
}
