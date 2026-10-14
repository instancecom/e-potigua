# CHANGELOG.md

## Objetivo

Este arquivo registra decisões e mudanças importantes do projeto.

O objetivo não é substituir commits do Git nem registrar cada alteração de código.

Ele deve preservar o histórico das decisões que podem afetar produto, arquitetura, banco de dados, segurança, experiência do usuário ou estratégia do SaaS.

---

## Como usar este arquivo

Registrar uma mudança quando ela:

- altera uma regra importante do produto;
- muda uma decisão arquitetural;
- adiciona ou remove uma integração relevante;
- altera o escopo da primeira versão;
- cria uma regra de segurança;
- muda uma decisão de banco de dados;
- define algo importante para o futuro do produto.

Não registrar:

- correções pequenas de bugs;
- alterações cosméticas;
- refatorações internas sem impacto arquitetural;
- cada commit individual.

As decisões devem ser registradas em ordem cronológica.

Quando uma decisão antiga for substituída, registrar uma nova entrada explicando o que mudou e por quê.

---

# Histórico

## Fundação do projeto

### Decisão

O projeto será desenvolvido como um SaaS para gestão de lava-rápidos e negócios de estética automotiva.

A ideia surgiu a partir de uma operação real de duas unidades de lava-rápido, que será utilizada como primeiro ambiente de validação.

A operação familiar não limita o produto a duas unidades.

O sistema deve nascer preparado para atender múltiplas empresas e múltiplas unidades.

### Motivo

O objetivo é validar o produto em uma operação real antes de comercializá-lo para outros negócios do segmento.

---

## Produto como plataforma SaaS

### Decisão

O produto será construído como um SaaS multiempresa e multiunidade desde o início.

Cada empresa possuirá seus próprios dados, usuários, unidades, clientes, veículos, serviços, atendimentos, pagamentos e informações financeiras.

### Motivo

Evitar que a primeira implementação fique presa à operação utilizada para validação.

A estrutura deve permitir que novas empresas sejam adicionadas sem reconstrução do produto.

---

## Foco do produto

### Decisão

O sistema não será tratado apenas como um sistema de cadastro.

O objetivo é funcionar como uma plataforma operacional para o negócio.

O produto deve conectar:

- gestão;
- operação;
- funcionários;
- clientes;
- veículos;
- serviços;
- agenda;
- pagamentos;
- financeiro;
- estoque;
- fidelidade;
- acompanhamento do serviço.

### Visão

A longo prazo, o produto poderá evoluir para um verdadeiro sistema operacional para negócios de lavagem e estética automotiva.

---

# Produto

## Primeira versão

A primeira versão deve contemplar as funcionalidades essenciais definidas durante a construção do projeto:

- empresas;
- múltiplas unidades;
- funcionários;
- transferências temporárias entre unidades;
- clientes;
- veículos;
- serviços;
- preços por tipo de veículo;
- duração dos serviços;
- agendamento;
- operação de serviços;
- atendimento sem agendamento;
- serviços adicionais;
- pagamentos;
- financeiro básico;
- estoque;
- solicitações de produtos;
- fidelidade;
- acompanhamento do status do veículo pelo cliente.

---

## Estados da operação

### Decisão

O fluxo operacional utiliza inicialmente os seguintes estados:

- `Na fila`
- `Lavando`
- `Secando`
- `Finalizado`

### Motivo

Representar de forma simples o fluxo real da operação sem criar complexidade desnecessária.

---

## Capacidade operacional

### Decisão

A capacidade inicial da unidade será relacionada à quantidade de lavadores disponíveis.

A regra poderá evoluir conforme a validação da operação real.

### Motivo

Começar com uma regra simples e próxima da realidade do negócio, evitando criar um sistema de capacidade excessivamente complexo antes de haver necessidade.

---

## Fidelidade

### Decisão

O programa de fidelidade terá exatamente 8 carimbos.

O proprietário poderá configurar a recompensa, que poderá ser:

- valor em dinheiro;
- serviço.

Após completar os 8 carimbos, o cliente poderá resgatar a recompensa por meio de um código único.

Após a confirmação do resgate, o código será invalidado e os carimbos serão reiniciados.

---

# Design

## Direção visual

### Decisão

A interface seguirá a filosofia de produtos financeiros digitais modernos.

A principal referência conceitual é a experiência de bancos digitais como o Nubank, sem copiar sua identidade visual.

O produto deve transmitir:

- simplicidade;
- confiança;
- organização;
- velocidade;
- profissionalismo;
- tecnologia.

### Princípio

> Banco digital moderno + operação automotiva premium.

O sistema não deve parecer:

- ERP tradicional;
- sistema administrativo antigo;
- template genérico de SaaS;
- interface gerada automaticamente por IA.

---

## Experiência de uso

### Decisão

O sistema será mobile-first e também deverá funcionar muito bem em desktop.

A interface deve priorizar:

- poucas etapas;
- ações claras;
- poucos cliques;
- leitura rápida;
- feedback imediato;
- componentes reutilizáveis.

A operação deve ser especialmente rápida para funcionários que trabalham diretamente com os veículos.

---

# Arquitetura

## Stack inicial

### Decisão

A arquitetura inicial utilizará:

- Next.js;
- React;
- TypeScript;
- Supabase;
- PostgreSQL;
- Supabase Auth;
- Google OAuth;
- Resend;
- Cakto;
- Mercado Pago;
- Git/GitHub;
- Vercel;
- Registro.br.

---

## Monólito modular

### Decisão

O projeto será inicialmente um monólito modular.

Os domínios serão separados dentro da aplicação, mas não haverá criação prematura de microserviços.

### Motivo

Manter o sistema simples de desenvolver, testar, operar e evoluir enquanto o produto ainda está sendo validado.

Microserviços poderão ser considerados posteriormente caso exista uma necessidade real.

---

## Multi-tenancy

### Decisão

O isolamento entre empresas é obrigatório.

Nenhum usuário deve conseguir acessar dados pertencentes a outra empresa.

A separação deve existir no backend e no banco de dados.

---

## Backend como autoridade

### Decisão

O frontend controla a experiência e a visibilidade das ações.

O backend controla o que o usuário realmente pode fazer.

Esconder um botão não é considerado uma medida de segurança.

Toda operação sensível deve ser validada no backend.

---

# Banco de dados

## PostgreSQL

### Decisão

O banco principal será PostgreSQL através do Supabase.

O banco deverá representar a verdade do negócio e manter a integridade dos dados.

Devem ser utilizados quando necessários:

- chaves estrangeiras;
- restrições;
- índices;
- valores obrigatórios;
- validações;
- transações;
- RLS.

---

## Histórico de valores

### Decisão

Valores importantes aplicados em operações devem ser preservados historicamente.

Por exemplo, uma alteração futura no preço de um serviço não deve modificar o valor registrado em um atendimento realizado anteriormente.

---

# Pagamentos

## Separação entre pagamento e provedor

### Decisão

O núcleo do sistema não deve depender diretamente de um único provedor de pagamentos.

Será utilizado um Payment Layer.

A estrutura conceitual será:

`SaaS → Payment Layer → Provider Connector → Provedor`

---

## Mercado Pago na V1

### Decisão

O Mercado Pago será o primeiro provedor integrado na primeira versão.

A escolha foi feita porque a operação utilizada para validação já utiliza Mercado Pago.

O sistema poderá enviar o valor da venda para um terminal compatível, aguardar o resultado e registrar o pagamento.

O processamento financeiro continua sendo responsabilidade do Mercado Pago.

O SaaS apenas orquestra a operação e registra o resultado.

---

## Preparação para outros provedores

### Decisão

A integração com Mercado Pago não deve contaminar o domínio principal do sistema.

A arquitetura deverá permitir a inclusão futura de outros provedores sem reescrever o núcleo de pagamentos.

Possíveis integrações futuras podem incluir outros adquirentes e operadores de terminais.

---

## Pagamentos sem integração

### Decisão

O sistema também deverá registrar pagamentos realizados fora da integração de terminal.

Métodos iniciais:

- Pix;
- dinheiro;
- débito;
- crédito;
- terminal integrado.

Quando o atendimento possui valor previamente calculado, o funcionário não precisa redigitar o valor.

Em atendimentos sem agendamento, o funcionário poderá informar o valor manualmente.

---

# Segurança

## Segurança desde o início

### Decisão

Segurança será tratada como requisito arquitetural, e não como etapa posterior.

O sistema deverá utilizar:

- autenticação;
- autorização;
- RLS;
- isolamento por empresa;
- validação de permissões;
- validação de unidade;
- proteção de APIs;
- controle de acesso a recursos;
- proteção de segredos;
- logs e auditoria quando necessários.

---

## Regra principal de autorização

### Decisão

A regra fundamental do projeto é:

> Segurança não é esconder o botão. Segurança é impedir a operação.

Uma ação não autorizada deve ser rejeitada pelo backend mesmo que o usuário consiga chamar a API diretamente.

---

## LGPD

### Decisão

O produto deverá considerar LGPD desde a arquitetura inicial.

A aplicação deve aplicar princípios de:

- minimização de dados;
- finalidade;
- controle de acesso;
- retenção adequada;
- proteção de dados pessoais;
- privacidade desde o desenvolvimento.

