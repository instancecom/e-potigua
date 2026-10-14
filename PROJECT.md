# PRODUCT.md

## 1. Visão do produto

O produto é um SaaS de gestão para lava-rápidos e negócios de
estética automotiva.

O proprietário assina um plano e passa a ter acesso ao painel
administrativo da sua empresa.

A plataforma conecta a gestão do negócio, os funcionários,
a operação dos veículos e a experiência dos clientes.

Cada empresa possui seu próprio ambiente, com suas unidades,
funcionários, clientes, veículos, serviços, estoque e movimentações
financeiras.

---

# 2. Perfis de usuário

O produto possui inicialmente três perfis principais:

### Proprietário

É o responsável pelo negócio.

Pode administrar as unidades, funcionários, serviços, estoque,
agendamentos, fidelidade e informações financeiras.

Também pode executar ações que normalmente seriam realizadas
pelos funcionários.

### Funcionário

Atua diretamente na operação do estabelecimento.

Pode atender veículos, adicionar serviços, atualizar o status
do atendimento, registrar pagamentos, solicitar produtos e,
quando necessário, trabalhar temporariamente em outra unidade.

### Cliente

Utiliza a plataforma para cadastrar seus veículos, realizar
agendamentos, acompanhar o serviço e utilizar o cartão de
fidelidade digital.

---

# 3. Assinatura

O proprietário escolhe e assina um dos planos disponíveis.

Após a assinatura, ele passa a ter acesso ao ambiente administrativo
da sua empresa.

A plataforma possuirá inicialmente três planos.

Os nomes, preços, limites e diferenças entre os planos ainda serão
definidos.

Os recursos disponíveis poderão variar de acordo com o plano
contratado.

---

# 4. Empresas e unidades

Uma empresa pode possuir uma ou mais unidades.

O proprietário pode cadastrar e administrar suas unidades através
do painel administrativo.

Cada unidade possui sua própria operação, funcionários e capacidade
de atendimento.

As informações de cada empresa devem permanecer isoladas das demais
empresas que utilizam a plataforma.

---

# 5. Funcionários

O proprietário pode cadastrar funcionários e atribuir cada funcionário
a uma unidade principal.

O funcionário normalmente atua na unidade à qual está vinculado.

## Transferência entre unidades

Quando um funcionário precisar cobrir outra unidade, poderá realizar
uma transferência através da plataforma.

O funcionário poderá clicar em uma ação de transferência, selecionar
a unidade para a qual irá atuar e passar a trabalhar temporariamente
naquela unidade.

Quando não for mais necessário permanecer na outra unidade, poderá
retornar à sua unidade.

O proprietário também poderá realizar ou administrar essa transferência.

A transferência não deve exigir que o funcionário seja cadastrado
novamente.

A unidade principal do funcionário continua existindo mesmo quando
ele estiver temporariamente atuando em outra unidade.

---

# 6. Funcionários e capacidade operacional

A capacidade de atendimento da unidade está relacionada à quantidade
de funcionários disponíveis para atuar como lavadores.

A quantidade de veículos que podem ser atendidos simultaneamente
deve considerar a capacidade operacional real da unidade.

A regra inicial considera a quantidade de lavadores disponíveis,
mas a forma exata de cálculo poderá evoluir conforme a operação
real seja validada.

---

# 7. Serviços

O proprietário pode cadastrar os serviços oferecidos pelo
estabelecimento.

Cada serviço deve possuir informações como:

- nome;
- valor;
- tipo de veículo ao qual se aplica;
- duração estimada.

Os tipos de veículos podem incluir:

- hatch;
- sedan;
- SUV;
- caminhonete;
- caminhão;
- moto;
- outras categorias que venham a ser necessárias.

O mesmo tipo de serviço pode possuir valores diferentes para
diferentes tipos de veículos.

A duração estimada do serviço será utilizada pelo sistema
para calcular a ocupação da agenda.

---

# 8. Atendimento de veículos

Um atendimento pode acontecer de duas formas:

- através de um agendamento;
- diretamente no estabelecimento, sem agendamento.

Durante o atendimento, o funcionário deverá selecionar os serviços
solicitados pelo cliente.

