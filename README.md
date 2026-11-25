# QAx — Zombieplus · testes E2E com Playwright

Suíte de testes end-to-end de uma aplicação web completa (front, API e banco),
escrita em Playwright com JavaScript e Page Object Model.

A aplicação **Zombieplus** é material do curso de Playwright da QAx (Fernando Papito).
Os testes em `projects/zombieplus` são meus, construídos ao longo do curso.
**Projeto de estudo em evolução** — o que está pronto e o que está em construção está
descrito abaixo.

## O que é testado

| Área | Cenários | Situação |
|---|---|---|
| **Fila de espera (leads)** | cadastro com sucesso · e-mail já cadastrado · e-mail inválido · nome vazio · e-mail vazio · nenhum campo preenchido | pronto |
| **Login do administrador** | login com sucesso · senha incorreta · e-mail inválido · e-mail vazio · senha vazia · nenhum campo preenchido | pronto |
| **Cadastro de filmes** | pré-condição de login montada; massa em fixture | em construção |

## Decisões de teste

- **Page Object Model** — `LandingPage`, `LoginPage`, `MoviesPage` e o componente
  `Toast`. Se a tela muda, a correção fica em um lugar só, não em cada teste.
- **Pré-condição pela API, verificação pela tela** — no cenário de e-mail duplicado, o
  primeiro lead é criado direto na API (`request.post`) e só a segunda tentativa passa
  pela interface. Mais rápido e não depende de outro teste.
- **Massa única com Faker** — nome e e-mail gerados a cada execução, para os testes
  não colidirem entre si nem com execuções anteriores.
- **Negativos antes de cobertura de tela** — metade dos cenários verifica o que o sistema
  deve **recusar** (campos obrigatórios, formato inválido, duplicidade).
- **Sem espera fixa** — as verificações usam a espera automática do `expect`.
- **Ambiente sobe com a suíte** — o `webServer` do Playwright inicia API e front antes
  dos testes e encerra no final; não sobra processo segurando porta entre execuções.
- **Trace sempre ligado** (screenshots e DOM) para diagnosticar falha sem reexecutar;
  no CI, `retries` e `forbidOnly` ficam ativos.

## Estrutura

```
apps/zombieplus/          aplicação sob teste (curso)
  api/                    API Node/Express + Sequelize (porta 3333)
  web/                    front já compilado (porta 3000)
  docker-compose.yml      PostgreSQL + pgAdmin
projects/zombieplus/      testes
  tests/e2e/              specs: leads, login, movies
  tests/pages/            Page Objects e componentes
  tests/support/fixtures/ massa de dados
  playwright.config.js
```

## Como rodar

Pré-requisitos: Node.js e Docker. A porta 5432 precisa estar livre — um PostgreSQL
instalado na máquina ocupa essa porta e impede o container do banco de subir.

### Preparação (uma vez)

```bash
# 1. Banco (PostgreSQL + pgAdmin em http://localhost:16543)
cd apps/zombieplus
docker compose up -d
docker exec pgdb psql -U postgres -c "create database zombieplus"

# 2. API — precisa de um .env (não versionado) com:
#    APP_URL, PORT=3333, FRONT_URL=http://localhost:3000, NODE_ENV, APP_NAME,
#    DB_DIALECT, DB_HOST, DB_NAME=zombieplus, DB_USER, DB_PASS, DB_PORT=5432
cd api
npm install
./db.sh          # recria as tabelas e carrega a massa inicial

# 3. Front
cd ../web
npm install

# 4. Testes
cd ../../../projects/zombieplus
npm install
npx playwright install chromium
```

### Rotina de execução

```bash
# 1. Banco
cd apps/zombieplus
docker compose up -d

# 2. Testes — o Playwright sobe a API e o front, roda a suíte e encerra os dois
cd ../../projects/zombieplus
npx playwright test
npx playwright show-report
```

A API (porta 3333) e o front (porta 3000) são iniciados pelo bloco `webServer` do
`playwright.config.js`; não é preciso manter um terminal aberto para cada um. Se algum
deles já estiver no ar, o Playwright reaproveita em vez de subir outro.

Para voltar o banco ao estado inicial: `./db.sh` em `apps/zombieplus/api`.

## Próximos passos

- Concluir o cadastro de filmes usando a massa de `fixtures/movies.json`.
- Centralizar a URL base no `playwright.config.js` em vez de repetir em cada Page Object.
- Esteira no GitHub Actions, como já existe no projeto de API
  ([ServRest-API](https://github.com/Dforato-ai/ServRest-API)).
