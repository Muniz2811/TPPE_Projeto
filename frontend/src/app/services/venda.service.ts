import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Venda {
  _id?: string;
  identificador: string;
  dia: number;
  mes: number;
  ano: number;
  valor_total: number;
  clnt: string;
  prod: string;
}

export interface VendaResponse {
  success: boolean;
  data?: Venda | Venda[];
  message?: string;
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = `${environment.apiUrl}/vendas`;

  constructor(private http: HttpClient) { }

  getVendas(): Observable<VendaResponse> {
    return this.http.get<VendaResponse>(this.apiUrl);
  }

  getVenda(id: string): Observable<VendaResponse> {
    return this.http.get<VendaResponse>(`${this.apiUrl}/${id}`);
  }

  createVenda(venda: Venda): Observable<VendaResponse> {
    return this.http.post<VendaResponse>(this.apiUrl, venda);
  }

  updateVenda(id: string, venda: Venda): Observable<VendaResponse> {
    return this.http.put<VendaResponse>(`${this.apiUrl}/${id}`, venda);
  }

  deleteVenda(id: string): Observable<VendaResponse> {
    return this.http.delete<VendaResponse>(`${this.apiUrl}/${id}`);
  }
}
