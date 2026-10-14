# SECURITY.md

## 1. Objetivo

Este documento define as regras de segurança do sistema.

A segurança deve ser tratada como parte da arquitetura do produto desde o início, e não como uma camada adicionada posteriormente.

O sistema deve proteger:

- empresas;
- unidades;
- funcionários;
- clientes;
- veículos;
- agendamentos;
- atendimentos;
- pagamentos;
- informações financeiras;
- dados de fidelidade;
- estoque;
- integrações;
- credenciais;
- dados pessoais.

A segurança deve seguir princípios de Security by Design, menor privilégio, defesa em profundidade e negação por padrão.

---

## 2. Regra fundamental

> O frontend controla o que o usuário vê. O backend controla o que o usuário pode fazer.

Nenhuma regra de segurança pode depender exclusivamente do frontend.

Esconder uma tela, botão ou ação não significa impedir sua execução.

Todas as operações sensíveis devem ser validadas no backend e, quando aplicável, também pelo banco de dados.

Mesmo que um usuário tente acessar diretamente uma rota, endpoint ou API, a operação deve ser recusada caso ele não possua autorização.

---

## 3. Segurança em camadas

A segurança do sistema deve existir em múltiplas camadas:

1. autenticação;
2. autorização;
3. isolamento multi-tenant;
4. validação no backend;
5. Row Level Security;
6. validação de entrada;
7. proteção das APIs;
8. proteção das integrações;
9. proteção de secrets;
10. logs e auditoria;
11. monitoramento;
12. backup e recuperação;
13. segurança das dependências;
14. segurança no processo de desenvolvimento.

Nenhuma camada deve ser considerada suficiente isoladamente.

---

# 4. Autenticação

A autenticação será realizada utilizando Supabase Auth.

O sistema poderá utilizar:

- email e senha;
- Google OAuth.

A autenticação deve garantir que o sistema consiga identificar de forma confiável o usuário que está realizando uma operação.

A aplicação não deve confiar em identificadores enviados pelo frontend para determinar a identidade do usuário.

A identidade deve ser obtida a partir da sessão autenticada.

---

## 4.1 Sessões

Sessões devem ser administradas pelo mecanismo de autenticação utilizado.

Tokens:

- não devem ser expostos desnecessariamente;
- não devem ser armazenados em locais inseguros;
- não devem aparecer em logs;
- não devem ser enviados para serviços que não necessitam deles.

Operações administrativas e sensíveis devem exigir uma sessão válida.

---

## 4.2 Recuperação de conta

Fluxos de recuperação de senha devem:

- utilizar mecanismos seguros;
- não revelar informações desnecessárias sobre a existência de contas;
- utilizar tokens temporários;
- invalidar tokens quando aplicável.

---

# 5. Autorização

Autenticação responde:

> Quem é o usuário?

Autorização responde:

> O que esse usuário pode fazer?

As duas responsabilidades devem permanecer separadas.

Um usuário autenticado não possui automaticamente acesso a todos os recursos.

---

## 5.1 Autorização no backend

Toda operação protegida deve ser autorizada no backend.

Isso inclui:

- acessar dados;
- criar registros;
- editar registros;
- excluir registros;
- alterar status;
- alterar preços;
- alterar permissões;
- cadastrar funcionários;
- transferir funcionários;
- alterar configurações;
- registrar pagamentos;
- cancelar pagamentos;
- registrar saídas financeiras;
- administrar fidelidade;
- administrar estoque;
- configurar integrações;
- acessar informações financeiras.

O backend deve verificar:

1. usuário autenticado;
2. empresa à qual o usuário pertence;
3. unidade envolvida;
4. papel do usuário;
5. permissão necessária;
6. recurso que está sendo acessado;
7. relação do recurso com a empresa e unidade permitidas.

---

## 5.2 Frontend não é camada de segurança

O frontend pode:

- esconder botões;
- esconder menus;
- esconder telas;
- desabilitar ações;
- adaptar a experiência ao perfil do usuário.

Porém, isso existe para melhorar a experiência.

Não é uma medida de segurança.

Exemplo:

