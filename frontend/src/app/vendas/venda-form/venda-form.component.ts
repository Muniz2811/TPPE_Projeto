import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendaService, Venda, VendaResponse } from '../../services/venda.service';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { ProdutoService, Produto } from '../../services/produto.service';

@Component({
  selector: 'app-venda-form',
  templateUrl: './venda-form.component.html',
  styleUrls: ['./venda-form.component.css']
})
export class VendaFormComponent implements OnInit {
  vendaForm!: FormGroup;
  isEditMode = false;
  vendaId: string | null = null;
  loading = false;
  saving = false;
  error = '';
  successMessage = '';
  clientes: Cliente[] = [];
  produtos: Produto[] = [];

  constructor(
    private fb: FormBuilder,
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarProdutos();
    
    this.route.params.subscribe((params: {id?: string}) => {
      if (params['id']) {
        this.isEditMode = true;
        this.vendaId = params['id'];
        this.carregarVenda(this.vendaId);
      }
    });
  }

  initForm(): void {
    const today = new Date();
    
    this.vendaForm = this.fb.group({
      identificador: ['', [Validators.required]],
      dia: [today.getDate(), [Validators.required, Validators.min(1), Validators.max(31)]],
      mes: [today.getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      ano: [today.getFullYear(), [Validators.required, Validators.min(2000)]],
      valor_total: ['', [Validators.required, Validators.min(0)]],
      clnt: ['', [Validators.required]],
      prod: ['', [Validators.required]]
    });
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe(
      response => {
        if (response.success && Array.isArray(response.data)) {
          this.clientes = response.data;
        }
      },
      error => {
        console.error('Erro ao carregar clientes', error);
      }
    );
  }

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe(
      response => {
        if (response.success && Array.isArray(response.data)) {
          this.produtos = response.data;
        }
      },
      error => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  carregarVenda(id: string | null): void {
    if (!id) return;
    this.loading = true;
    this.vendaService.getVenda(id).subscribe(
      (response: VendaResponse) => {
        this.loading = false;
        if (response.success && response.data) {
          const venda = response.data as Venda;
          this.vendaForm.patchValue({
            identificador: venda.identificador,
            dia: venda.dia,
            mes: venda.mes,
            ano: venda.ano,
            valor_total: venda.valor_total,
            clnt: venda.clnt,
            prod: venda.prod
          });
        } else {
          this.error = response.message || 'Erro ao carregar venda.';
        }
      },
      (error) => {
        this.loading = false;
        this.error = 'Erro ao carregar venda.';
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.vendaForm.invalid) {
      this.markFormGroupTouched(this.vendaForm);
      return;
    }
    
    this.saving = true;
    const vendaData: Venda = this.vendaForm.value;
    
    if (this.isEditMode && this.vendaId) {
      this.vendaService.updateVenda(this.vendaId, vendaData).subscribe(
        (response: VendaResponse) => {
          this.saving = false;
          if (response.success) {
            this.successMessage = 'Venda atualizada com sucesso!';
            setTimeout(() => {
              this.router.navigate(['/vendas']);
            }, 2000);
          } else {
            this.error = response.message || 'Erro ao atualizar venda.';
          }
        },
        (error) => {
          this.saving = false;
          this.error = 'Erro ao atualizar venda.';
          console.error(error);
        }
      );
    } else {
      this.vendaService.createVenda(vendaData).subscribe(
        (response: VendaResponse) => {
          this.saving = false;
          if (response.success) {
            this.successMessage = 'Venda cadastrada com sucesso!';
            this.vendaForm.reset();
            setTimeout(() => {
              this.router.navigate(['/vendas']);
            }, 2000);
          } else {
            this.error = response.message || 'Erro ao cadastrar venda.';
          }
        },
        (error) => {
          this.saving = false;
          this.error = 'Erro ao cadastrar venda.';
          console.error(error);
        }
      );
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(controlName: string): string {
    const control = this.vendaForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório.';
      if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}.`;
      if (control.errors['max']) return `Valor máximo: ${control.errors['max'].max}.`;
    }
    return '';
  }

  getNomeProduto(id: string): string {
    const produto = this.produtos.find(p => p._id === id);
    return produto ? produto.nome : 'Produto não encontrado';
  }

  getNomeCliente(id: string): string {
    const cliente = this.clientes.find(c => c._id === id);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  }
}
