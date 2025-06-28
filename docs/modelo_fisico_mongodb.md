# Modelo Físico do Banco de Dados MongoDB

## Coleção: pessoas
Esta é uma coleção base que utiliza discriminadores para armazenar tanto clientes quanto fabricantes.

### Documento Base (Pessoa):
```json
{
  "_id": "ObjectId",
  "nome": "String",
  "telefone": "String",
  "endereco": "String",
  "email": "String",
  "tipo": "String",  // "Cliente" ou "Fabricante" (discriminador)
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Documento Cliente (extends Pessoa):
```json
{
  "_id": "ObjectId",
  "nome": "String",
  "telefone": "String",
  "endereco": "String",
  "email": "String",
  "tipo": "Cliente",  // discriminador
  "cpf": "String",      // único
  "forma_pagamento": "String",  // enum: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Boleto']
  "rg": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Documento Fabricante (extends Pessoa):
```json
{
  "_id": "ObjectId",
  "nome": "String",
  "telefone": "String",
  "endereco": "String",
  "email": "String",
  "tipo": "Fabricante",  // discriminador
  "razao_social": "String",
  "cnpj": "String",        // único
  "contato": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Coleção: produtos
```json
{
  "_id": "ObjectId",
  "nome": "String",
  "valor_custo": "Number",
  "categoria": "String",
  "valor_venda": "Number",
  "fabr": "ObjectId",  // Referência ao Fabricante
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Coleção: vendas
```json
{
  "_id": "ObjectId",
  "identificador": "String",  // único
  "dia": "Number",
  "mes": "Number",
  "ano": "Number",
  "valor_total": "Number",
  "clnt": "ObjectId",  // Referência ao Cliente
  "prod": "ObjectId",  // Referência ao Produto
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Coleção: users
```json
{
  "_id": "ObjectId",
  "username": "String",  // único
  "email": "String",     // único
  "password": "String",  // hash da senha
  "role": "String",      // enum: ['user', 'admin']
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Índices:
- **pessoas**: 
  - `{ cpf: 1 }` (único, para Clientes)
  - `{ cnpj: 1 }` (único, para Fabricantes)
  - `{ email: 1 }` (único)

- **produtos**:
  - `{ nome: 1 }`
  - `{ categoria: 1 }`
  - `{ fabr: 1 }`

- **vendas**:
  - `{ identificador: 1 }` (único)
  - `{ ano: 1, mes: 1, dia: 1 }`
  - `{ clnt: 1 }`
  - `{ prod: 1 }`

- **users**:
  - `{ username: 1 }` (único)
  - `{ email: 1 }` (único)

## Relacionamentos:
1. **Produto → Fabricante**: Referência direta via campo `fabr` (ObjectId)
2. **Venda → Cliente**: Referência direta via campo `clnt` (ObjectId)
3. **Venda → Produto**: Referência direta via campo `prod` (ObjectId)
