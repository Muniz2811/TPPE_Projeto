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
  "tipo": "String", 
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
  "tipo": "Cliente", 
  "cpf": "String",      
  "forma_pagamento": "String",  
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
  "tipo": "Fabricante",  
  "razao_social": "String",
  "cnpj": "String",        
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
  "fabr": "ObjectId",  
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Coleção: vendas
```json
{
  "_id": "ObjectId",
  "identificador": "String", 
  "dia": "Number",
  "mes": "Number",
  "ano": "Number",
  "valor_total": "Number",
  "clnt": "ObjectId",  
  "prod": "ObjectId",  
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Coleção: users
```json
{
  "_id": "ObjectId",
  "username": "String",  
  "email": "String",    
  "password": "String", 
  "role": "String",      
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
