# Sistema de Gestão de Vendas - Frontend

Este é o frontend do Sistema de Gestão de Vendas, desenvolvido com Angular 16.

## Estrutura do Projeto

O frontend está estruturado da seguinte forma:

- `src/app/auth`: Contém os componentes e serviços relacionados à autenticação
  - `auth.service.ts`: Serviço para gerenciar autenticação (login, registro, logout)
  - `auth.guard.ts`: Guarda de rota para proteger rotas que exigem autenticação
  - `auth.interceptor.ts`: Interceptor HTTP para adicionar o token JWT às requisições
  - `login/`: Componente de login

## Tela de Login

A tela de login permite que os usuários façam login no sistema usando suas credenciais (email e senha). O componente de login:

1. Valida os campos de entrada
2. Envia as credenciais para o backend
3. Armazena o token JWT retornado para autenticação futura
4. Redireciona o usuário para a página principal após o login bem-sucedido

## Executando o Projeto

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:4200`.

### Docker

O projeto está configurado para ser executado em um ambiente Docker:

```bash
# Na raiz do projeto
docker-compose up
```

## Integração com o Backend

O frontend se comunica com o backend através de uma API REST. As principais rotas de autenticação são:

- `POST /api/auth/login`: Para autenticação de usuários
- `POST /api/auth/register`: Para registro de novos usuários
- `GET /api/auth/profile`: Para obter o perfil do usuário autenticado
