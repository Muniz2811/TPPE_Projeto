# Sistema de Gestão de Vendas

Este projeto é uma conversão do sistema original em Java para JavaScript no backend e Angular no frontend.

## Documentação

- [Diagrama UML](./docs/uml/diagrama-classes.png)
- [Backlog do Projeto](./docs/backlog/backlog.md)
- [Histórias de Usuário](./docs/backlog/historias-usuario.md)

## Infraestrutura

O projeto utiliza Docker Compose para facilitar a configuração do ambiente de desenvolvimento:

- Backend: Node.js com Express
- Frontend: Angular
- Banco de Dados: MongoDB

## Como executar

1. Certifique-se de ter o Docker e o Docker Compose instalados
2. Clone o repositório
3. Execute `docker compose up` na raiz do projeto
4. Acesse o frontend em `http://localhost:4200`
5. Acesse o backend em `http://localhost:3000`

## Padrão de Commits

- `feat(docs <nome doc>): <comentário>` - Para adição de documentação
- `fix(docs): <comentário>` - Para correção de documentação
- `feat(tests): <comentário>` - Para adição de testes
- `feat(infra): <comentário>` - Para adição de infraestrutura
- `feat(backend): <comentário>` - Para adição de funcionalidades no backend
- `feat(frontend): <comentário>` - Para adição de funcionalidades no frontend
- `fix(backend): <comentário>` - Para correção de bugs no backend
- `fix(frontend): <comentário>` - Para correção de bugs no frontend

## Estrutura do Projeto

```
EntregaMP-JS/
├── docs/
│   ├── uml/
│   │   └── diagrama-classes.png
│   └── backlog/
│       ├── backlog.md
│       └── historias-usuario.md
├── backend/
│   ├── src/
│   │   └── app.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```
