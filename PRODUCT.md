# PRODUCT.md

## 1. Objetivo

Este documento define o comportamento do produto, suas funcionalidades, regras de negócio e limites de escopo.

O produto é um SaaS para gestão de lava-rápidos e empresas de estética automotiva.

O sistema deve conectar:

- Gestão da empresa
- Operação das unidades
- Funcionários
- Clientes
- Veículos
- Serviços
- Agendamentos
- Pagamentos
- Fidelidade
- Estoque

O produto deve priorizar simplicidade, velocidade e confiabilidade.

---

## 2. Estrutura da empresa

O sistema deve permitir que um proprietário tenha uma empresa dentro da plataforma.

Uma empresa pode possuir múltiplas unidades.

Cada unidade possui sua própria operação, funcionários disponíveis e agenda.

O sistema deve ser multiempresa desde o início.

A primeira utilização real do produto será feita nas duas unidades do negócio do sogro do proprietário do projeto, mas isso serve como ambiente de validação e não como limite do produto.

---

## 3. Planos

O produto será comercializado como SaaS por assinatura.

Estão previstos inicialmente três planos.

Os nomes, preços e diferenças entre os planos ainda serão definidos.

As funcionalidades devem ser estruturadas de forma que possam futuramente ser associadas a diferentes planos sem necessidade de reconstrução do sistema.

---

## 4. Usuários e permissões

O proprietário da empresa possui acesso administrativo.

O proprietário pode:

- Gerenciar a empresa.
- Gerenciar unidades.
- Cadastrar funcionários.
- Gerenciar serviços.
- Gerenciar clientes.
- Gerenciar veículos.
- Gerenciar agenda.
- Visualizar informações financeiras.
- Gerenciar fidelidade.
- Gerenciar estoque.
- Configurar integrações disponíveis.

Funcionários possuem acesso operacional de acordo com suas permissões.

Clientes possuem acesso à sua própria conta e às informações relacionadas aos seus veículos, agendamentos e fidelidade.

Autenticação e autorização são conceitos diferentes e devem ser tratados separadamente.

---

## 5. Funcionários e unidades

O proprietário pode cadastrar funcionários e definir uma unidade principal para cada funcionário.

Um funcionário não precisa ser cadastrado novamente para atuar temporariamente em outra unidade.

Deve existir uma ação de transferência temporária para permitir que um funcionário cubra outra unidade.

Depois da transferência, o funcionário pode retornar à sua unidade principal.

O proprietário também pode realizar e gerenciar essas transferências.

---

## 6. Capacidade operacional

A capacidade inicial da unidade será relacionada à quantidade de lavadores disponíveis.

Essa capacidade será utilizada no cálculo de disponibilidade para agendamentos.

A forma exata de cálculo poderá evoluir após a validação real do produto.

Não devem ser criadas regras complexas de capacidade sem necessidade comprovada.

---

## 7. Serviços

O proprietário pode cadastrar serviços.

Cada serviço possui, no mínimo:

- Nome.
- Valor.
- Tipo de veículo aplicável.
- Duração estimada.

Tipos de veículo inicialmente suportados:

- Hatch.
- Sedan.
- SUV.
- Caminhonete/Pickup.
- Caminhão.
- Moto.

Um mesmo serviço pode possuir preços diferentes de acordo com o tipo de veículo.

A duração do serviço deve ser considerada no cálculo da agenda.

Quando o cliente selecionar múltiplos serviços, o sistema deve considerar suas respectivas durações para determinar a disponibilidade.

Não devem ser criadas regras especiais de sobreposição sem necessidade validada.

---

## 8. Clientes

O cliente pode criar uma conta na plataforma.

O cliente pode cadastrar seus veículos.

Cada veículo deve possuir, no mínimo:

- Placa.
- Marca.
- Modelo.
- Cor.
- Tipo de veículo.

O cliente pode utilizar seus veículos para realizar agendamentos.

Um cliente não precisa necessariamente possuir uma conta para ser atendido presencialmente.

---

## 9. Agendamento

O cliente pode realizar um agendamento escolhendo:

1. Veículo.
2. Serviço ou serviços.
3. Unidade.
4. Data.
5. Horário.

O sistema deve mostrar somente serviços compatíveis com o tipo de veículo selecionado.

A disponibilidade deve considerar:

- Horário de funcionamento da unidade.
- Duração dos serviços.
- Capacidade operacional disponível.

