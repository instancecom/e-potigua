# DATABASE.md

## 1. Objetivo

O banco de dados representa a verdade do negócio.

Ele deve armazenar as informações necessárias para:

- administrar empresas e unidades;
- controlar funcionários e permissões;
- cadastrar clientes e veículos;
- cadastrar serviços e preços;
- controlar agendamentos;
- controlar a operação dos serviços;
- registrar pagamentos;
- controlar o financeiro;
- controlar fidelidade;
- controlar estoque e solicitações;
- suportar integrações externas;
- manter histórico suficiente para auditoria e evolução do sistema.

O banco será construído sobre PostgreSQL, utilizando Supabase.

A estrutura deve ser simples, relacional, consistente e preparada para evolução.

---

## 2. Princípios

### 2.1 Multi-tenant desde o início

O sistema é SaaS multiempresa.

Uma empresa nunca pode acessar dados pertencentes a outra empresa.

Os dados devem possuir relação clara com a empresa responsável.

O isolamento entre empresas deve ser garantido no banco por meio de Row Level Security (RLS), além das regras aplicadas pela aplicação.

O frontend nunca deve ser considerado uma camada de segurança.

### 2.2 O banco representa o negócio

O banco deve armazenar fatos reais do sistema.

Não devem ser criadas estruturas apenas porque podem ser úteis no futuro.

Novas estruturas devem surgir quando houver uma necessidade real do produto.

### 2.3 Histórico é importante

Informações que podem mudar ao longo do tempo devem preservar o valor utilizado em uma operação quando isso for necessário.

Exemplo:

Se um serviço custava R$ 50 quando foi realizado e posteriormente passou a custar R$ 60, o atendimento antigo deve continuar registrando o valor de R$ 50.

O histórico financeiro não deve depender do valor atual cadastrado.

### 2.4 Integridade no banco

Sempre que possível, regras fundamentais devem ser garantidas pelo PostgreSQL.

Exemplos:

- foreign keys;
- unique constraints;
- not null;
- check constraints;
- índices;
- relacionamentos válidos;
- transações para operações que precisam ser atômicas.

A aplicação não deve ser a única responsável por manter a integridade dos dados.

---

## 3. Estrutura principal

A estrutura conceitual do sistema é:

Usuário → Empresa → Unidade → Funcionários

Empresa → Clientes → Veículos

Empresa → Serviços → Preços por tipo de veículo

Cliente + Veículo + Unidade + Serviços → Agendamento

Agendamento ou atendimento presencial → Atendimento

Atendimento → Pagamento → Transação de pagamento

Empresa → Financeiro

Cliente → Fidelidade

Empresa → Estoque

Essa estrutura representa o domínio principal sem criar dependências desnecessárias.

---

## 4. Autenticação e usuários

A autenticação será realizada pelo Supabase Auth.

O usuário autenticado não deve ser confundido automaticamente com:

- funcionário;
- cliente;
- proprietário da empresa.

Esses são papéis de negócio relacionados ao usuário autenticado.

O banco deve permitir que:

- um usuário administrativo tenha acesso à empresa;
- um funcionário esteja associado a uma empresa;
- um cliente possua uma conta;
- clientes também possam existir sem conta, quando necessário para operações presenciais.

As informações de autenticação devem permanecer sob responsabilidade do Supabase Auth sempre que possível.

---

## 5. Empresas

A empresa representa o negócio que utiliza o SaaS.

Uma empresa pode possuir múltiplas unidades.

A empresa é a principal referência de isolamento dos dados.

Conceitualmente:

Empresa
- Unidade 1
- Unidade 2
- Unidade N

Os dados pertencentes diretamente à empresa devem possuir uma referência clara para ela.

---

## 6. Unidades

Uma empresa pode possuir uma ou várias unidades.

Cada unidade representa um local físico de operação.

A unidade deve possuir informações necessárias para:

- identificação;
- endereço;
- funcionamento;
- capacidade operacional;
- funcionários vinculados;
- agendamentos;
- atendimentos.

A capacidade inicial da unidade está relacionada à quantidade de lavadores disponíveis.

A forma exata de cálculo da capacidade pode evoluir após a validação do produto.

Não criar estruturas complexas de capacidade antes dessa necessidade existir.

---

## 7. Funcionários

Funcionários pertencem a uma empresa e possuem uma unidade principal.

Um funcionário pode ser temporariamente transferido para outra unidade.

O banco deve conseguir representar:

- funcionário;
- empresa;
- unidade principal;
- transferências temporárias.

A transferência temporária deve preservar histórico suficiente para saber:

- qual funcionário foi transferido;
- para qual unidade;
- quando começou;
- quando terminou.

Permissões e autorização devem ser tratadas em conjunto com a arquitetura de segurança.

---

## 8. Clientes

Clientes pertencem a uma empresa.

Um cliente pode possuir uma conta no sistema ou existir apenas como cadastro operacional.

Isso é importante porque um cliente pode chegar presencialmente sem possuir conta.

O cadastro deve permitir associar:

- dados do cliente;
- conta de usuário, quando existir;
- veículos;
- histórico de atendimentos;
- agendamentos;
- pagamentos;
- fidelidade.

---

## 9. Veículos

Um cliente pode possuir vários veículos.

Cada veículo deve armazenar inicialmente:

- placa;
- marca;
- modelo;
- cor;
- tipo de veículo.

Tipos iniciais:

- hatch;
- sedan;
- SUV;
- caminhonete/pickup;
- caminhão;
- moto.

O veículo deve permanecer associado ao cliente responsável.

A estrutura deve permitir adicionar novos tipos futuramente sem alterar desnecessariamente o restante do modelo.

---

## 10. Serviços

A empresa cadastra os serviços oferecidos.

Um serviço possui, conceitualmente:

- nome;
- duração estimada;
- disponibilidade;
- preços;
- tipos de veículo compatíveis.

O preço pode variar conforme o tipo de veículo.

Exemplo:

- Hatch → preço A
- Sedan → preço B
- SUV → preço C

O valor efetivamente utilizado em um agendamento ou atendimento deve ser preservado.

Alterar o preço atual do serviço não pode alterar registros históricos.

---

## 11. Agendamentos

O agendamento representa uma reserva futura de atendimento.

Um agendamento deve estar relacionado a:

- cliente;
- veículo;
- unidade;
- data e horário;
- um ou mais serviços;
- valores aplicáveis no momento do agendamento;
- duração estimada;
- status.

O banco deve permitir múltiplos serviços no mesmo agendamento.

A disponibilidade deve considerar:

- horário de funcionamento da unidade;
- duração dos serviços;
- capacidade operacional;
- outros agendamentos existentes.

A regra de disponibilidade pertence à lógica do sistema, enquanto o banco deve garantir a integridade necessária dos registros.

---

## 12. Reagendamento

O cliente ou funcionário responsável pelo agendamento pode alterar data e horário quando permitido.

O proprietário também pode realizar essa alteração.

Quando um agendamento é movido:

- o horário antigo é liberado;
- o novo horário passa a ser ocupado.

O banco deve preservar informações suficientes para evitar inconsistências e, quando necessário, manter histórico da alteração.

---

## 13. Atendimento e operação

Agendamento e atendimento são conceitos diferentes.

Um agendamento representa uma reserva.

Um atendimento representa a execução do serviço.

Isso permite que o sistema também registre atendimentos presenciais sem agendamento.

Fluxo conceitual:

Cliente chega → Atendimento é criado → Veículo entra na operação → Serviço é executado → Pagamento

O atendimento deve possuir referência para:

- empresa;
- unidade;
- cliente, quando identificado;
- veículo;
- funcionário responsável, quando aplicável;
- agendamento, quando existir;
- serviços realizados;
- pagamento;
- status operacional.

---

## 14. Status do atendimento

Os estados iniciais são:

- Na fila
- Lavando
- Secando
- Finalizado

O banco deve armazenar o estado atual do atendimento.

Quando houver necessidade de histórico operacional mais detalhado, poderá existir uma estrutura específica para registrar mudanças de status.

Não criar histórico complexo antes de existir uma necessidade real.

---

## 15. Serviços adicionais

Durante um atendimento, o funcionário pode adicionar serviços.

O valor total do atendimento deve ser atualizado de acordo com os serviços adicionados.

Cada serviço realizado deve preservar o valor aplicado naquele momento.

Isso evita que alterações futuras no cadastro de serviços alterem atendimentos antigos.

Não definir regras de remoção ou edição de serviços adicionais que ainda não foram aprovadas pelo produto.

---

## 16. Pagamentos

Pagamento é separado de processamento de pagamento.

O SaaS registra o resultado financeiro da operação.

O processamento pode ocorrer:

- Pix;
- dinheiro;
- débito;
- crédito;
- terminal integrado.

O banco deve conseguir representar tanto pagamentos registrados manualmente quanto pagamentos originados de uma integração externa.

---

## 17. Integração de pagamentos

A primeira integração de pagamentos será com Mercado Pago.