Se um funcionário não possui permissão para excluir um cliente, o frontend pode esconder o botão "Excluir".

Porém, mesmo que o funcionário tente chamar diretamente a API de exclusão, o backend deve rejeitar a operação.

---

## 5.3 Autorização por recurso

Não basta verificar apenas se o usuário possui determinada permissão.

Também deve ser verificado se o recurso pertence ao contexto ao qual ele possui acesso.

Exemplo:

Um funcionário da Unidade A não deve conseguir acessar um atendimento da Unidade B simplesmente alterando o ID enviado na requisição.

A autorização deve considerar:

Usuário → Empresa → Unidade → Recurso → Ação

---

# 6. Multi-tenant

O sistema é multiempresa desde o início.

Uma empresa nunca pode acessar dados pertencentes a outra empresa.

O isolamento deve existir no banco e na aplicação.

Nunca confiar apenas em filtros enviados pelo frontend.

Exemplo:

Uma requisição contendo um determinado `company_id` não deve ser considerada prova de que o usuário possui acesso àquela empresa.

A empresa permitida deve ser determinada a partir da sessão e das relações de autorização.

---

# 7. Row Level Security

As tabelas que armazenam dados de empresas devem utilizar Row Level Security (RLS).

RLS é uma camada obrigatória de proteção.

O objetivo é impedir que uma falha na aplicação resulte automaticamente em acesso aos dados de outra empresa.

O modelo esperado é:

Usuário autenticado
→ Empresa autorizada
→ Unidade autorizada
→ Registro permitido

As policies devem ser projetadas para respeitar o modelo de autorização do sistema.

Não criar policies permissivas apenas para facilitar o desenvolvimento.

---

# 8. Segurança por unidade

A empresa pode possuir múltiplas unidades.

Quando uma operação estiver relacionada a uma unidade, o sistema deve verificar se o usuário possui acesso àquela unidade.

Funcionários podem possuir:

- uma unidade principal;
- acesso temporário a outra unidade quando houver transferência.

O acesso temporário deve possuir período válido.

Após o término da transferência, o acesso correspondente deve deixar de existir.

---

# 9. Princípio do menor privilégio

Cada usuário deve possuir somente os acessos necessários para executar suas funções.

O sistema não deve conceder permissões administrativas por padrão.

Permissões devem ser atribuídas explicitamente.

Operações mais sensíveis devem exigir níveis de autorização maiores.

---

# 10. Negação por padrão

Quando uma permissão não estiver explicitamente concedida, o sistema deve negar a operação.

Não utilizar lógica do tipo:

"Se não estiver proibido, pode."

A regra deve ser:

"Se não estiver permitido, não pode."

---

# 11. OWASP Top 10

O projeto deve considerar as categorias do OWASP Top 10 2025 como referência de segurança.

As principais categorias devem ser tratadas da seguinte forma.

## 11.1 Broken Access Control

Prevenir acesso indevido a:

- empresas;
- unidades;
- clientes;
- veículos;
- atendimentos;
- pagamentos;
- dados financeiros;
- configurações.

Autorização deve ocorrer no backend e no banco quando aplicável.

---

## 11.2 Security Misconfiguration

Evitar:

- configurações inseguras;
- endpoints administrativos expostos;
- secrets no código;
- permissões excessivas;
- configurações padrão inseguras;
- ambientes de desenvolvimento conectados indevidamente à produção.

---

## 11.3 Software Supply Chain Failures

Dependências externas devem ser tratadas como parte da superfície de ataque.

Devem existir práticas para:

- manter dependências atualizadas;
- utilizar lockfile;
- revisar novas dependências;
- evitar bibliotecas desnecessárias;
- verificar vulnerabilidades conhecidas;
- controlar scripts de terceiros.

---

## 11.4 Cryptographic Failures

Dados sensíveis devem ser protegidos adequadamente.

Nunca armazenar:

- senhas em texto puro;
- CVV;
- número completo de cartão;
- secrets em código;
- tokens em logs.

Utilizar mecanismos seguros de criptografia e armazenamento fornecidos pelas plataformas utilizadas.

---

## 11.5 Injection

