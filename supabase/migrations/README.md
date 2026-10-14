# Migrations do Supabase (DATABASE.md)

Este diretório armazena o histórico versionado de DDLs e políticas de segurança RLS do PostgreSQL.

## Regras Obrigatórias (DATABASE.md e SECURITY.md)

1. **Multi-tenant por Padrão**: Toda tabela que armazene dados de negócio deve possuir a coluna `company_id uuid references companies(id) not null`.
2. **Row Level Security (RLS)**: O RLS deve ser explicitamente habilitado em todas as tabelas de dados (`ALTER TABLE nome_da_tabela ENABLE ROW LEVEL SECURITY;`).
3. **Negação por Padrão**: Sem policies permissivas genéricas (`USING (true)`). O acesso é condicionado ao `auth.uid()` e suas relações de empresa/unidade.
4. **Imutabilidade Histórica**: Preços de serviços aplicados em atendimentos passados nunca devem ser atualizados retrospectivamente.
5. **Nomes de Arquivo**: Siga o padrão incremental `YYYYMMDDHHMMSS_descricao_da_mudanca.sql`.
