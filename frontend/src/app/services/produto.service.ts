import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Fabricante {
  _id: string;
  nome: string;
  razao_social: string;
  cnpj: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  contato: string;
}

export interface Produto {
  _id?: string;
  nome: string;
  valor_custo: number;
  valor_venda: number;
  categoria: string;
  fabr: string | Fabricante;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProdutoResponse {
  success: boolean;
  data: Produto | Produto[];
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
    
  private apiUrl = `${environment.apiUrl}/produtos`;
  

  constructor(private http: HttpClient) { }

  // Obter todos os produtos
  getProdutos(): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar produtos', error);
          return of({ success: false, data: [], message: 'Erro ao buscar produtos. Tente novamente.' });
        })
      );
  }

  // Obter um produto específico
  getProduto(id: string): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar produto', error);
          return of({ success: false, data: {} as Produto, message: 'Erro ao buscar produto. Tente novamente.' });
        })
      );
  }

  // Criar um novo produto
  createProduto(produto: Produto): Observable<ProdutoResponse> {
    return this.http.post<ProdutoResponse>(this.apiUrl, produto)
      .pipe(
        catchError(error => {
          console.error('Erro ao criar produto', error);
          return of({ 
            success: false, 
            data: {} as Produto, 
            message: error.error?.message || 'Erro ao criar produto. Tente novamente.'
          });
        })
      );
  }

  // Atualizar um produto existente
  updateProduto(id: string, produto: Produto): Observable<ProdutoResponse> {
    return this.http.put<ProdutoResponse>(`${this.apiUrl}/${id}`, produto)
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar produto', error);
          return of({ 
            success: false, 
            data: {} as Produto, 
            message: error.error?.message || 'Erro ao atualizar produto. Tente novamente.'
          });
        })
      );
  }

  // Excluir um produto
  deleteProduto(id: string): Observable<ProdutoResponse> {
    return this.http.delete<ProdutoResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao excluir produto', error);
          return of({ 
            success: false, 
            data: {} as Produto, 
            message: error.error?.message || 'Erro ao excluir produto. Tente novamente.'
          });
        })
      );
  }

  // Obter produtos por categoria
  getProdutosByCategoria(categoria: string): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.apiUrl}?categoria=${categoria}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar produtos por categoria', error);
          return of({ success: false, data: [], message: 'Erro ao buscar produtos. Tente novamente.' });
        })
      );
  }

  // Obter produtos por fabricante
  getProdutosByFabricante(fabricanteId: string): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.apiUrl}?fabricante=${fabricanteId}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar produtos por fabricante', error);
          return of({ success: false, data: [], message: 'Erro ao buscar produtos. Tente novamente.' });
        })
      );
  }
}
