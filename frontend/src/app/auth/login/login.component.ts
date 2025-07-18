import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';
  error: string = '';
  success: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Show success message if registration was successful
    if (this.route.snapshot.queryParams['registered']) {
      this.success = 'Registro realizado com sucesso! Faça login para continuar.';
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('Enviando requisição de login...');
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (response) => {
          console.log('Resposta do login:', response);
          if (response.success) {
            // Set a success message
            this.success = 'Login realizado com sucesso! Redirecionando...';
            
            // Small delay before navigation to show the success message
            setTimeout(() => {
              this.router.navigateByUrl(this.returnUrl);
            }, 1000);
          } else {
            this.error = response.message || 'Erro ao fazer login';
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.error = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
          this.loading = false;
        }
      });
  }
}