O Mercado Pago é responsável pelo processamento do pagamento.

O SaaS não deve se tornar dependente diretamente da implementação do Mercado Pago.

A arquitetura conceitual é:

Atendimento → Pagamento → Payment Layer → Mercado Pago Connector → Terminal Mercado Pago

O banco deve separar:

- o pagamento dentro do negócio;
- a tentativa ou transação de pagamento;
- o provedor utilizado;
- a referência externa fornecida pelo provedor;
- o estado da transação.

Isso permitirá adicionar outros provedores futuramente sem alterar o conceito central de pagamento.

---

## 18. Transações de pagamento

Uma transação de pagamento deve permitir registrar, quando aplicável:

- pagamento relacionado;
- provedor;
- referência externa;
- terminal utilizado, quando aplicável;
- valor;
- método;
- status;
- data de criação;
- data de processamento;
- informações necessárias para reconciliação;
- referência de eventos externos.

Estados internos podem incluir:

- Pendente;
- Processando;
- Aprovado;
- Recusado;
- Cancelado;
- Erro.

Os estados definitivos devem respeitar as capacidades do provedor utilizado.

Uma mesma operação pode possuir mais de uma tentativa de pagamento.

Por isso, pagamento e tentativa/transação não devem necessariamente ser a mesma entidade.

---

## 19. Mercado Pago

A integração com Mercado Pago deve permitir identificar externamente:

- a integração configurada;
- o terminal utilizado, quando aplicável;
- a transação criada;
- o resultado recebido.

Identificadores externos necessários para reconciliação podem ser armazenados.

Credenciais e segredos não devem ser armazenados de forma insegura no banco.

Dados sensíveis de cartão, como número completo do cartão ou CVV, não devem ser armazenados pelo sistema.

O banco deve guardar somente os dados necessários para o funcionamento, histórico e conciliação da integração.

---

## 20. Webhooks e eventos externos

Integrações de pagamento podem enviar eventos para o sistema.

O banco deve permitir lidar com:

- eventos duplicados;
- eventos recebidos fora de ordem;
- reprocessamento;
- falhas;
- inconsistências;
- confirmação posterior de uma transação.

Eventos externos importantes devem possuir identificadores que permitam aplicar processamento idempotente.

O mesmo evento não deve gerar duas vezes o mesmo efeito financeiro.

---

## 21. Pagamentos de agendamento

Quando um atendimento possui agendamento e o valor já está determinado, o funcionário não precisa redigitar o valor.

Fluxo:

Pagou → Método de pagamento → Registro do pagamento

O valor deve vir do atendimento ou dos serviços registrados nele.

---

## 22. Pagamentos presenciais sem agendamento

Quando não existe agendamento, o funcionário pode informar manualmente o valor cobrado.

Esse valor deve ser registrado no atendimento e no pagamento.

O histórico financeiro não deve depender do preço atual cadastrado no serviço.

---

## 23. Financeiro

O sistema deve registrar entradas e saídas financeiras.

Entradas podem ser originadas de pagamentos de atendimentos.

Saídas podem ser registradas manualmente pelo responsável.

Uma saída deve possuir, conceitualmente:

- valor;
- motivo;
- data;
- empresa;
- unidade, quando aplicável;
- responsável pelo registro.

O sistema deve permitir visualizar:

- faturamento diário;
- faturamento semanal;
- faturamento mensal;
- valores por método de pagamento.

Os valores históricos devem permanecer preservados para manter a verdade financeira da operação.

---

## 24. Fidelidade

O programa de fidelidade possui exatamente 8 carimbos.

Cada cliente elegível possui seu progresso de fidelidade.

Após um serviço pago, um funcionário pode registrar um carimbo.

Quando chegar a 8 de 8, o cliente pode resgatar a recompensa.

A recompensa pode ser:

- valor em dinheiro;
- serviço.

O resgate gera um código único.

Após a confirmação da entrega:

- o código é invalidado;
- o resgate é concluído;
- os carimbos são zerados.

O código não pode ser reutilizado.

O banco deve preservar histórico dos resgates.

---

## 25. Estoque

O sistema deve permitir que a empresa controle produtos utilizados na operação.

O proprietário pode administrar o estoque.

Funcionários podem solicitar produtos quando identificarem falta ou necessidade.

A empresa deve conseguir identificar:

- produto;
- quantidade disponível;
- unidade;
- solicitações;
- responsável;
- status da solicitação.

As regras detalhadas de movimentação, consumo automático e alerta de estoque mínimo ainda serão definidas conforme a validação do produto.

