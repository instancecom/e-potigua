# ARCHITECTURE.md

## 1. Objetivo

Este documento define a arquitetura técnica do produto.

A arquitetura deve permitir construir uma primeira versão simples, segura e profissional, sem criar complexidade desnecessária.

O sistema deve nascer preparado para:

- Múltiplas empresas.
- Múltiplas unidades.
- Crescimento gradual.
- Integrações externas.
- Evolução do produto sem reconstruções desnecessárias.

A arquitetura deve favorecer um **monólito modular**, evitando microserviços prematuros.

---

## 2. Stack principal

### Desenvolvimento

- Antigravity

### Frontend e aplicação

- Next.js
- React
- TypeScript

### Banco de dados

- Supabase
- PostgreSQL

### Autenticação

- Supabase Auth
- Email e senha
- Google OAuth

### Email

- Resend

### Pagamentos da assinatura SaaS

- Cakto

### Pagamentos dos clientes do lava-rápido

- Integração inicial com Mercado Pago
- Arquitetura preparada para outros provedores futuramente

### Domínio

- Registro.br

### Versionamento

- Git
- GitHub

### Deploy

- Vercel

---

## 3. Princípios arquiteturais

A arquitetura deve seguir alguns princípios fundamentais:

1. Simplicidade antes de complexidade.
2. Segurança desde o início.
3. Isolamento entre empresas.
4. Integridade dos dados.
5. Regras de negócio claras.
6. Código organizado por domínio.
7. Integrações desacopladas.
8. Evitar abstrações prematuras.
9. Evitar dependências desnecessárias.
10. Crescer conforme houver necessidade real.

A arquitetura deve resolver os problemas atuais sem tentar prever todos os problemas futuros.

---

## 4. Modelo arquitetural

O sistema será inicialmente um **monólito modular**.

Isso significa que o produto será uma aplicação principal, mas organizada internamente por domínios.

Exemplos de domínios:

- Empresas
- Unidades
- Funcionários
- Clientes
- Veículos
- Serviços
- Agendamentos
- Operação
- Financeiro
- Fidelidade
- Estoque
- Pagamentos

O fato de estar em uma aplicação única não significa que todo o código deve ficar misturado.

Cada domínio deve possuir responsabilidades claras.

---

## 5. Organização do código

A estrutura deve favorecer separação por domínio.

Uma organização conceitual pode seguir:

