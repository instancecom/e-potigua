# AGENTS.md

## Objetivo

Este arquivo define como agentes de IA devem trabalhar neste projeto.

As regras aqui são independentes da ferramenta utilizada.

O projeto pode ser desenvolvido utilizando:

- Antigravity diretamente;
- OpenCode dentro do Antigravity;
- OpenCode utilizando 9Router;
- outras ferramentas de agentes no futuro.

Nenhuma ferramenta específica deve ser considerada obrigatória para o funcionamento destas regras.

---

# Regra principal

Antes de realizar qualquer alteração relevante no projeto, o agente deve consultar os arquivos de contexto necessários para compreender o estado atual do sistema.

Os arquivos `.md` deste projeto funcionam como memória persistente e fonte de contexto.

O agente não deve assumir que conhece o projeto apenas pelo código existente.

---

# Arquivos de contexto

A estrutura principal é:

- `AGENTS.md` — como o agente deve trabalhar.
- `PROJECT.md` — contexto, propósito e visão do projeto.
- `PRODUCT.md` — comportamento e regras do produto.
- `DESIGN.md` — princípios de UX/UI.
- `ARCHITECTURE.md` — arquitetura técnica.
- `DATABASE.md` — estrutura e regras dos dados.
- `SECURITY.md` — regras de segurança e autorização.
- `CHANGELOG.md` — decisões e mudanças importantes.

---

# Ordem de consulta

Quando uma tarefa for iniciada:

1. Ler `AGENTS.md`.
2. Identificar quais arquivos de contexto são relevantes.
3. Consultar esses arquivos antes de tomar decisões.
4. Verificar o código existente.
5. Implementar a solução.
6. Validar o resultado.
7. Atualizar os arquivos `.md` quando uma decisão importante do projeto tiver sido criada ou alterada.

Não é necessário ler todos os arquivos para toda tarefa.

O agente deve consultar somente o contexto necessário, mas nunca ignorar um arquivo que contenha regras diretamente relacionadas à tarefa.

---

# Regra para decisões

Não inventar regras de negócio quando elas não estiverem definidas.

Quando uma informação estiver ausente:

- verificar os arquivos de contexto;
- verificar o código existente;
- identificar se existe uma decisão anterior relacionada;
- somente então propor uma solução.

Se ainda não houver uma definição, o agente deve preferir a solução mais simples e coerente com o projeto.

Decisões relevantes devem ser registradas no `CHANGELOG.md`.

---

# Produto antes da implementação

Antes de implementar uma funcionalidade, o agente deve entender:

- qual problema ela resolve;
- quem utiliza a funcionalidade;
- qual é o fluxo esperado;
- quais regras de negócio existem;
- quais permissões são necessárias;
- como ela se relaciona com os demais domínios.

Não implementar apenas porque uma solução técnica parece conveniente.

---

# Segurança

O frontend controla experiência e visibilidade.

O backend controla autorização.

Esconder um botão não é uma medida de segurança.

Toda operação sensível deve ser validada no backend.

O agente deve consultar `SECURITY.md` antes de alterar:

- autenticação;
- autorização;
- permissões;
- empresas;
- unidades;
- usuários;
- dados de clientes;
- pagamentos;
- financeiro;
- estoque;
- fidelidade;
- integrações externas;
- APIs;
- webhooks.

---

# Multiempresa

O sistema é multi-tenant.

Dados de uma empresa nunca devem ficar acessíveis a outra empresa.

Toda implementação que acessar dados de negócio deve considerar:

- empresa;
- unidade;
- usuário;
- permissões;
- recurso solicitado.

Nunca assumir que um ID recebido pelo frontend é suficiente para autorizar uma operação.

---

# Banco de dados

Alterações estruturais no banco devem seguir `DATABASE.md` e `ARCHITECTURE.md`.

Não criar tabelas, campos ou relacionamentos apenas por antecipação.

Priorizar:

- integridade;
- relacionamentos claros;
- restrições;
- índices necessários;
- histórico correto;
- isolamento entre empresas;
- RLS;
- migrations.

---

# Arquitetura

Seguir `ARCHITECTURE.md`.

Evitar:

- microserviços prematuros;
- abstrações desnecessárias;
- dependências sem necessidade;
- duplicação de regras;
- acoplamento desnecessário com fornecedores;
- soluções complexas para problemas simples.

A arquitetura deve permitir evolução sem antecipar complexidade.

---

# Design

Seguir `DESIGN.md`.

Não criar interfaces genéricas de ERP ou SaaS.

A experiência deve permanecer consistente com o conceito:

> Banco digital moderno + operação automotiva premium.

Antes de criar um novo componente ou padrão visual, verificar se já existe uma solução reutilizável.

---

# Integrações externas

Integrações devem permanecer desacopladas do domínio principal.

Isso é especialmente importante para pagamentos.

O sistema utiliza uma camada de pagamento:

`SaaS → Payment Layer → Provider Connector → Provedor`

O Mercado Pago é o primeiro provedor definido para a V1.

Não espalhar regras específicas do Mercado Pago pelo restante da aplicação.

---

# Alterações de contexto

Quando uma decisão importante mudar:

1. Implementar ou ajustar a solução.
2. Atualizar o arquivo de contexto correspondente.
3. Registrar a mudança no `CHANGELOG.md`.

Os arquivos `.md` devem representar o estado atual do projeto.

---

# Git

O agente deve evitar alterações destrutivas sem necessidade.

Antes de modificar arquivos importantes:

- entender o estado atual;
- preservar decisões existentes;
- evitar sobrescrever trabalho válido;
- revisar o diff quando possível.

Commits devem representar mudanças coerentes.

---

# Execução

O agente deve:

- analisar antes de modificar;
- reutilizar o que já existe;
- fazer mudanças pequenas e coerentes;
- evitar alterações fora do escopo;
- validar o resultado;
- informar problemas encontrados.

Não alterar partes não relacionadas apenas para "organizar" o projeto.

---

# Compatibilidade entre agentes

Os arquivos deste projeto devem permanecer independentes da ferramenta de IA utilizada.

Se o projeto for executado através de:

- Antigravity;
- OpenCode;
- OpenCode + 9Router;
- outra ferramenta compatível;

as mesmas regras de produto, arquitetura, banco e segurança continuam válidas.

A ferramenta pode mudar.

A memória e as decisões do projeto não.

---

# Regra final

Antes de perguntar:

> "Como devo implementar isso?"

o agente deve primeiro responder:

> "O que o projeto já decidiu sobre isso?"

E somente depois escolher a implementação técnica.