O sistema deverá calcular o valor total do atendimento com base
nos serviços selecionados.

## Alteração de serviços durante o atendimento

O funcionário poderá adicionar novos serviços durante o atendimento.

Isso permite que o cliente solicite serviços adicionais depois
que o atendimento já começou.

Quando um novo serviço for adicionado, o valor total do atendimento
deverá ser atualizado.

---

# 9. Status do atendimento

O atendimento possui inicialmente os seguintes estados:

1. Na fila
2. Lavando
3. Secando
4. Finalizado

O funcionário responsável pelo atendimento poderá atualizar
o status conforme o veículo avança na operação.

O status representa a situação atual do veículo dentro do
lava-rápido.

---

# 10. Agendamento

O cliente poderá realizar um agendamento através da plataforma.

Para realizar o agendamento, deverá selecionar:

- veículo;
- unidade;
- data;
- horário;
- serviços desejados.

O sistema deverá apresentar apenas unidades disponíveis para
o atendimento.

O sistema também deverá considerar o horário de funcionamento
da unidade.

---

# 11. Serviços disponíveis no agendamento

Os serviços apresentados durante o agendamento devem considerar
o tipo do veículo selecionado pelo cliente.

Por exemplo:

Se o veículo for um hatch, o sistema deverá apresentar os serviços
disponíveis para hatch.

Se o veículo for uma moto, deverão aparecer os serviços disponíveis
para moto.

O cliente não deverá visualizar serviços incompatíveis com o tipo
do veículo selecionado.

---

# 12. Duração e disponibilidade dos agendamentos

Cada serviço possui uma duração estimada cadastrada pelo proprietário.

O sistema deverá utilizar essa duração para determinar quanto tempo
o atendimento ocupará na agenda.

Por exemplo:

Um serviço com duração de 40 minutos agendado às 14:00 deverá ocupar
a capacidade correspondente até aproximadamente 14:40.

Quando houver mais de um serviço no mesmo atendimento, o sistema
deverá considerar a duração correspondente para calcular o período
necessário.

A disponibilidade de horários também deverá considerar a capacidade
operacional da unidade.

A capacidade inicial deverá considerar a quantidade de lavadores
disponíveis na unidade.

---

# 13. Alteração de agendamento

Um agendamento poderá ter sua data ou horário alterados.

A alteração poderá ser realizada:

- pelo próprio cliente que realizou o agendamento;
- por um funcionário;
- pelo proprietário.

Quando o horário anterior ainda não tiver passado e o agendamento
for alterado, o horário anteriormente reservado deverá voltar a ficar
disponível para outros clientes, desde que não exista outro
agendamento ocupando aquele período.

O novo horário deverá passar a ocupar a disponibilidade correspondente.

---

# 14. Atendimento sem agendamento

O sistema também deverá permitir que um veículo seja atendido
sem agendamento prévio.

Nesse caso, o funcionário poderá registrar o atendimento diretamente
na plataforma.

Deverá selecionar ou cadastrar as informações necessárias do veículo,
adicionar os serviços solicitados e acompanhar o atendimento
normalmente.

O atendimento sem agendamento também poderá participar do sistema
de fidelidade quando o cliente possuir uma conta na plataforma.

---

# 15. Pagamentos

A plataforma não realiza o processamento do pagamento.

O pagamento acontece através dos meios utilizados pelo próprio
estabelecimento.

A plataforma serve para registrar que o pagamento foi realizado.

Os métodos inicialmente previstos são:

- Pix;
- dinheiro;
- cartão de débito;
- cartão de crédito.

## Atendimento realizado através de agendamento

Quando o atendimento possui um agendamento registrado na plataforma,
o funcionário não precisa cadastrar novamente o valor.

Após receber o pagamento do cliente, deverá apenas registrar que
o atendimento foi pago.

A plataforma já possui o valor calculado através do atendimento.

## Atendimento sem agendamento

Quando o atendimento não possui um agendamento previamente registrado,
o funcionário deverá informar manualmente o valor recebido.

Isso permite registrar o atendimento mesmo quando o cliente
simplesmente chegou ao estabelecimento.