---

# Integrações futuras

## Automação automotiva

### Visão futura

O produto poderá futuramente integrar recursos como:

- leitura automática de placas;
- câmeras;
- reconhecimento de veículos;
- histórico automotivo;
- manutenção;
- multas;
- pedágios;
- estacionamento;
- automações por WhatsApp;
- inteligência artificial;
- analytics avançado.

Esses recursos não devem antecipar complexidade na primeira versão sem necessidade real.

---

## White Label de pagamentos

### Visão futura

A possibilidade de criar uma infraestrutura própria de pagamentos poderá ser estudada futuramente.

Isso poderia envolver:

- Payment Layer próprio;
- parceiro financeiro;
- terminais SmartPOS;
- processamento;
- eventual identidade própria dos terminais.

Essa possibilidade não faz parte da implementação inicial.

---

# Princípio de evolução

O projeto deve evoluir a partir de necessidades reais observadas na operação e nos clientes.

Não criar estruturas apenas porque podem ser úteis no futuro.

A arquitetura deve ser preparada para evoluir, mas o produto deve permanecer simples enquanto a complexidade não for necessária.

---

# Estado atual

A fundação do projeto está definida nos seguintes arquivos:

1. `AGENTS.md`
2. `PROJECT.md`
3. `PRODUCT.md`
4. `DESIGN.md`
5. `ARCHITECTURE.md`
6. `DATABASE.md`
7. `SECURITY.md`
8. `CHANGELOG.md`

Esses arquivos representam a base de contexto que deve ser consultada pelos agentes antes de tomar decisões relevantes no projeto.

---

## Estruturação Técnica Inicial (Fundação)

### Decisões Implementadas

1. **Next.js & TypeScript**:
   - Inicializada a estrutura modular no Next.js (App Router) com TypeScript em modo estrito (`strict: true`) e alias `@/*`.
   - Convenção nativa do Next.js 16 para interceptação de requisições (`proxy.ts`).
2. **Design Tokens & Identidade**:
   - Configurados tokens de cores (`#0F4C5C`, `#1677FF`, `#F7F8FA`, `#FFFFFF`, `#17191C`), bordas (`8px`, `12px`, `16px`) e fonte `Inter`.
   - Criados componentes base de UI tátil (`Button`, `Card`, `Badge` com suporte nativo aos 4 status da operação).
3. **Segurança & Supabase SSR**:
   - Clientes especializados para navegador, servidor e rotas administrativas (`service_role`).
   - Helpers de autorização e mitigação contra IDOR/BOLA (`assertTenantOwnership`, `assertUnitAccess`).
   - Template seguro `.env.example` protegendo segredos e credenciais de provedores.
4. **Domínios & Payment Layer Agnóstico**:
   - Estruturada a organização por domínios em `src/features/` (`companies`, `units`, `employees`, `customers`, `vehicles`, `services`, `appointments`, `operations`, `finance`, `loyalty`, `inventory`, `payments`).
   - Implementado o contrato agnóstico do `Payment Layer` (`IPaymentConnector`, `PaymentService`), encapsulando a orquestração do Mercado Pago para SmartPOS/Point sem acoplar a aplicação ao provedor.

---

## Banco de Dados & RLS Multi-Tenant (Migration 000001)

### Decisões Implementadas

1. **Modelagem Relacional Integral (PostgreSQL / Supabase)**:
   - Criada a migration `supabase/migrations/20261014000001_initial_schema.sql` cobrindo os 11 domínios de negócio: empresas, unidades, perfis de usuários, funcionários e transferências temporárias, clientes, veículos (6 categorias), serviços e preços por veículo, agendamentos, atendimentos nos 4 status operacionais (`na_fila`, `lavando`, `secando`, `finalizado`), financeiro, transações de pagamento (Payment Layer), fidelidade (8 carimbos e código de resgate) e estoque com solicitações.
2. **Row Level Security (RLS) Mandatório**:
   - RLS ativado em 100% das tabelas de negócio com negação por padrão.
   - Criada a função segura `get_auth_company_id()` e políticas estritas de isolamento por `company_id`.
   - Políticas refinadas para acesso operacional de funcionários por unidade e visibilidade dos clientes sobre seus próprios veículos, agendamentos e fidelidade.
3. **Integridade de Dados & Histórico Imutável**:
   - Chave de idempotência única em `payment_transactions` para prevenção contra duplicidade.
   - Preços aplicados nos atendimentos são armazenados de forma imutável em `attendance_items`.
   - Seed data estruturado em `supabase/seed.sql` com a empresa piloto e as duas unidades iniciais de validação.