Não criar complexidade de estoque antes dessas regras serem aprovadas.

---

## 26. Datas e horários

Registros que representam eventos de negócio devem possuir informações temporais adequadas.

Exemplos:

- criação;
- atualização;
- agendamento;
- início do atendimento;
- finalização;
- pagamento;
- resgate;
- transferências.

O sistema deve tratar corretamente o fuso horário da operação.

Datas de negócio não devem depender do horário do navegador do usuário.

---

## 27. Identificadores

Entidades principais devem possuir identificadores únicos.

Relacionamentos devem utilizar foreign keys.

Identificadores externos de integrações devem ser armazenados separadamente dos identificadores internos.

O identificador interno do sistema não deve depender do identificador fornecido por um terceiro.

---

## 28. Exclusão e histórico

Dados que possuem importância histórica ou financeira não devem ser simplesmente apagados.

Quando necessário, deve-se utilizar:

- status;
- arquivamento;
- soft delete;
- histórico.

A estratégia deve ser definida conforme o tipo de entidade.

Registros financeiros e transações de pagamento devem preservar histórico.

---

## 29. Índices

Índices devem existir para consultas relevantes do sistema.

Exemplos de informações que provavelmente precisarão de índices:

- empresa;
- unidade;
- cliente;
- placa;
- agendamentos por data;
- atendimentos por status;
- pagamentos por período;
- transações externas;
- fidelidade;
- estoque.

Índices não devem ser criados indiscriminadamente.

A necessidade deve ser avaliada conforme consultas reais e volume de dados.

---

## 30. Constraints

O banco deve utilizar constraints sempre que uma regra puder ser garantida diretamente pelo PostgreSQL.

Exemplos:

- valores monetários não negativos quando aplicável;
- relações obrigatórias;
- identificadores únicos;
- estados válidos;
- referências existentes;
- quantidades válidas.

Regras de negócio complexas continuam sendo responsabilidade da aplicação quando não forem adequadas para uma constraint.

---

## 31. Row Level Security

As tabelas que armazenam dados de empresas devem possuir políticas de Row Level Security.

A regra fundamental é:

Usuário autenticado → Empresa permitida → Dados daquela empresa

Um usuário nunca deve conseguir consultar ou alterar dados de outra empresa simplesmente manipulando identificadores enviados pelo frontend.

RLS é parte obrigatória da arquitetura.

---

## 32. Migrations

Alterações estruturais no banco devem ser realizadas por migrations.

Não alterar manualmente o banco de produção sem que a alteração esteja representada na evolução do projeto.

Cada mudança estrutural deve ser:

- reproduzível;
- versionável;
- revisável;
- segura para os dados existentes.

---

## 33. Seeds

Seeds podem ser utilizados para dados necessários ao desenvolvimento e testes.

Exemplos:

- tipos de veículo;
- dados de demonstração;
- dados necessários para testes automatizados.

Dados reais de clientes ou empresas não devem ser utilizados como seed de desenvolvimento sem necessidade e controle adequado.

---

## 34. Evolução do banco

O banco deve evoluir junto com o produto.

Antes de criar uma nova tabela ou relacionamento, verificar:

1. Qual problema real isso resolve?
2. Essa informação já pode ser representada por uma entidade existente?
3. Existe uma regra de negócio aprovada que exige essa estrutura?
4. A estrutura mantém o isolamento entre empresas?
5. Existe necessidade de preservar histórico?

Evitar tabelas, campos e abstrações criadas apenas para possíveis funcionalidades futuras.

---

## 35. Funcionalidades futuras

O banco deve poder evoluir para suportar funcionalidades como:

- reconhecimento automático de placas;
- entrada e saída de veículos;
- estacionamento;
- clientes mensais;
- leitura automática de tempo;
- novos provedores de pagamento;
- terminais próprios da plataforma;
- integrações automotivas;
- manutenção de veículos;
- histórico do veículo;
- pedágios;
- multas;
- aplicativos;
- automações.

Essas possibilidades não devem ser implementadas antecipadamente apenas para "deixar preparado".

A arquitetura deve permitir evolução sem transformar o banco inicial em uma estrutura excessivamente complexa.

---

## 36. Regra principal

> O banco deve guardar a verdade do negócio, não uma coleção de suposições sobre o futuro.

A prioridade é:

1. Integridade dos dados
2. Isolamento entre empresas
3. Clareza
4. Histórico confiável
5. Segurança
6. Simplicidade
7. Evolução controlada
8. Performance

O banco deve ser simples o suficiente para ser compreendido e sólido o suficiente para sustentar a operação real.