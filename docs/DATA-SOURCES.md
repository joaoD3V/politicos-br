# PoliticosBR — Roadmap de Consumo de Dados Públicos (MVP)

Este documento descreve os endpoints oficiais necessários para o MVP do PoliticosBR, utilizando exclusivamente dados públicos da Câmara dos Deputados do Brasil.

Objetivo do MVP:

> Permitir que usuários pesquisem deputados federais e visualizem perfil, propostas e atuação política.

---

# Fonte Oficial de Dados

## API Dados Abertos da Câmara dos Deputados

Base URL:

https://dadosabertos.camara.leg.br/api/v2

Características:

- Pública
- Gratuita
- Sem autenticação
- Estável
- Atualizada diariamente
- Padrão REST
- Retorno em JSON

---

# Escopo do MVP

Neste MVP, o PoliticosBR irá contemplar apenas:

- Deputados Federais em exercício
- Informações públicas oficiais
- Dados legislativos e administrativos

Não faz parte do MVP:

- Dados do TSE
- Eleições
- Autenticação
- Monetização
- Rankings
- Opiniões

---

# Roadmap de Endpoints

Abaixo estão listados os endpoints essenciais organizados por prioridade de implementação.

---

# 1️⃣ Busca de Deputados (Search)

## Objetivo

Permitir que o usuário pesquise deputados pelo nome e visualize uma lista básica.

---

## Endpoint

GET /deputados

---

## Parâmetros úteis

| Parâmetro    | Descrição                                    |
| ------------ | -------------------------------------------- |
| nome         | Filtro por nome do deputado                  |
| siglaUf      | Filtrar por estado (SP, RJ, MG...)           |
| siglaPartido | Filtrar por partido                          |
| itens        | Quantidade de resultados por página (ex: 20) |

---

## Exemplo

/deputados?nome=lula

---

## Dados principais utilizados

```json
id
nome
siglaPartido
siglaUf
urlFoto
Tela relacionada
Página de busca

Lista de resultados

2️⃣ Perfil do Deputado (Detalhes)
Objetivo
Exibir dados completos do deputado selecionado.

Endpoint
GET /deputados/{id}
Exemplo
/deputados/204554
Dados importantes
nomeCivil
dataNascimento
sexo
escolaridade
municipioNascimento
ufNascimento
ultimoStatus.situacao
ultimoStatus.condicaoEleitoral
ultimoStatus.gabinete
Tela relacionada
Página individual do deputado

3️⃣ Propostas Legislativas (Projetos de Lei)
Objetivo
Mostrar proposições apresentadas pelo deputado.

Endpoint
GET /proposicoes?idAutor={idDeputado}
Exemplo
/proposicoes?idAutor=204554
Parâmetros recomendados
?ordem=DESC&ordenarPor=dataApresentacao&itens=20
Dados principais
siglaTipo
numero
ano
ementa
dataApresentacao
statusProposicao
Tela relacionada
Aba "Propostas"

4️⃣ Votações do Deputado
Objetivo
Exibir histórico de votos do parlamentar.

Endpoint
GET /deputados/{id}/votacoes
Exemplo
/deputados/204554/votacoes
Dados importantes
data
descricao
voto
Tela relacionada
Aba "Votações"

5️⃣ Gastos Parlamentares (Cota Parlamentar)
Objetivo
Promover transparência financeira.

Endpoint
GET /deputados/{id}/despesas
Exemplo
/deputados/204554/despesas
Parâmetros recomendados
?ordem=DESC&ordenarPor=ano&itens=20
Dados importantes
tipoDespesa
valorDocumento
fornecedor
dataDocumento
Tela relacionada
Aba "Gastos"

6️⃣ Presença em Eventos e Sessões (Opcional MVP+)
Objetivo
Exibir participação em sessões e eventos.

Endpoint
GET /deputados/{id}/eventos
ou

GET /deputados/{id}/frequencias
Tela relacionada
Aba "Presença"

Ordem Recomendada de Implementação
MVP Inicial (Semana 1)
Implementar obrigatoriamente:

Busca de deputados

Perfil do deputado

Propostas legislativas

Esses três endpoints entregam o maior valor ao usuário.

MVP Estendido (Semana 2)
Adicionar:

Votações

Gastos parlamentares

MVP Completo (Semana 3)
Adicionar:

Presença e frequência

Estrutura Recomendada no Projeto NextJS
Centralizar consumo da API em um único serviço:

/services/camara-api.ts
Funções sugeridas
searchDeputies()
getDeputyById()
getDeputyProposals()
getDeputyVotes()
getDeputyExpenses()
getDeputyPresence()
Benefícios:

Código organizado

Fácil manutenção

Preparado para migração futura para NestJS

Facilita cache e rate limit

Boas Práticas Obrigatórias
Performance
Sempre limitar resultados com itens

Evitar requisições desnecessárias

Priorizar Server Components

Segurança
Nunca confiar 100% no formato da API

Validar dados recebidos

Tratar erros de rede

Civic Tech Guidelines
Não modificar dados

Não criar rankings artificiais

Não aplicar viés político

Exibir apenas dados oficiais

Priorizar transparência
```