O sistema não deve permitir agendamentos incompatíveis com a capacidade operacional.

---

## 10. Alteração de agendamento

O cliente ou funcionário que criou o agendamento pode alterar sua data e horário.

O proprietário também pode alterar.

Se o horário original ainda não tiver passado e o agendamento for movido, o horário anterior deve voltar a ficar disponível.

O novo horário deve ocupar a capacidade correspondente.

Não devem ser inventadas regras adicionais de cancelamento sem definição específica.

---

## 11. Operação do serviço

Um serviço possui inicialmente os seguintes estados:

1. Na fila.
2. Lavando.
3. Secando.
4. Finalizado.

O funcionário responsável pela operação deve conseguir alterar o estado do serviço de forma rápida.

A interface operacional deve priorizar poucos cliques e velocidade.

---

## 12. Serviços adicionais

Durante um atendimento ativo, o funcionário pode adicionar serviços adicionais.

Exemplo:

O cliente contratou uma lavagem e, durante o atendimento, solicita uma higienização.

O funcionário adiciona o serviço.

O valor total do atendimento deve ser atualizado.

Regras adicionais de remoção ou edição de serviços não devem ser inventadas enquanto não forem definidas.

---

## 13. Atendimento sem agendamento

O sistema também deve permitir atender clientes que chegam diretamente à unidade.

O funcionário deve conseguir:

- Registrar o atendimento.
- Selecionar ou cadastrar o veículo.
- Associar um cliente quando aplicável.
- Selecionar os serviços.
- Acompanhar o atendimento.
- Registrar o pagamento.
- Finalizar o atendimento.

Um cliente sem conta pode ser atendido normalmente.

---

## 14. Pagamentos

Na V1, o sistema não será responsável por processar diretamente o pagamento.

O pagamento continua sendo realizado por meios externos, como:

- Pix.
- Dinheiro.
- Débito.
- Crédito.
- Terminal de pagamento integrado.

O sistema deve registrar o pagamento realizado.

### 14.1 Pagamento de atendimento agendado

Quando um atendimento possui valor previamente definido, o funcionário pode selecionar uma ação como "Pagou".

O sistema deve permitir confirmar o pagamento e registrar o método utilizado.

O funcionário não precisa digitar novamente o valor associado ao atendimento.

### 14.2 Pagamento de atendimento sem agendamento

Em um atendimento sem agendamento, o funcionário deve informar o valor pago e o método de pagamento.

### 14.3 Integração com terminal

A V1 poderá possuir integração com um provedor de pagamento externo.

O primeiro provedor considerado para validação será o Mercado Pago, devido à utilização real desse provedor no ambiente inicial de validação.

Quando a integração estiver configurada, o sistema poderá enviar o valor da venda ao terminal compatível, aguardar o resultado da transação e registrar o resultado no atendimento.

O pagamento continua sendo processado pelo provedor de pagamento.

O SaaS não deve assumir o papel de processador de pagamentos.

A integração deve ser construída de forma desacoplada do restante do sistema, permitindo adicionar outros provedores no futuro.

---

## 15. Financeiro

O proprietário pode visualizar:

- Receita do dia.
- Receita da semana.
- Receita do mês.
- Valores recebidos por método de pagamento.

O sistema também deve permitir registrar saídas financeiras.

Uma saída possui:

- Valor.
- Motivo.

O financeiro deve refletir os registros realizados na operação.

---

## 16. Fidelidade

O sistema deve possuir um programa de fidelidade digital.

A fidelidade possui exatamente 8 carimbos.

O proprietário configura uma recompensa.

A recompensa pode ser:

- Valor em dinheiro.
- Um serviço oferecido pela empresa.

Após um serviço pago, o funcionário pode adicionar um carimbo ao cliente elegível.

Ao atingir 8 carimbos, o cliente pode selecionar "Resgatar recompensa".

O sistema gera um código único de resgate.

O proprietário ou funcionário confirma a entrega da recompensa utilizando o código.

Após a confirmação:

- O código deixa de ser válido.
- Os carimbos são zerados.
- Um novo ciclo de fidelidade pode começar.

O cliente precisa possuir uma conta para utilizar a fidelidade.

---

## 17. Estoque

O proprietário pode gerenciar produtos utilizados na operação.

Funcionários podem informar quando um produto estiver faltando ou precisar de reposição.

O funcionário deve conseguir realizar uma ação como "Solicitar".