## Cliente sem conta

Caso o cliente não possua uma conta na plataforma, o funcionário
também deverá conseguir registrar o atendimento e o pagamento
normalmente.

O sistema não deve exigir que todo cliente tenha uma conta para
que o estabelecimento possa realizar uma venda.

---

# 16. Registro financeiro

Quando um pagamento for registrado, ele deverá fazer parte
do controle financeiro da empresa.

O proprietário poderá visualizar as entradas de dinheiro e seus
respectivos métodos de pagamento.

O sistema deverá permitir visualizar o faturamento por diferentes
períodos, inicialmente:

- dia;
- semana;
- mês.

---

# 17. Saídas financeiras

O proprietário poderá registrar saídas de dinheiro da operação.

Cada saída deverá possuir pelo menos:

- valor;
- motivo.

As saídas deverão fazer parte da visão financeira do estabelecimento.

O objetivo é permitir que o proprietário acompanhe tanto o dinheiro
que entrou quanto o dinheiro que saiu.

---

# 18. Cartão de fidelidade digital

A plataforma possuirá um cartão de fidelidade digital.

O cartão terá um total de **8 carimbos**.

O cliente precisa possuir uma conta na plataforma para utilizar
o cartão digital.

Após um atendimento pago, o funcionário poderá atribuir um carimbo
ao cartão de fidelidade do cliente.

---

# 19. Recompensa da fidelidade

O proprietário poderá configurar a recompensa oferecida ao cliente
ao completar os 8 carimbos.

A recompensa poderá ser, por exemplo:

- dinheiro;
- um serviço do próprio estabelecimento;
- outro benefício definido pelo proprietário.

A quantidade total de carimbos será de 8.

Quando o cliente completar os 8 carimbos, o botão:

**"Resgatar recompensa"**

ficará disponível no seu cartão de fidelidade.

---

# 20. Resgate da recompensa

Quando o cliente clicar em "Resgatar recompensa", a plataforma deverá
gerar um código único de resgate.

O cliente deverá apresentar esse código ao proprietário ou funcionário.

O proprietário ou funcionário deverá utilizar o código para confirmar
que a recompensa foi entregue.

Somente após a confirmação da entrega a recompensa será considerada
resgatada.

Depois que a recompensa for entregue, o cartão de fidelidade deverá
ser zerado e poderá iniciar uma nova sequência de 8 carimbos.

O código de resgate não deve poder ser utilizado novamente após
a recompensa ter sido confirmada.

---

# 21. Controle de estoque

O proprietário poderá cadastrar e acompanhar produtos e insumos
utilizados na operação.

Os funcionários poderão informar quando determinado produto estiver
faltando ou próximo de acabar.

O proprietário deverá receber uma notificação quando um funcionário
realizar uma solicitação.

A forma detalhada de controle, movimentação e baixa do estoque
ainda será definida.

---

# 22. Cadastro de clientes

O cliente poderá criar uma conta na plataforma.

Dentro da própria conta poderá cadastrar seus veículos.

Um cliente poderá possuir mais de um veículo.

---

# 23. Cadastro de veículos

Cada veículo deverá possuir informações como:

- placa;
- marca;
- modelo;
- cor;
- tipo do veículo.

Os tipos inicialmente considerados são:

- hatch;
- sedan;
- SUV;
- caminhonete;
- caminhão;
- moto.

---

# 24. Acompanhamento do serviço pelo cliente

Quando o cliente possuir uma conta e possuir um atendimento
associado ao seu perfil, poderá acompanhar o andamento do serviço
pela própria plataforma.

O cliente poderá visualizar o status atual do veículo:

**Na fila → Lavando → Secando → Finalizado**

Quando o funcionário atualizar o status, a informação deverá ser
refletida para o cliente.

O objetivo é permitir que o cliente acompanhe o serviço sem precisar
entrar em contato com o estabelecimento para perguntar em qual etapa
o veículo está.

---

# 25. Fluxo completo com agendamento

Cliente cria sua conta.

Cliente cadastra seu veículo.

Cliente escolhe o veículo que deseja utilizar.

O sistema identifica o tipo do veículo.