Entradas do usuário e dados externos nunca devem ser considerados confiáveis.

Validar e tratar adequadamente:

- parâmetros;
- formulários;
- filtros;
- buscas;
- URLs;
- headers;
- payloads;
- dados de APIs externas.

Utilizar mecanismos seguros de acesso ao banco.

Nunca construir SQL inseguro concatenando entrada do usuário.

---

## 11.6 Insecure Design

Funcionalidades sensíveis devem ser analisadas antes de serem implementadas.

Perguntas importantes:

- O que acontece se o usuário tentar abusar desse fluxo?
- O usuário pode executar essa ação diretamente pela API?
- Pode acessar outro tenant?
- Pode repetir a operação?
- Pode manipular valores?
- Pode alterar IDs?
- Pode executar a operação fora da ordem esperada?

---

## 11.7 Authentication Failures

Proteger:

- login;
- recuperação de conta;
- sessões;
- OAuth;
- troca de credenciais;
- operações sensíveis.

Evitar exposição desnecessária de informações sobre contas.

---

## 11.8 Software and Data Integrity Failures

O sistema deve proteger a integridade de:

- código;
- migrations;
- dados;
- pagamentos;
- eventos externos;
- webhooks;
- dependências.

Alterações estruturais devem passar por migrations versionadas.

---

## 11.9 Logging and Alerting Failures

Eventos importantes devem ser registrados.

Exemplos:

- login;
- alterações de permissões;
- alterações financeiras;
- pagamentos;
- cancelamentos;
- configurações;
- integrações;
- ações administrativas;
- eventos de segurança.

Logs nunca devem conter:

- senhas;
- tokens;
- secrets;
- CVV;
- dados sensíveis desnecessários.

---

## 11.10 Mishandling of Exceptional Conditions

Erros e situações inesperadas devem ser tratados de forma segura.

O sistema não deve:

- expor stack traces para usuários;
- revelar detalhes internos;
- assumir que uma operação foi concluída sem confirmação;
- criar registros duplicados após uma falha;
- deixar estados financeiros inconsistentes.

---

# 12. OWASP API Security

Como o sistema depende fortemente de APIs, também devem ser consideradas as recomendações do OWASP API Security Top 10.

Particular atenção deve ser dada a:

- Broken Object Level Authorization;
- Broken Authentication;
- Broken Object Property Level Authorization;
- Unrestricted Resource Consumption;
- Broken Function Level Authorization;
- Unrestricted Access to Sensitive Business Flows;
- Server Side Request Forgery;
- Security Misconfiguration;
- Improper Inventory Management;
- Unsafe Consumption of APIs.

---

# 13. APIs

Todas as APIs devem:

- autenticar quando necessário;
- autorizar a operação;
- validar entrada;
- validar o tenant;
- validar a unidade;
- validar permissões;
- limitar payloads;
- tratar erros;
- evitar exposição excessiva de dados;
- evitar informações sensíveis nas respostas.

Endpoints administrativos não devem ser protegidos apenas por rotas privadas no frontend.

---

# 14. Rate limiting

Operações que possam sofrer abuso devem possuir proteção contra excesso de requisições.

Especialmente:

- login;
- recuperação de senha;
- APIs públicas;
- criação de pagamentos;
- webhooks;
- operações de alto custo;
- fluxos sensíveis.

Os limites devem ser definidos conforme o comportamento real do sistema.

---

# 15. Validação de entrada

Toda entrada externa deve ser considerada não confiável.

Isso inclui:

- dados de formulários;
- parâmetros de URL;
- headers;
- arquivos;
- dados de APIs;
- webhooks;
- integrações;
- dados enviados por clientes.

A validação deve ocorrer no backend.

O frontend pode realizar validação para melhorar a experiência, mas não substitui a validação do backend.

---

# 16. Proteção contra IDOR/BOLA

Nunca assumir que conhecer um ID significa possuir autorização.

Exemplo:

Um funcionário não deve conseguir acessar outro cliente apenas alterando:

`customer_id=123`

para:

`customer_id=124`

O backend deve verificar se o recurso pertence ao contexto autorizado.

