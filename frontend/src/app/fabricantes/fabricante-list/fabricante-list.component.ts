import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FabricanteService } from '../../services/fabricante.service';
import { Fabricante } from '../../services/produto.service';

@Component({
  selector: 'app-fabricante-list',
  templateUrl: './fabricante-list.component.html',
  styleUrls: ['./fabricante-list.component.css']
})
export class FabricanteListComponent implements OnInit {
  fabricantes: Fabricante[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private fabricanteService: FabricanteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFabricantes();
  }

  loadFabricantes(): void {
    this.loading = true;
    this.error = '';
    this.fabricanteService.getFabricantes().subscribe(response => {
      this.loading = false;
      if (response.success) {
        this.fabricantes = Array.isArray(response.data) ? response.data : [response.data];
      } else {
        this.error = response.message || 'Erro ao carregar fabricantes.';
      }
    }, error => {
      this.loading = false;
      this.error = 'Erro ao carregar fabricantes.';
    });
  }

  editarFabricante(id: string | undefined): void {
    if (!id) return;
    this.router.navigate(['/fabricantes/edit', id]);
  }

  excluirFabricante(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja excluir este fabricante?')) {
      this.fabricanteService.deleteFabricante(id).subscribe(response => {
        if (response.success) {
          this.successMessage = 'Fabricante excluído com sucesso!';
          this.fabricantes = this.fabricantes.filter(fabricante => fabricante._id !== id);
          
          // Esconde a mensagem após 3 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = response.message || 'Erro ao excluir fabricante.';
        }
      }, error => {
        this.error = 'Erro ao excluir fabricante.';
      });
    }
  }

  adicionarFabricante(): void {
    this.router.navigate(['/fabricantes/add']);
  }
}