O proprietário deve receber uma notificação sobre a solicitação.

As regras detalhadas de movimentação, baixa automática, estoque mínimo e consumo ainda serão definidas após a validação da operação.

Não devem ser inventadas regras de estoque sem necessidade.

---

## 18. Acompanhamento do serviço pelo cliente

Quando houver associação entre cliente, veículo e atendimento, o cliente deve conseguir acompanhar o estado atual do serviço.

O cliente pode visualizar, por exemplo:

- Na fila.
- Lavando.
- Secando.
- Finalizado.

O objetivo é reduzir a necessidade de o cliente perguntar presencialmente sobre o andamento do serviço.

---

## 19. Fluxo principal com agendamento

O fluxo esperado é:

Conta do cliente  
→ veículo  
→ serviço  
→ unidade  
→ data e horário  
→ confirmação  
→ funcionário assume o veículo  
→ serviço entra na fila  
→ lavagem  
→ secagem  
→ serviços adicionais, quando aplicável  
→ pagamento  
→ fidelidade, quando aplicável  
→ finalização.

---

## 20. Fluxo principal sem agendamento

O fluxo esperado é:

Cliente chega  
→ funcionário registra atendimento  
→ seleciona ou cadastra veículo  
→ seleciona serviços  
→ atendimento entra na fila  
→ lavagem  
→ secagem  
→ serviços adicionais, quando aplicável  
→ pagamento  
→ fidelidade, quando aplicável  
→ finalização.

---

## 21. Integrações

A plataforma deve ser preparada para trabalhar com integrações externas sem tornar o produto dependente de um único fornecedor.

Na V1, o primeiro provedor de pagamento considerado é o Mercado Pago.

A arquitetura deve permitir futuramente a integração com outros provedores e terminais.

Integrações futuras podem incluir:

- Outros provedores de pagamento.
- Leitura automática de placas.
- Sistemas de estacionamento.
- WhatsApp.
- Serviços relacionados a veículos.
- Outras automações operacionais.

Essas possibilidades não fazem parte automaticamente do escopo atual apenas por estarem previstas como evolução.

---

## 22. Visão futura do produto

O produto poderá evoluir para além da gestão tradicional de lava-rápidos.

Possíveis evoluções incluem:

- Leitura automática de placas para entrada e saída de veículos.
- Automação da identificação do veículo.
- Gestão de estacionamento.
- Mensalistas.
- Cálculo automático de permanência e cobrança.
- Infraestrutura própria de pagamentos White Label.
- Maquininhas com a marca da plataforma.
- Histórico completo do veículo.
- Lembretes de manutenção.
- Controle de troca de óleo.
- Controle de pneus e outros cuidados.
- Consulta de informações relacionadas a multas e débitos, quando houver integração disponível.
- Consulta de pedágios, quando houver integração disponível.
- Automação de comunicação com clientes.
- Recursos de inteligência e automação.

Essas funcionalidades representam visão futura e não devem ser implementadas antecipadamente sem decisão explícita.

---

## 23. Fora do escopo inicial

Não fazem parte da V1, salvo decisão explícita posterior:

- Reconhecimento automático de placas.
- Câmeras e automação completa de entrada e saída.
- Gestão completa de estacionamento.
- Sistema próprio de pagamentos White Label.
- Maquininhas próprias com marca da plataforma.
- Aplicativo mobile nativo.
- Inteligência artificial avançada.
- Automação avançada por WhatsApp.
- Analytics avançado.
- Outras automações não necessárias para validar o produto.

A integração inicial com um provedor de pagamento externo pode fazer parte da V1, sem transformar a plataforma em uma processadora de pagamentos.

---

## 24. Princípios do produto

O produto deve:

- Resolver problemas reais da operação.
- Ser simples de aprender.
- Ser rápido para quem trabalha na operação.
- Reduzir tarefas manuais desnecessárias.
- Conectar gestão, operação e cliente.
- Evitar complexidade sem benefício real.
- Evoluir com base na utilização real.
- Preservar os dados e o histórico do negócio.
- Ser preparado para múltiplas empresas e unidades.
- Ser construído como produto comercial, e não como sistema exclusivo para uma única empresa.

O objetivo não é criar apenas um sistema de cadastro.

O objetivo é construir uma plataforma que ajude a empresa a operar melhor e, com o tempo, permita criar uma relação mais completa entre o estabelecimento, o cliente e o veículo.