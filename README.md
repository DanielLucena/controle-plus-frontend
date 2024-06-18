# Controle+

## Objetivo

Aplicação frontend para consumir API REST da aplicação: https://github.com/DanielLucena/mercearia

## Requisitos:

Paginas:

- [x] HomePage : Daniel 03/06-09/06
  - [x] Login
  - [x] Registrar
- [x] Pagina welcome padrao
- [ ] LandingPage do gerente (navbar gerente + welcome)
  - [x] Fornecedor : Daniel 03/06-09/06
    - [x] pagina de listagem
    - [x] pagina de formulario(post, put)
  - [ ] Produto : Daniel 10/06 - 16/06
    - [ ] pagina de listagem
    - [ ] pagina de formulario(post, put)
  - [x] Cliente : Gabriel 10/06 - 16/06 (funcional, resta consertar OBS)
    - [x] pagina de listagem
    - [x] pagina de formulario(post, put)
    - [ ] OBS: (estoura erro ao tentar editar somente nome, dizendo que já tem o cpf cadastrado)
  - [ ] Pedido : (apenas formulario de criação)
    - [ ] pagina de formulario(post, put) : Daniel 10/06 - 16/06
  - [ ] Pagamento : (listagem de pedidos com ação de pagar) Gabriel 18/06 - 24/06
    - [ ] pagina de listagem
    - [ ] pagina de formulario(post, put)
  - [x] Funcionario : Gabriel 03/06-09/06 (funcional, resta consertar OBS)
    - [x] pagina de listagem
    - [x] pagina de formulario(post, put)
    - [ ] OBS: (resta adicionar FUNÇÃO do funcionario, tem apenas nome e id)
  - [ ] Remessa
    - [ ] pagina de listagem
    - [ ] pagina de formulario(post, put)
- [ ] LandingPage do cliente (navbar cliente + welcome)
  - [ ] Cliente (get, post)
  - [ ] Pedido (get)
  - [ ] Pagamento (get)
  - [ ] produto (get)
- [ ] LandingPage do caixa (navbar caixa + welcome)
  - [ ] Pagamento (post)
  - [ ] Pedido (post, post)
  - [ ] Produto (get)
  - [ ] Cliente (get)
  - [ ] Funcionario (get)
- [ ] LandingPage do repositor (navbar repositor + welcome)
  - [ ] Produto (get)
  - [ ] Funcionario (get)
  - [ ] Remessa (get, post)
  - [ ] Fornecedor (get)

obs: utilizar paginas criadas para gerente nas outras roles, porem alterando de acordo com suas permissões

## Rodar

```
npm install

npm run dev
```
