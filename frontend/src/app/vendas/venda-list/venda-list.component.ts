import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendaService, Venda, VendaResponse } from '../../services/venda.service';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { ProdutoService, Produto } from '../../services/produto.service';
import { forkJoin } from 'rxjs';

// Importamos ou declaramos as interfaces de resposta
interface ClienteResponse {
  success: boolean;
  data?: Cliente | Cliente[];
  message?: string;
  count?: number;
}

interface ProdutoResponse {
  success: boolean;
  data?: Produto | Produto[];
  message?: string;
  count?: number;
}

@Component({
  selector: 'app-venda-list',
  templateUrl: './venda-list.component.html',
  styleUrls: ['./venda-list.component.css']
})
export class VendaListComponent implements OnInit {
  vendas: Venda[] = [];
  loading = false;
  error = '';
  successMessage = '';

  clientesMap: { [key: string]: string } = {};
  produtosMap: { [key: string]: string } = {};

  constructor(
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Carregar clientes e produtos primeiro, depois vendas
    this.loading = true;
    this.error = '';
    
    // Usar forkJoin para carregar clientes e produtos em paralelo
    forkJoin([
      this.clienteService.getClientes(),
      this.produtoService.getProdutos()
    ]).subscribe(
      ([clientesResponse, produtosResponse]: [ClienteResponse, ProdutoResponse]) => {
        // Processar clientes
        if (clientesResponse.success && Array.isArray(clientesResponse.data)) {
          const clientes = clientesResponse.data as Cliente[];
          clientes.forEach(cliente => {
            this.clientesMap[cliente._id as string] = cliente.nome;
          });
          console.log('Mapa de clientes criado:', this.clientesMap);
        }
        
        // Processar produtos
        if (produtosResponse.success && Array.isArray(produtosResponse.data)) {
          const produtos = produtosResponse.data as Produto[];
          produtos.forEach(produto => {
            this.produtosMap[produto._id as string] = produto.nome;
          });
          console.log('Mapa de produtos criado:', this.produtosMap);
        }
        
        // Agora que temos clientes e produtos, carregar vendas
        this.carregarVendas();
      },
      (error: any) => {
        this.loading = false;
        this.error = 'Erro ao carregar dados. Verifique sua conexão.';
        console.error('Erro ao carregar clientes ou produtos', error);
      }
    );
  }

  carregarVendas(): void {
    this.loading = true;
    this.error = '';
    this.vendaService.getVendas().subscribe(
      (response: VendaResponse) => {
        this.loading = false;
        if (response.success && response.data) {
          this.vendas = response.data as Venda[];
          
          // Log para debug - ver a estrutura dos dados
          console.log('Vendas carregadas:', this.vendas);
          if (this.vendas.length > 0) {
            const primeiraVenda = this.vendas[0];
            console.log('Primeira venda completa:', primeiraVenda);
            console.log('Estrutura do cliente:', primeiraVenda.clnt, typeof primeiraVenda.clnt);
            console.log('Estrutura do produto:', primeiraVenda.prod, typeof primeiraVenda.prod);
            
            // Testa extração de IDs
            console.log('ID extraído do cliente:', this.extrairId(primeiraVenda.clnt));
            console.log('ID extraído do produto:', this.extrairId(primeiraVenda.prod));
          }
        } else {
          this.error = response.message || 'Erro ao carregar vendas.';
        }
      },
      (error: any) => {
        this.loading = false;
        this.error = 'Erro ao carregar vendas. Verifique sua conexão.';
        console.error(error);
      }
    );
  }

  adicionarVenda(): void {
    this.router.navigate(['/vendas/novo']);
  }

  editarVenda(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/vendas/editar', id]);
    }
  }

  excluirVenda(id: string | undefined): void {
    if (!id) {
      this.error = 'ID de venda inválido';
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      this.vendaService.deleteVenda(id).subscribe(
        (response: VendaResponse) => {
          if (response.success) {
            this.successMessage = 'Venda excluída com sucesso!';
            this.vendas = this.vendas.filter(venda => venda._id !== id);
            
            // Esconde a mensagem após 3 segundos
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.error = response.message || 'Erro ao excluir venda.';
          }
        },
        (error: any) => {
          this.error = 'Erro ao excluir venda.';
          console.error(error);
        }
      );
    }
  }

  formatarData(venda: Venda): string {
    return `${venda.dia.toString().padStart(2, '0')}/${venda.mes.toString().padStart(2, '0')}/${venda.ano}`;
  }
  
  // Método para extrair o ID correto independente do formato
  extrairId(objeto: any): string | null {
    // Log detalhado do objeto para debug
    console.log('Extraindo ID de:', objeto, typeof objeto);
    
    if (!objeto) return null;
    
    // Se for uma string, assume que é o próprio ID
    if (typeof objeto === 'string') {
      return objeto;
    }
    
    // Se for um objeto com campo _id
    if (objeto._id) {
      return objeto._id;
    }
    
    // Se for um objeto com campo id
    if (objeto.id) {
      return objeto.id;
    }
    
    // Se for apenas um número, converte para string
    if (typeof objeto === 'number') {
      return objeto.toString();
    }
    
    return null;
  }
  
  getNomeCliente(cliente: any): string {
    const clienteId = this.extrairId(cliente);
    console.log('ID do cliente extraído:', clienteId);
    console.log('Mapa de clientes disponível:', this.clientesMap);
    
    if (!clienteId) return 'Cliente não encontrado';
    
    // Verifica se existe no mapa de clientes
    return this.clientesMap[clienteId] || 
           // Caso seja um objeto com nome
           (typeof cliente === 'object' && cliente?.nome) || 
           'Cliente não encontrado';
  }
  
  getNomeProduto(produto: any): string {
    const produtoId = this.extrairId(produto);
    console.log('ID do produto extraído:', produtoId);
    console.log('Mapa de produtos disponível:', this.produtosMap);
    
    if (!produtoId) return 'Produto não encontrado';
    
    // Verifica se existe no mapa de produtos
    return this.produtosMap[produtoId] || 
           // Caso seja um objeto com nome
           (typeof produto === 'object' && produto?.nome) || 
           'Produto não encontrado';
  }
  
  carregarClientes(): void {
    this.clienteService.getClientes().subscribe(
      (response: ClienteResponse) => {
        if (response.success && Array.isArray(response.data)) {
          const clientes = response.data as Cliente[];
          clientes.forEach(cliente => {
            this.clientesMap[cliente._id as string] = cliente.nome;
          });
          console.log('Mapa de clientes criado:', this.clientesMap);
        }
      },
      (error: any) => {
        console.error('Erro ao carregar clientes', error);
      }
    );
  }
  
  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe(
      (response: ProdutoResponse) => {
        if (response.success && Array.isArray(response.data)) {
          const produtos = response.data as Produto[];
          produtos.forEach(produto => {
            this.produtosMap[produto._id as string] = produto.nome;
          });
          console.log('Mapa de produtos criado:', this.produtosMap);
        }
      },
      (error: any) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }
}
