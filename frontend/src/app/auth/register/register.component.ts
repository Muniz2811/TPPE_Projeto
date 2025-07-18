import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Inicializa o formulário vazio
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Se o usuário já estiver logado, redireciona para a página inicial
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Getter para fácil acesso aos campos do formulário
  get f() { return this.registerForm.controls; }

  // Validador personalizado para verificar se as senhas coincidem
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Para se o formulário for inválido
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('Enviando requisição de registro...');
    
    const { username, email, password } = this.registerForm.value;
    
    this.authService.register(username, email, password)
      .subscribe({
        next: (response) => {
          console.log('Resposta do registro:', response);
          if (response.success) {
            this.success = 'Cadastro realizado com sucesso! Redirecionando para o login...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.error = response.message || 'Erro ao cadastrar usuário';
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Erro no registro:', error);
          this.error = error.error?.message || 'Ocorreu um erro ao tentar cadastrar. Tente novamente.';
          this.loading = false;
        }
      });
  }
}