O sistema apresenta os serviços compatíveis com aquele veículo.

Cliente escolhe os serviços.

Cliente escolhe uma unidade disponível.

Cliente escolhe uma data e horário disponíveis.

O sistema calcula a duração necessária do atendimento.

O agendamento é confirmado.

No momento do atendimento, o funcionário assume o veículo.

O status começa como "Na fila".

O funcionário pode adicionar serviços adicionais caso o cliente
solicite.

O valor total é atualizado.

O veículo passa por:

**Na fila → Lavando → Secando → Finalizado**

O cliente acompanha essas alterações pela própria conta.

Após o serviço, o cliente realiza o pagamento.

O funcionário registra o pagamento como realizado.

O funcionário pode atribuir o carimbo de fidelidade.

O atendimento é encerrado.

---

# 26. Fluxo completo sem agendamento

Cliente chega ao estabelecimento.

O funcionário registra o atendimento.

O funcionário seleciona ou cadastra o veículo.

Seleciona os serviços solicitados.

O sistema calcula o valor.

O atendimento entra na operação.

O funcionário atualiza os estados:

**Na fila → Lavando → Secando → Finalizado**

Caso o cliente solicite um serviço adicional, o funcionário pode
adicioná-lo ao atendimento.

O valor é atualizado.

Após o serviço, o cliente realiza o pagamento.

O funcionário registra manualmente o valor recebido.

O método de pagamento é registrado.

Caso o cliente possua uma conta na plataforma, o funcionário poderá
atribuir o carimbo de fidelidade.

O atendimento é encerrado.

---

# 27. Objetivo da primeira versão

A primeira versão deve resolver os principais problemas de gestão
e operação do lava-rápido.

O foco inicial é:

- gestão de empresas;
- gestão de unidades;
- gestão de funcionários;
- transferência entre unidades;
- cadastro de serviços;
- definição de preços;
- definição de duração dos serviços;
- cadastro de clientes;
- cadastro de veículos;
- agendamentos;
- alteração de agendamentos;
- atendimento com ou sem agendamento;
- atualização do status dos veículos;
- registro de pagamentos;
- controle financeiro básico;
- controle de estoque;
- solicitações de reposição;
- cartão de fidelidade;
- recompensas;
- acompanhamento do serviço pelo cliente.

A primeira versão deve priorizar simplicidade, confiabilidade
e facilidade de uso.

---

# 28. Funcionalidades futuras

Algumas ideias fazem parte da visão futura do produto, mas não devem
ser implementadas na primeira versão sem autorização explícita.

Entre elas:

- reconhecimento automático de placas;
- câmeras integradas à operação;
- alteração automática de status através de câmeras;
- automações avançadas;
- inteligência artificial;
- integrações avançadas com WhatsApp;
- aplicativo mobile nativo;
- análises avançadas;
- outras automações ainda não validadas.

Essas ideias não fazem parte do escopo atual apenas por estarem
documentadas aqui.

---

# 29. Pontos ainda não definidos

Algumas regras serão definidas posteriormente conforme o produto
for sendo validado.

### Planos

Existirão três planos.

Nomes, preços, limites e diferenças ainda não definidos.

### Estoque

O sistema terá controle de estoque e solicitações de produtos,
mas as regras detalhadas de movimentação, baixa, reposição e
quantidades ainda não foram definidas.

### Fidelidade

A quantidade de carimbos está definida em 8.

A forma detalhada de configuração da recompensa ainda poderá evoluir.

### Capacidade operacional

A capacidade inicial considera a quantidade de lavadores disponíveis
na unidade.

A regra poderá ser refinada conforme a operação real seja validada.

---

# 30. Princípio do produto

O sistema deve conectar três necessidades principais:

### Gestão

O proprietário precisa entender e administrar o negócio.

### Operação

O funcionário precisa conseguir executar o trabalho de forma rápida
e organizada.

### Cliente

O cliente precisa conseguir agendar, acompanhar seu veículo e
participar do programa de fidelidade.

A plataforma deve fazer essas três partes funcionarem em conjunto.

Cada funcionalidade deve contribuir para tornar a operação mais
organizada, transparente e fácil de administrar.