Esse princípio vale para todas as entidades.

---

# 17. Secrets e credenciais

Secrets nunca devem ser armazenados:

- no código;
- no Git;
- em arquivos públicos;
- no frontend;
- em logs;
- em respostas de API.

Devem ser utilizados mecanismos apropriados de variáveis de ambiente e gerenciamento seguro de secrets.

Exemplos:

- Supabase;
- Mercado Pago;
- Resend;
- Cakto;
- OAuth;
- futuras integrações.

Chaves privadas nunca devem ser enviadas ao navegador.

---

# 18. Pagamentos

Pagamentos possuem requisitos adicionais de segurança.

O sistema deve separar:

Pagamento no domínio do SaaS
→ processamento pelo provedor
→ resultado recebido
→ registro no sistema

O SaaS não deve armazenar dados completos de cartão.

Não armazenar:

- PAN completo;
- CVV;
- senha do cartão;
- dados equivalentes que não sejam necessários.

---

# 19. Mercado Pago

A integração com Mercado Pago deve ser tratada como integração externa não confiável.

O sistema deve validar:

- autenticidade dos eventos;
- origem;
- identificadores;
- correspondência da transação;
- valor;
- status;
- contexto da empresa;
- idempotência.

Nunca considerar um pagamento aprovado apenas porque o frontend recebeu uma resposta positiva.

A confirmação deve vir de uma fonte confiável do fluxo de integração.

---

# 20. Idempotência

Operações financeiras e integrações externas devem ser protegidas contra duplicidade.

Exemplo:

Se um webhook for recebido duas vezes, ele não pode gerar dois pagamentos.

Se uma operação for repetida após timeout, o sistema deve conseguir identificar se ela já foi processada.

---

# 21. Webhooks

Webhooks devem:

- validar autenticidade;
- validar dados;
- validar referências;
- impedir processamento duplicado;
- registrar eventos importantes;
- lidar com reprocessamento;
- não confiar cegamente no payload.

Um webhook não deve possuir permissão para executar qualquer operação além do necessário.

---

# 22. Integrações externas

Todas as integrações devem ser consideradas fontes externas não confiáveis.

Isso inclui:

- Mercado Pago;
- Resend;
- Cakto;
- Google;
- Supabase;
- futuras APIs automotivas;
- futuros provedores de pagamento.

Dados recebidos de terceiros devem passar por validação antes de alterar o estado interno do sistema.

---

# 23. Proteção contra SSRF

Caso o sistema futuramente permita que usuários forneçam URLs para processamento, o backend deve impedir requisições arbitrárias a recursos internos.

URLs externas devem ser validadas antes de serem acessadas pelo servidor.

---

# 24. Uploads e arquivos

Arquivos enviados por usuários devem ser tratados como conteúdo não confiável.

Devem existir controles para:

- tipo de arquivo;
- tamanho;
- armazenamento;
- acesso;
- nomes;
- conteúdo potencialmente malicioso.

Arquivos não devem ser disponibilizados publicamente sem necessidade.

---

# 25. Logs e auditoria

O sistema deve registrar eventos importantes para investigação e auditoria.

Exemplos:

- login;
- alteração de permissões;
- transferência de funcionário;
- alteração de preços;
- alteração financeira;
- pagamentos;
- cancelamentos;
- resgates;
- alterações de configurações;
- eventos de segurança;
- eventos de integração.

Logs devem conter informações suficientes para investigação, mas não dados sensíveis desnecessários.

---

# 26. Auditoria de ações críticas

Operações críticas devem permitir identificar:

- quem executou;
- quando executou;
- qual recurso foi alterado;
- qual foi a ação;
- resultado da operação.

Isso é especialmente importante para:

- financeiro;
- pagamentos;
- permissões;
- configurações;
- usuários;
- fidelidade.

---

# 27. Monitoramento

O sistema deve permitir identificar comportamentos anormais.

Exemplos:

- múltiplas tentativas de login;
- grande volume de requisições;
- tentativas repetidas de acesso negado;
- alterações financeiras incomuns;
- falhas repetidas de pagamento;
- falhas de webhook;
- comportamento anormal de APIs.

