import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe(response => {
      this.loading = false;
      if (response.success) {
        this.clientes = response.data as Cliente[];
      } else {
        this.error = response.message || 'Erro ao carregar clientes.';
      }
    });
  }

  editarCliente(id: string): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  novoCliente(): void {
    this.router.navigate(['/clientes/novo']);
  }

  excluirCliente(cliente: Cliente): void {
    if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
      this.clienteService.deleteCliente(cliente._id!).subscribe(response => {
        if (response.success) {
          this.successMessage = 'Cliente excluído com sucesso!';
          this.clientes = this.clientes.filter(c => c._id !== cliente._id);
          
          // Limpar mensagem de sucesso após 3 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = response.message || 'Erro ao excluir cliente.';
          
          // Limpar mensagem de erro após 3 segundos
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
    }
  }
}
