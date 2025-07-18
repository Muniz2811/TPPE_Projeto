import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto.service';
import { FabricanteService } from '../../services/fabricante.service';
import { Fabricante } from '../../services/produto.service';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent implements OnInit {
  produtoForm: FormGroup;
  isEditMode = false;
  produtoId: string | null = null;
  loading = false;
  saving = false;
  error = '';
  successMessage = '';
  fabricantes: Fabricante[] = [];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private fabricanteService: FabricanteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.produtoForm = this.createForm();
  }

  ngOnInit(): void {
    this.carregarFabricantes();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.produtoId = params['id'];
        this.carregarProduto(this.produtoId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      valor_custo: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      valor_venda: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      categoria: ['', [
        Validators.required
      ]],
      fabr: ['', [
        Validators.required
      ]]
    });
  }

  carregarFabricantes(): void {
    this.fabricanteService.getFabricantes().subscribe(response => {
      if (response.success && Array.isArray(response.data)) {
        this.fabricantes = response.data;
      } else {
        this.error = 'Erro ao carregar fabricantes. Alguns recursos podem estar indisponíveis.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  carregarProduto(id: string | null): void {
    if (!id) return;
    
    this.loading = true;
    this.produtoService.getProduto(id).subscribe(response => {
      this.loading = false;
      if (response.success && response.data) {
        const produto = response.data as Produto;
        this.produtoForm.patchValue({
          nome: produto.nome,
          valor_custo: produto.valor_custo,
          valor_venda: produto.valor_venda,
          categoria: produto.categoria,
          fabr: typeof produto.fabr === 'string' ? produto.fabr : produto.fabr._id
        });
      } else {
        this.error = response.message || 'Erro ao carregar produto';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }

  onSubmit(): void {
    if (this.produtoForm.invalid) {
      this.markFormGroupTouched(this.produtoForm);
      return;
    }

    this.saving = true;
    const produtoData: Produto = this.produtoForm.value;

    if (this.isEditMode && this.produtoId) {
      this.produtoService.updateProduto(this.produtoId!, produtoData).subscribe(response => {
        this.saving = false;
        if (response.success) {
          this.successMessage = 'Produto atualizado com sucesso!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/produtos']);
          }, 2000);
        } else {
          this.error = response.message || 'Erro ao atualizar produto';
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
    } else {
      this.produtoService.createProduto(produtoData).subscribe(response => {
        this.saving = false;
        if (response.success) {
          this.successMessage = 'Produto criado com sucesso!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/produtos']);
          }, 2000);
        } else {
          this.error = response.message || 'Erro ao criar produto';
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
    }
  }

  // Método para marcar todos os campos como touched para mostrar validações
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/produtos']);
  }

  getVendaInferiorAoCusto(): boolean {
    const valorCusto = this.produtoForm.get('valor_custo')?.value;
    const valorVenda = this.produtoForm.get('valor_venda')?.value;
    return valorVenda !== null && valorCusto !== null && valorVenda <= valorCusto;
  }
}