Alertas devem ser adicionados conforme a necessidade operacional.

---

# 28. LGPD

O sistema deve ser desenvolvido considerando a Lei Geral de Proteção de Dados Pessoais (LGPD).

A proteção deve considerar princípios como:

- finalidade;
- adequação;
- necessidade;
- livre acesso;
- qualidade dos dados;
- transparência;
- segurança;
- prevenção;
- não discriminação;
- responsabilização.

A implementação técnica deve apoiar as obrigações relacionadas ao tratamento de dados pessoais.

Este documento não substitui orientação jurídica, política de privacidade, contratos ou documentos legais necessários.

---

# 29. Dados pessoais

O sistema poderá tratar dados pessoais de:

- clientes;
- funcionários;
- responsáveis administrativos;
- usuários.

Devem ser coletados somente os dados necessários para as finalidades do produto.

Evitar armazenar informações pessoais que não tenham finalidade definida.

---

# 30. Minimização de dados

Antes de adicionar um novo campo relacionado a uma pessoa, deve-se perguntar:

1. Precisamos realmente desse dado?
2. Qual é a finalidade?
3. Quem precisa acessá-lo?
4. Por quanto tempo precisamos mantê-lo?
5. O dado aumenta algum risco de segurança?

Se não houver uma finalidade clara, o dado não deve ser coletado.

---

# 31. Direitos dos titulares

A arquitetura deve permitir atender, quando aplicável, solicitações relacionadas aos direitos previstos na LGPD.

Exemplos:

- acesso;
- correção;
- confirmação de tratamento;
- informação;
- eliminação quando aplicável;
- portabilidade quando aplicável;
- oposição quando aplicável;
- revogação de consentimento quando aplicável.

Os direitos devem ser tratados considerando as limitações legais aplicáveis a cada tipo de dado.

---

# 32. Retenção de dados

Dados não devem ser mantidos indefinidamente sem finalidade.

A política de retenção deve considerar:

- finalidade do dado;
- necessidade operacional;
- obrigações legais;
- histórico financeiro;
- auditoria;
- segurança;
- solicitações dos titulares.

Dados financeiros e registros necessários para cumprimento de obrigações legais podem precisar permanecer armazenados mesmo quando outros dados forem eliminados.

Os períodos específicos de retenção devem ser definidos conforme a necessidade do negócio e requisitos legais.

---

# 33. Eliminação de dados

Quando um dado puder ser eliminado, a exclusão deve considerar:

- relacionamentos existentes;
- obrigações legais;
- histórico financeiro;
- auditoria;
- integridade referencial;
- backups;
- necessidade de anonimização.

Não realizar exclusões destrutivas indiscriminadamente.

---

# 34. Privacidade desde a concepção

Novas funcionalidades que tratem dados pessoais devem considerar privacidade desde o início.

Antes de implementar uma funcionalidade que aumente significativamente o tratamento de dados, avaliar:

- quais dados serão coletados;
- finalidade;
- necessidade;
- riscos;
- quem terá acesso;
- tempo de retenção;
- possibilidade de minimização.

---

# 35. RIPD

Quando uma operação de tratamento puder apresentar riscos relevantes aos titulares, deve ser avaliada a necessidade de elaboração de Relatório de Impacto à Proteção de Dados Pessoais (RIPD).

O RIPD não deve ser tratado como requisito para todas as funcionalidades.

Sua necessidade deve ser avaliada conforme o risco e o contexto do tratamento.

---

# 36. Incidentes de segurança

O sistema deve possuir processo para responder a incidentes.

Exemplos:

- vazamento;
- acesso indevido;
- credencial comprometida;
- fraude;
- ataque;
- indisponibilidade;
- comprometimento de integração.

O processo deve contemplar:

1. identificação;
2. contenção;
3. investigação;
4. correção;
5. recuperação;
6. documentação;
7. comunicação quando aplicável.

Incidentes envolvendo dados pessoais devem ser avaliados conforme as obrigações da LGPD e orientações da ANPD.

---

# 37. Backup

Dados importantes devem possuir mecanismos de backup apropriados.

