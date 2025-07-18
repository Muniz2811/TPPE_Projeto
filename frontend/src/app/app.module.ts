import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { ClienteListComponent } from './clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ProdutoListComponent } from './produtos/produto-list/produto-list.component';
import { ProdutoFormComponent } from './produtos/produto-form/produto-form.component';
import { FabricanteListComponent } from './fabricantes/fabricante-list/fabricante-list.component';
import { FabricanteFormComponent } from './fabricantes/fabricante-form/fabricante-form.component';
import { VendaListComponent } from './vendas/venda-list/venda-list.component';
import { VendaFormComponent } from './vendas/venda-form/venda-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClienteListComponent, canActivate: [AuthGuard] },
  { path: 'clientes/novo', component: ClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'clientes/editar/:id', component: ClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'produtos', component: ProdutoListComponent, canActivate: [AuthGuard] },
  { path: 'produtos/novo', component: ProdutoFormComponent, canActivate: [AuthGuard] },
  { path: 'produtos/editar/:id', component: ProdutoFormComponent, canActivate: [AuthGuard] },
  { path: 'fabricantes', component: FabricanteListComponent, canActivate: [AuthGuard] },
  { path: 'fabricantes/add', component: FabricanteFormComponent, canActivate: [AuthGuard] },
  { path: 'fabricantes/edit/:id', component: FabricanteFormComponent, canActivate: [AuthGuard] },
  { path: 'vendas', component: VendaListComponent, canActivate: [AuthGuard] },
  { path: 'vendas/novo', component: VendaFormComponent, canActivate: [AuthGuard] },
  { path: 'vendas/editar/:id', component: VendaFormComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ClienteListComponent,
    ClienteFormComponent,
    ProdutoListComponent,
    ProdutoFormComponent,
    FabricanteListComponent,
    FabricanteFormComponent,
    VendaListComponent,
    VendaFormComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
