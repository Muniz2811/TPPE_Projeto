import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Cliente {
  _id?: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  cpf: string;
  forma_pagamento: string;
  rg: string;
  tipo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClienteResponse {
  success: boolean;
  data: Cliente | Cliente[];
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

  // Obter todos os clientes
  getClientes(): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar clientes', error);
          return of({ success: false, data: [], message: 'Erro ao buscar clientes. Tente novamente.' });
        })
      );
  }

  // Obter um cliente específico
  getCliente(id: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar cliente', error);
          return of({ success: false, data: {} as Cliente, message: 'Erro ao buscar cliente. Tente novamente.' });
        })
      );
  }

  // Criar um novo cliente
  createCliente(cliente: Cliente): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, cliente)
      .pipe(
        catchError(error => {
          console.error('Erro ao criar cliente', error);
          return of({ 
            success: false, 
            data: {} as Cliente, 
            message: error.error?.message || 'Erro ao criar cliente. Tente novamente.'
          });
        })
      );
  }

  // Atualizar um cliente existente
  updateCliente(id: string, cliente: Cliente): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.apiUrl}/${id}`, cliente)
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar cliente', error);
          return of({ 
            success: false, 
            data: {} as Cliente, 
            message: error.error?.message || 'Erro ao atualizar cliente. Tente novamente.'
          });
        })
      );
  }

  // Excluir um cliente
  deleteCliente(id: string): Observable<ClienteResponse> {
    return this.http.delete<ClienteResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao excluir cliente', error);
          return of({ 
            success: false, 
            data: {} as Cliente, 
            message: error.error?.message || 'Erro ao excluir cliente. Tente novamente.'
          });
        })
      );
  }

  // Formas de pagamento disponíveis (conforme definido no backend)
  getFormasPagamento(): string[] {
    return ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Boleto'];
  }
}
