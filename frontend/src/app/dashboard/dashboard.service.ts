import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { VendaService, Venda as ApiVenda, VendaResponse } from '../services/venda.service';
import { ProdutoService } from '../services/produto.service';
import { environment } from '../../environments/environment';

// Interfaces para tipagem
export interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao?: string;
  estoque?: number;
  fabricante?: string;
}

export interface Venda {
  _id: string;
  produto: string | { _id: string };
  cliente?: string;
  quantidade: number;
  valorTotal: number;
  data: string;
}

export interface ProdutoVendaData {
  produto: string;
  nomeProduto: string;
  quantidadeVendida: number;
  valorTotal: number;
  percentual: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private vendaService: VendaService,
    private produtoService: ProdutoService
  ) { }

  getVendasPorProduto(): Observable<ProdutoVendaData[]> {
    return forkJoin({
      vendas: this.vendaService.getVendas(),
      produtos: this.produtoService.getProdutos()
    }).pipe(
      map(({ vendas, produtos }: { vendas: VendaResponse, produtos: any }) => {
        // Mapa para armazenar dados agregados por produto
        const produtosMap = new Map<string, ProdutoVendaData>();
        let valorTotalGeral = 0;

        // Processar todas as vendas
        const vendasArray = Array.isArray(vendas.data) ? vendas.data : [];
        vendasArray.forEach((venda: any) => {
          const produtoId = typeof venda.prod === 'string' ? 
            venda.prod : 
            (typeof venda.prod === 'object' ? venda.prod?._id || '' : '');
          
          const valorVenda = venda.valor_total || 0;
          valorTotalGeral += valorVenda;

          // Se o produto já existe no mapa, atualiza os valores
          if (produtosMap.has(produtoId)) {
            const produtoData = produtosMap.get(produtoId)!;
            produtoData.quantidadeVendida += 1;
            produtoData.valorTotal += valorVenda;
          } else {
            // Caso contrário, cria um novo registro
            const produtosArray = Array.isArray(produtos.data) ? produtos.data : [];
            const nomeProduto = produtosArray.find((p: any) => {
              const prodId = p._id;
              return (typeof prodId === 'string' ? prodId : String(prodId)) === produtoId;
            })?.nome || 'Produto Desconhecido';
            
            produtosMap.set(produtoId, {
              produto: produtoId,
              nomeProduto,
              quantidadeVendida: 1,
              valorTotal: valorVenda,
              percentual: 0 // Será calculado depois
            });
          }
        });

        // Calcular percentuais
        const result = Array.from(produtosMap.values());
        result.forEach(item => {
          item.percentual = valorTotalGeral > 0 ? 
            (item.valorTotal / valorTotalGeral) * 100 : 0;
        });

        // Ordenar por valor total (decrescente)
        return result.sort((a, b) => b.valorTotal - a.valorTotal);
      })
    );
  }

  getResumoVendas(): Observable<any> {
    return this.vendaService.getVendas().pipe(
      map((vendas: VendaResponse) => {
        const vendasArray = Array.isArray(vendas.data) ? vendas.data : [];
        const totalVendas = vendasArray.length;
        const valorTotal = vendasArray.reduce((sum: number, venda: any) => sum + (venda.valor_total || 0), 0);
        const mediaVendas = totalVendas > 0 ? valorTotal / totalVendas : 0;
        
        // Agrupar por mês
        const vendasPorMes = vendasArray.reduce((acc: Record<string, any>, venda: any) => {
          // Usar os campos de data da venda diretamente
          const mes = venda.mes - 1; // Ajustar para base 0 (janeiro = 0)
          const ano = venda.ano;
          const chave = `${ano}-${mes}`;
          
          if (!acc[chave]) {
            acc[chave] = {
              mes: mes + 1,
              ano,
              rotulo: `${mes + 1}/${ano}`,
              quantidade: 0,
              valor: 0
            };
          }
          
          acc[chave].quantidade += 1;
          acc[chave].valor += venda.valor_total || 0;
          
          return acc;
        }, {} as Record<string, any>);
        
        return {
          totalVendas,
          valorTotal,
          mediaVendas,
          vendasPorMes: Object.values(vendasPorMes).sort((a, b) => {
            // Tipagem explícita para evitar erro de tipo unknown
            const aAno = (a as any).ano as number;
            const bAno = (b as any).ano as number;
            const aMes = (a as any).mes as number;
            const bMes = (b as any).mes as number;
            
            if (aAno !== bAno) return aAno - bAno;
            return aMes - bMes;

          })
        };
      })
    );
  }
}