```text
app/
  ...

features/
  companies/
  units/
  employees/
  customers/
  vehicles/
  services/
  appointments/
  operations/
  finance/
  loyalty/
  inventory/
  payments/

A estrutura exata pode evoluir conforme o projeto for implementado.

Não criar uma arquitetura extremamente abstrata antes de existir necessidade real.

6. Frontend

O frontend será construído com Next.js, React e TypeScript.

Sua responsabilidade principal é:

Interface.
Navegação.
Interações.
Apresentação dos dados.
Validações de experiência do usuário.
Estados de carregamento.
Estados vazios.
Mensagens de erro.
Comunicação com o backend.

O frontend não é uma barreira de segurança.

Nenhuma regra de autorização importante deve depender apenas da interface.

7. Backend

O backend será responsável por:

Regras de negócio.
Operações sensíveis.
Autorização.
Comunicação segura com serviços externos.
Processamento de webhooks.
Operações administrativas.
Operações que exigem credenciais privadas.
Validações que não podem ser confiadas ao cliente.

As regras críticas devem ser executadas no servidor e, quando aplicável, reforçadas pelo banco de dados.

8. Supabase

O Supabase será utilizado como infraestrutura principal de backend e dados.

Será utilizado principalmente para:

PostgreSQL.
Supabase Auth.
Row Level Security.
Storage, quando necessário.
Recursos de tempo real quando houver benefício real.

O banco PostgreSQL será a fonte principal da verdade dos dados do negócio.

9. Multi-tenant

A plataforma deve ser multiempresa desde o início.

Cada empresa deve possuir isolamento lógico dos seus dados.

Uma empresa nunca pode conseguir acessar dados pertencentes a outra empresa.

O isolamento deve existir em múltiplas camadas:

Banco de dados.
Backend.
Regras de autorização.
Interface.

A interface nunca deve ser considerada suficiente para garantir isolamento.

10. Row Level Security

O PostgreSQL/Supabase deve utilizar Row Level Security (RLS) para reforçar o isolamento dos dados.

As políticas devem considerar o usuário autenticado e sua relação com a empresa e unidade correspondente.

A autorização deve ser definida de forma explícita.

Não utilizar RLS apenas como detalhe opcional.

11. Autenticação e autorização

Autenticação responde:

Quem é o usuário?

Autorização responde:

O que esse usuário pode fazer?

O Supabase Auth será responsável pela autenticação.

A autorização será determinada pelas relações e permissões do usuário dentro da plataforma.

O modelo deve permitir representar conceitualmente:

Usuário
  ↓
Empresa
  ↓
Unidade
  ↓
Permissões

Um usuário pode possuir diferentes níveis de acesso conforme sua função.

12. Empresas, unidades e funcionários

A arquitetura deve representar:

Empresa.
Unidade.
Funcionário.
Unidade principal do funcionário.
Transferências temporárias.

Um funcionário não deve precisar ser duplicado para trabalhar temporariamente em outra unidade.

A operação deve conseguir determinar em qual unidade o funcionário está atuando naquele momento.

13. Domínios de negócio

Cada domínio deve concentrar suas próprias regras sempre que possível.

Exemplo:

services/
  regras relacionadas a serviços

appointments/
  regras relacionadas a agendamentos

operations/
  regras relacionadas à execução dos atendimentos

finance/
  regras relacionadas ao financeiro

loyalty/
  regras relacionadas à fidelidade

inventory/
  regras relacionadas ao estoque

payments/
  regras relacionadas aos pagamentos

Evitar criar um único serviço gigante contendo todas as regras do sistema.

14. Pagamentos

Existem dois conceitos diferentes de pagamento na plataforma.

14.1 Assinatura do SaaS

A empresa paga a assinatura da plataforma.

O provedor escolhido para essa finalidade é a Cakto.

A plataforma deve armazenar o estado da assinatura necessário para controlar o acesso ao SaaS.

A aplicação não deve depender de consultar a Cakto a cada acesso.

A atualização da assinatura deve ocorrer por meio da integração e webhooks apropriados.

14.2 Pagamentos dos clientes do lava-rápido

Os pagamentos realizados pelos clientes do estabelecimento são diferentes da assinatura do SaaS.

Na V1, o primeiro provedor de pagamento a ser integrado será o Mercado Pago.

O Mercado Pago será responsável pelo processamento da transação.

A plataforma será responsável por:

Iniciar a operação quando aplicável.
Enviar o valor.
Acompanhar o resultado.
Registrar a transação.
Associar a transação ao atendimento.
Atualizar o estado do pagamento.

O SaaS não deve armazenar dados sensíveis de cartão.

15. Camada de pagamentos

A integração de pagamentos deve ser criada como uma camada própria.

O objetivo é evitar que as regras do produto dependam diretamente de um fornecedor específico.

A arquitetura conceitual será:

SaaS
  ↓
Payment Layer
  ↓
Provider Connector
  ↓
Terminal / Provedor

Na V1:

SaaS
  ↓
Payment Layer
  ↓
Mercado Pago Connector
  ↓
Terminal Mercado Pago

No futuro, novos conectores poderão ser adicionados sem alterar as regras centrais do financeiro e da operação.

Exemplo futuro:

Payment Layer
  ├── Mercado Pago
  ├── Cielo
  ├── Stone
  ├── Rede
  └── Outros provedores

Os nomes acima representam possibilidades futuras, não integrações obrigatórias da V1.

16. Integração com terminal

Quando houver suporte do provedor e do equipamento utilizado, o fluxo poderá ser:

Atendimento
  ↓
Valor da venda
  ↓
Payment Layer
  ↓
Provider Connector
  ↓
Terminal
  ↓
Cliente realiza pagamento
  ↓
Provedor retorna resultado
  ↓
Sistema registra pagamento

O sistema deve diferenciar estados como:

Aguardando pagamento.
Processando.
Aprovado.
Recusado.
Cancelado.
Erro.

Os estados exatos devem seguir as capacidades reais do provedor integrado.

Não inventar comportamentos que o provedor não suporte.

17. Webhooks

Integrações externas que utilizarem webhooks devem ser tratadas com segurança.

O processamento deve considerar:

Validação da origem.
Idempotência.
Eventos duplicados.
Falhas de comunicação.
Estados inconsistentes.
Registro de eventos relevantes.

Um mesmo evento externo não deve causar múltiplos efeitos indevidos no sistema.

18. Integrações externas

Integrações externas devem ficar isoladas do núcleo do produto sempre que possível.

Exemplos:

Resend.
Cakto.
Mercado Pago.
Google OAuth.
Futuras integrações automotivas.
Futuras integrações de estacionamento.
Futuras integrações de leitura de placas.

O domínio do produto não deve ficar cheio de lógica específica de cada fornecedor.

19. Email

O Resend será utilizado para emails transacionais.

Exemplos:

Confirmações.
Recuperação de acesso.
Notificações.
Comunicações relacionadas à conta.

Credenciais do Resend devem permanecer no servidor.

20. Banco de dados

O PostgreSQL será o banco principal.

O banco deve garantir integridade por meio de:

Foreign keys.
Constraints.
Unique constraints.
Not null quando aplicável.
Check constraints quando aplicável.
Índices.
Transações.

A estrutura detalhada dos dados está definida em DATABASE.md.

21. Migrações

Alterações estruturais no banco devem ser feitas por migrations.

Isso inclui:

Novas tabelas.
Alterações de colunas.
Índices.
Constraints.
Policies.
Funções.
Triggers.

Evitar alterações manuais não versionadas no banco de produção.

22. Transações

Operações que alteram múltiplos registros relacionados devem utilizar transações quando necessário para garantir consistência.

Exemplos:

Finalização de atendimento.
Registro de pagamento e atualização relacionada.
Resgate de recompensa.
Operações que alterem múltiplas entidades de forma dependente.

A necessidade de transação deve ser avaliada de acordo com cada operação.

23. Performance

A aplicação deve priorizar:

Consultas eficientes.
Índices adequados.
Paginação quando necessário.
Carregamento sob demanda.
Server Components quando fizer sentido.
Evitar consultas repetitivas.
Evitar carregamento desnecessário de dados.

Cache deve ser utilizado somente quando houver benefício real.

Não criar uma infraestrutura de cache antecipadamente.

24. Realtime

Recursos de tempo real podem ser utilizados quando houver benefício operacional claro.

Um exemplo relevante é o acompanhamento dos estados dos serviços.

O realtime não deve ser aplicado indiscriminadamente em todas as telas.

25. Storage

Quando houver necessidade de armazenar arquivos ou imagens, o Storage do Supabase poderá ser utilizado.

O acesso aos arquivos deve respeitar o isolamento entre empresas.

Arquivos privados não devem ser expostos publicamente sem necessidade.

26. Segurança

Segurança deve ser tratada desde o início.

Princípios:

Segredos somente em variáveis de ambiente.
Nunca armazenar secrets no código.
Nunca versionar credenciais.
Nunca expor chaves privadas no frontend.
Validar entradas.
Aplicar autorização no backend.
Utilizar RLS.
Proteger webhooks.
Não armazenar dados sensíveis de cartão.
Registrar erros sem expor informações sensíveis.

Detalhes adicionais serão definidos em SECURITY.md.

27. Variáveis de ambiente

Credenciais e configurações sensíveis devem utilizar variáveis de ambiente.

Exemplos:

Supabase.
Resend.
Cakto.
Mercado Pago.
OAuth.
Outras integrações.

Nenhuma credencial deve ser inserida diretamente no código.

28. Git, GitHub e deploy

O código será versionado com Git e armazenado no GitHub.

O fluxo principal será:

Desenvolvimento
      ↓
Antigravity
      ↓
Git
      ↓
GitHub
      ↓
Vercel
      ↓
Deploy

A Vercel será responsável pelo hosting e deploy da aplicação.

As variáveis de ambiente devem ser configuradas corretamente em cada ambiente.

29. Ambientes

O projeto deve considerar separação entre ambientes.

Inicialmente:

Desenvolvimento.
Produção.

Ambientes de preview ou staging podem ser utilizados quando houver necessidade.

Dados de produção não devem ser tratados como dados descartáveis de desenvolvimento.

30. Observabilidade

O sistema deve possuir mecanismos para identificar:

Erros.
Falhas de integração.
Falhas de autenticação.
Falhas de pagamento.
Problemas relevantes de operação.

Logs devem ser úteis para diagnóstico sem expor informações sensíveis.

Ferramentas específicas de observabilidade podem ser adicionadas quando houver necessidade real.

31. Dependências

Antes de adicionar uma biblioteca ou serviço externo, verificar se:

O Next.js já resolve o problema.
O React já resolve o problema.
O Supabase já possui o recurso necessário.
A dependência realmente reduz complexidade.

Não adicionar bibliotecas apenas por conveniência.

32. Abstrações

Evitar:

Repositórios genéricos sem necessidade.
Frameworks internos.
Camadas artificiais.
Sistemas genéricos de eventos.
Cache complexo.
Abstrações criadas apenas pensando em um futuro hipotético.

Abstrações devem nascer de necessidades reais.

A camada de pagamentos é uma abstração justificável porque existe uma necessidade concreta de desacoplar o produto dos provedores externos.

33. Escalabilidade

A primeira versão não deve ser construída para milhões de usuários.

Ela deve ser construída corretamente para crescer.

O caminho esperado é:

Monólito modular
      ↓
Otimização
      ↓
Índices
      ↓
Cache quando necessário
      ↓
Filas/processamento assíncrono quando necessário
      ↓
Serviços especializados somente quando justificado

Microserviços não fazem parte da arquitetura inicial.

34. Evolução futura

A arquitetura deve permitir evoluções como:

Mais provedores de pagamento.
Maquininhas White Label.
Integração com sistemas de estacionamento.
Leitura automática de placas.
Integrações automotivas.
WhatsApp.
Automação operacional.
Aplicativo mobile.
Analytics avançado.
Inteligência artificial.

Essas possibilidades não devem gerar complexidade antecipada.

A arquitetura deve apenas evitar que a V1 bloqueie essas evoluções.

35. Pagamentos White Label no futuro

A visão futura de pagamentos é permitir que a plataforma possua uma camada própria de pagamentos conectada a parceiros de infraestrutura.

Conceitualmente:

Plataforma
    ↓
Payment Layer
    ↓
Parceiro White Label
    ↓
SmartPOS / Terminal
    ↓
Processamento do pagamento

O parceiro será responsável pela infraestrutura de processamento conforme o contrato e modelo comercial adotado.

A plataforma poderá futuramente disponibilizar terminais com sua própria marca, desde que exista suporte técnico, comercial e regulatório do parceiro escolhido.

A personalização física do equipamento não deve ser presumida apenas pela existência de uma solução White Label.

36. Futuras integrações automotivas

A arquitetura deve permitir que funcionalidades futuras relacionadas ao veículo sejam adicionadas sem alterar o núcleo existente de forma desnecessária.

Exemplos:

Leitura de placa.
Histórico do veículo.
Manutenção.
Pedágios.
Multas.
Estacionamento.
Mensalistas.

Essas integrações devem ser adicionadas somente quando houver definição concreta do fornecedor, API ou tecnologia utilizada.

37. Anti-patterns

Evitar:

Microserviços prematuros.
Banco sem isolamento entre empresas.
Regras importantes somente no frontend.
Secrets no código.
Dependência direta de um único provedor de pagamento.
Bibliotecas desnecessárias.
Abstrações prematuras.
Refatorações sem necessidade.
Alterações de banco sem migration.
Código duplicado sem motivo.
Sistemas genéricos criados para problemas que ainda não existem.
38. Critérios para decisões arquiteturais

Antes de introduzir uma nova tecnologia, serviço ou camada, avaliar:

Resolve um problema real?
É necessário agora?
O stack atual já resolve?
A complexidade adicionada é justificável?
Afeta segurança?
Afeta isolamento entre empresas?
Afeta integridade dos dados?
Facilita evolução futura sem criar complexidade desnecessária?

Se a resposta não justificar a mudança, manter a solução mais simples.

39. Prioridades

Em caso de conflito entre objetivos técnicos, priorizar:

Segurança.
Integridade dos dados.
Clareza.
Manutenibilidade.
Simplicidade.
Performance.
Escalabilidade.
Conveniência.
40. Princípio final

A arquitetura deve ser:

Simples.
Segura.
Modular.
Profissional.
Multiempresa.
Preparada para crescer.
Aberta a integrações.

A primeira versão não precisa conter toda a visão futura.

Ela precisa criar uma base sólida que permita chegar até ela sem precisar reconstruir o produto.

Código é um meio para alcançar esse objetivo. Não é o objetivo por si só.