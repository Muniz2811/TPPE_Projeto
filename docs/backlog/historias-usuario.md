# Histórias de Usuário

## Gestão de Clientes

### HU01: Cadastro de Cliente
**Como** administrador do sistema  
**Quero** cadastrar novos clientes  
**Para** manter um registro atualizado da base de clientes

**Critérios de Aceitação:**
- Deve ser possível inserir nome, telefone, endereço, email, CPF, forma de pagamento e RG
- O sistema deve validar se o CPF é um número válido
- O sistema deve validar se o telefone é um número válido
- O sistema deve exibir uma mensagem de sucesso após o cadastro

### HU02: Edição de Cliente
**Como** administrador do sistema  
**Quero** editar informações de clientes existentes  
**Para** manter os dados atualizados

**Critérios de Aceitação:**
- Deve ser possível editar todos os campos do cliente
- O sistema deve validar os campos conforme as regras de cadastro
- O sistema deve exibir uma mensagem de sucesso após a edição

### HU03: Exclusão de Cliente
**Como** administrador do sistema  
**Quero** excluir clientes do sistema  
**Para** manter apenas clientes ativos na base

**Critérios de Aceitação:**
- Não deve ser possível excluir um cliente que possui vendas associadas
- O sistema deve solicitar confirmação antes da exclusão
- O sistema deve exibir uma mensagem de sucesso após a exclusão

### HU04: Listagem de Clientes
**Como** administrador do sistema  
**Quero** visualizar a lista de todos os clientes  
**Para** ter uma visão geral dos clientes cadastrados

**Critérios de Aceitação:**
- A lista deve exibir nome, telefone e email de cada cliente
- Deve ser possível ordenar a lista por nome
- Deve ser possível pesquisar clientes por nome ou CPF

## Gestão de Fabricantes

### HU05: Cadastro de Fabricante
**Como** administrador do sistema  
**Quero** cadastrar novos fabricantes  
**Para** associá-los aos produtos

**Critérios de Aceitação:**
- Deve ser possível inserir nome, telefone, endereço, email, razão social, CNPJ e contato
- O sistema deve validar se o CNPJ é um número válido
- O sistema deve validar se o telefone é um número válido
- O sistema deve exibir uma mensagem de sucesso após o cadastro

### HU06: Edição de Fabricante
**Como** administrador do sistema  
**Quero** editar informações de fabricantes existentes  
**Para** manter os dados atualizados

**Critérios de Aceitação:**
- Deve ser possível editar todos os campos do fabricante
- O sistema deve validar os campos conforme as regras de cadastro
- O sistema deve exibir uma mensagem de sucesso após a edição

### HU07: Exclusão de Fabricante
**Como** administrador do sistema  
**Quero** excluir fabricantes do sistema  
**Para** manter apenas fabricantes ativos na base

**Critérios de Aceitação:**
- Não deve ser possível excluir um fabricante que possui produtos associados
- O sistema deve solicitar confirmação antes da exclusão
- O sistema deve exibir uma mensagem de sucesso após a exclusão

## Gestão de Produtos

### HU08: Cadastro de Produto
**Como** administrador do sistema  
**Quero** cadastrar novos produtos  
**Para** disponibilizá-los para venda

**Critérios de Aceitação:**
- Deve ser possível inserir nome, valor de custo, categoria, valor de venda e fabricante
- O sistema deve validar se os valores são números positivos
- O sistema deve exibir uma mensagem de sucesso após o cadastro

### HU09: Edição de Produto
**Como** administrador do sistema  
**Quero** editar informações de produtos existentes  
**Para** manter os dados atualizados

**Critérios de Aceitação:**
- Deve ser possível editar todos os campos do produto
- O sistema deve validar os campos conforme as regras de cadastro
- O sistema deve exibir uma mensagem de sucesso após a edição

### HU10: Exclusão de Produto
**Como** administrador do sistema  
**Quero** excluir produtos do sistema  
**Para** remover produtos descontinuados

**Critérios de Aceitação:**
- Não deve ser possível excluir um produto que possui vendas associadas
- O sistema deve solicitar confirmação antes da exclusão
- O sistema deve exibir uma mensagem de sucesso após a exclusão

## Gestão de Vendas

### HU11: Registro de Venda
**Como** administrador do sistema  
**Quero** registrar novas vendas  
**Para** manter o controle financeiro

**Critérios de Aceitação:**
- Deve ser possível inserir identificador, data (dia, mês, ano), valor total, cliente e produto
- O sistema deve validar se a data é válida
- O sistema deve exibir uma mensagem de sucesso após o registro

### HU12: Listagem de Vendas
**Como** administrador do sistema  
**Quero** visualizar a lista de todas as vendas  
**Para** acompanhar o histórico de vendas

**Critérios de Aceitação:**
- A lista deve exibir identificador, data, valor total, cliente e produto de cada venda
- Deve ser possível ordenar a lista por data ou valor
- Deve ser possível filtrar vendas por período ou cliente
