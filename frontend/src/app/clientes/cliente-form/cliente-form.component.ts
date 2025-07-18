import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEditMode = false;
  clienteId: string | null = null;
  loading = false;
  submitted = false;
  error = '';
  successMessage = '';
  formasPagamento: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {
    // Inicializar o formulário com validações
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.pattern(/^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/)]],
      endereco: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      forma_pagamento: ['', Validators.required],
      rg: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.formasPagamento = this.clienteService.getFormasPagamento();
    
    // Verificar se estamos em modo de edição ou criação
    this.route.paramMap.subscribe(params => {
      this.clienteId = params.get('id');
      this.isEditMode = !!this.clienteId;
      
      if (this.isEditMode && this.clienteId) {
        this.carregarCliente(this.clienteId);
      }
    });
  }

  // Getter para fácil acesso aos campos do formulário
  get f() { return this.clienteForm.controls; }

  carregarCliente(id: string): void {
    this.loading = true;
    this.clienteService.getCliente(id).subscribe(response => {
      this.loading = false;
      if (response.success) {
        const cliente = response.data as Cliente;
        this.clienteForm.patchValue({
          nome: cliente.nome,
          telefone: cliente.telefone,
          endereco: cliente.endereco,
          email: cliente.email,
          cpf: cliente.cpf,
          forma_pagamento: cliente.forma_pagamento,
          rg: cliente.rg
        });
      } else {
        this.error = response.message || 'Erro ao carregar dados do cliente.';
        setTimeout(() => this.router.navigate(['/clientes']), 3000);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Parar aqui se o formulário for inválido
    if (this.clienteForm.invalid) {
      return;
    }

    const clienteData = this.clienteForm.value as Cliente;
    this.loading = true;

    if (this.isEditMode && this.clienteId) {
      // Modo de edição - atualizar cliente existente
      this.clienteService.updateCliente(this.clienteId, clienteData).subscribe(response => {
        this.loading = false;
        if (response.success) {
          this.successMessage = 'Cliente atualizado com sucesso!';
          setTimeout(() => this.router.navigate(['/clientes']), 2000);
        } else {
          this.error = response.message || 'Erro ao atualizar cliente.';
        }
      });
    } else {
      // Modo de criação - criar novo cliente
      this.clienteService.createCliente(clienteData).subscribe(response => {
        this.loading = false;
        if (response.success) {
          this.successMessage = 'Cliente cadastrado com sucesso!';
          setTimeout(() => this.router.navigate(['/clientes']), 2000);
        } else {
          this.error = response.message || 'Erro ao cadastrar cliente.';
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