Backups devem ser protegidos contra:

- acesso não autorizado;
- alteração indevida;
- perda;
- exposição de dados pessoais.

O processo deve permitir recuperação dos dados.

Backups também devem ser considerados no planejamento de retenção e descarte.

---

# 38. Recuperação de desastre

O sistema deve possuir estratégia para recuperação após falhas graves.

Devem ser considerados futuramente:

- RPO;
- RTO;
- restauração do banco;
- indisponibilidade de serviços externos;
- perda de região;
- falhas de infraestrutura.

Os valores específicos devem ser definidos conforme a evolução do produto.

---

# 39. Segurança no desenvolvimento

O desenvolvimento deve seguir práticas de segurança desde o código.

Antes de considerar uma funcionalidade sensível concluída, avaliar:

- autenticação;
- autorização;
- RLS;
- validação de entrada;
- tratamento de erros;
- logs;
- secrets;
- exposição de dados;
- abuso do fluxo;
- testes.

---

# 40. Testes de segurança

Funcionalidades de autorização devem possuir testes específicos.

Exemplos:

- usuário sem permissão tenta executar a operação;
- funcionário tenta acessar outra unidade;
- usuário tenta acessar outra empresa;
- cliente tenta acessar dados de outro cliente;
- requisição altera um ID para tentar acessar outro recurso;
- webhook é enviado duas vezes;
- pagamento é processado novamente;
- usuário tenta executar operação diretamente pela API.

O objetivo é provar que a segurança funciona mesmo quando o frontend é ignorado.

---

# 41. Threat Modeling

Funcionalidades sensíveis devem passar por uma análise de ameaça antes ou durante sua implementação.

Perguntas principais:

- Quem pode abusar dessa funcionalidade?
- O que acontece se alguém manipular a requisição?
- O que acontece se o usuário trocar um ID?
- O que acontece se a operação for repetida?
- O que acontece se o provedor responder de forma inesperada?
- O que acontece se o usuário não tiver permissão?
- O que acontece se os dados recebidos forem maliciosos?

Quanto maior o impacto da funcionalidade, maior deve ser o nível de análise.

---

# 42. Dependências

Novas bibliotecas devem ser adicionadas somente quando realmente necessárias.

Antes de adicionar uma dependência, avaliar:

- manutenção;
- reputação;
- vulnerabilidades conhecidas;
- licença;
- quantidade de dependências transitivas;
- necessidade real.

Evitar dependências que resolvem problemas simples que poderiam ser tratados pelo próprio projeto.

---

# 43. Git e código

Nunca versionar:

- secrets;
- tokens;
- senhas;
- chaves privadas;
- credenciais;
- dados reais de clientes.

O repositório deve possuir mecanismos para reduzir o risco de secrets serem enviados acidentalmente.

---

# 44. Ambientes

Desenvolvimento, homologação e produção devem ser tratados como ambientes distintos.

Credenciais de produção não devem ser utilizadas desnecessariamente em desenvolvimento.

Dados reais de clientes não devem ser utilizados em desenvolvimento sem necessidade e controle adequado.

---

# 45. Segurança do frontend

O frontend deve:

- esconder ações que o usuário não pode executar;
- não expor secrets;
- não confiar em dados manipulados pelo cliente;
- tratar respostas de erro corretamente;
- evitar armazenamento inseguro de informações sensíveis.

Porém, nenhuma dessas medidas substitui a segurança do backend.

---

# 46. Segurança do backend

O backend é responsável por garantir:

- autenticação;
- autorização;
- isolamento multi-tenant;
- validação de entrada;
- regras de negócio;
- proteção das APIs;
- comunicação segura com serviços externos;
- tratamento seguro de erros;
- proteção de operações sensíveis.

---

# 47. Regra para telas e botões

Toda tela ou botão que representa uma ação protegida deve possuir uma permissão correspondente no backend.

Exemplo:

Botão "Excluir funcionário"

Frontend:
- verifica a permissão;
- mostra ou esconde o botão.

Backend:
- verifica novamente a permissão;
- verifica a empresa;
- verifica a unidade quando aplicável;
- verifica o funcionário;
- executa ou rejeita a operação.

