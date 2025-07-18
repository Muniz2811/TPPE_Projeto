import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto.service';

@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.loading = true;
    this.error = '';
    this.produtoService.getProdutos().subscribe(response => {
      this.loading = false;
      if (response.success) {
        this.produtos = Array.isArray(response.data) ? response.data : [response.data];
      } else {
        this.error = response.message || 'Erro ao carregar produtos';
      }
    });
  }

  editarProduto(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/produtos/editar', id]);
    }
  }

  criarProduto(): void {
    this.router.navigate(['/produtos/novo']);
  }

  excluirProduto(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.deleteProduto(id).subscribe(response => {
        if (response.success) {
          this.successMessage = 'Produto excluído com sucesso!';
          this.produtos = this.produtos.filter(produto => produto._id !== id);
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = response.message || 'Erro ao excluir produto';
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
    }
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getFabricanteNome(fabricante: any): string {
    return fabricante && typeof fabricante !== 'string' ? fabricante.nome : 'Não disponível';
  }
}
