import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FabricanteService, FabricanteResponse } from '../../services/fabricante.service';
import { Fabricante } from '../../services/produto.service';

@Component({
  selector: 'app-fabricante-form',
  templateUrl: './fabricante-form.component.html',
  styleUrls: ['./fabricante-form.component.css']
})
export class FabricanteFormComponent implements OnInit {
  fabricanteForm!: FormGroup;
  isEditMode = false;
  fabricanteId: string | null = null;
  loading = false;
  saving = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private fabricanteService: FabricanteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: {id?: string}) => {
      if (params['id']) {
        this.isEditMode = true;
        this.fabricanteId = params['id'];
        this.carregarFabricante(this.fabricanteId);
      }
    });
  }

  createForm(): void {
    this.fabricanteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.pattern(/^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/)]],
      endereco: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      razao_social: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]],
      contato: ['', [Validators.required]]
    });
  }

  carregarFabricante(id: string | null): void {
    if (!id) return;
    
    this.loading = true;
    this.fabricanteService.getFabricante(id).subscribe(
      (response: FabricanteResponse) => {
        this.loading = false;
        if (response.success && response.data) {
          const fabricante = response.data as Fabricante;
          this.fabricanteForm.patchValue({
            nome: fabricante.nome,
            telefone: fabricante.telefone,
            endereco: fabricante.endereco,
            email: fabricante.email,
            razao_social: fabricante.razao_social,
            cnpj: fabricante.cnpj,
            contato: fabricante.contato
          });
        } else {
          this.error = response.message || 'Erro ao carregar fabricante.';
        }
      }, 
      (error: Error) => {
        this.loading = false;
        this.error = 'Erro ao carregar fabricante.';
      }
    );
  }

  onSubmit(): void {
    if (this.fabricanteForm.invalid) {
      this.markFormGroupTouched(this.fabricanteForm);
      return;
    }

    this.saving = true;
    const fabricanteData: Fabricante = this.fabricanteForm.value;

    if (this.isEditMode && this.fabricanteId) {
      this.fabricanteService.updateFabricante(this.fabricanteId, fabricanteData).subscribe(
        (response: FabricanteResponse) => {
          this.saving = false;
          if (response.success) {
            this.successMessage = 'Fabricante atualizado com sucesso!';
            setTimeout(() => {
              this.router.navigate(['/fabricantes']);
            }, 1500);
          } else {
            this.error = response.message || 'Erro ao atualizar fabricante.';
          }
        }, 
        (error: Error) => {
          this.saving = false;
          this.error = 'Erro ao atualizar fabricante.';
        }
      );
    } else {
      this.fabricanteService.createFabricante(fabricanteData).subscribe(
        (response: FabricanteResponse) => {
          this.saving = false;
          if (response.success) {
            this.successMessage = 'Fabricante criado com sucesso!';
            setTimeout(() => {
              this.router.navigate(['/fabricantes']);
            }, 1500);
          } else {
            this.error = response.message || 'Erro ao criar fabricante.';
          }
        }, 
        (error: Error) => {
          this.saving = false;
          this.error = 'Erro ao criar fabricante.';
        }
      );
    }
  }

  // Função auxiliar para marcar todos os campos do formulário como touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