Nunca considerar o botão escondido como mecanismo de segurança.

---

# 48. Regra para rotas

Uma rota protegida não pode ser considerada segura apenas porque não aparece no menu.

O acesso direto à rota deve passar pelas mesmas verificações de autorização.

O mesmo princípio vale para:

- páginas;
- Server Actions;
- Route Handlers;
- APIs;
- endpoints;
- operações administrativas.

---

# 49. Regra para IDs

Nunca confiar em IDs enviados pelo cliente como prova de autorização.

Todo ID recebido deve ser validado dentro do contexto do usuário.

Exemplo:

Cliente A não pode acessar o veículo do Cliente B simplesmente informando o ID do veículo B.

Funcionário da Unidade A não pode acessar atendimento da Unidade B simplesmente informando o ID do atendimento B.

---

# 50. Regra para dinheiro

Valores financeiros devem ser tratados com precisão.

Nunca confiar no valor calculado pelo frontend como fonte definitiva.

O backend deve determinar ou validar:

- valor do serviço;
- valor do atendimento;
- descontos quando existirem;
- valor do pagamento;
- valores financeiros.

Operações financeiras devem ser registradas de forma consistente e, quando necessário, transacional.

---

# 51. Regra para fidelidade

Operações de fidelidade também são operações de negócio.

O frontend não pode simplesmente informar:

"cliente possui 8 carimbos".

O backend deve verificar:

- cliente;
- histórico;
- quantidade de carimbos;
- elegibilidade;
- resgate;
- código;
- estado do código.

Um código de recompensa utilizado uma vez não pode ser reutilizado.

---

# 52. Regra para estoque

Alterações de estoque devem ser realizadas por operações autorizadas.

O frontend não pode definir livremente a quantidade final do estoque sem que o backend valide a operação.

Movimentações futuras devem possuir histórico suficiente para investigação quando necessário.

---

# 53. Segurança das integrações futuras

A arquitetura deve permitir adicionar novos provedores sem criar dependências inseguras.

Novos provedores devem seguir os mesmos princípios:

- secrets protegidos;
- autenticação;
- validação;
- autorização;
- idempotência;
- logs;
- tratamento de erros;
- isolamento;
- reconciliação.

---

# 54. Checklist de segurança

Antes de considerar uma funcionalidade sensível concluída:

- [ ] A autenticação foi considerada?
- [ ] A autorização foi implementada no backend?
- [ ] O frontend não é a única barreira?
- [ ] O tenant é validado?
- [ ] A unidade é validada quando aplicável?
- [ ] As permissões são verificadas?
- [ ] Os IDs recebidos são validados?
- [ ] A entrada é validada?
- [ ] Existe proteção contra acesso a objetos de outros usuários?
- [ ] RLS foi considerado?
- [ ] Secrets estão protegidos?
- [ ] Dados sensíveis não estão sendo expostos?
- [ ] Logs não contêm secrets ou dados desnecessários?
- [ ] A operação é resistente a repetição?
- [ ] Webhooks são validados quando aplicável?
- [ ] Erros não expõem informações internas?
- [ ] O fluxo foi analisado contra abuso?
- [ ] Existem testes de autorização?
- [ ] O tratamento de dados pessoais foi avaliado?
- [ ] Retenção e eliminação foram consideradas?
- [ ] Dependências novas foram avaliadas?

---

# 55. Regra principal

> Segurança não é esconder o botão. Segurança é impedir a operação.

O sistema deve assumir que:

- o frontend pode ser manipulado;
- requisições podem ser alteradas;
- IDs podem ser trocados;
- APIs podem ser chamadas diretamente;
- usuários podem tentar acessar outros tenants;
- webhooks podem ser repetidos;
- integrações podem falhar;
- dados externos podem ser maliciosos;
- credenciais podem ser comprometidas.

Por isso:

> O backend deve validar toda operação importante, o banco deve reforçar o isolamento e o sistema deve operar com o menor privilégio necessário.

A segurança deve proteger o negócio sem transformar a arquitetura em complexidade desnecessária.