---
name: CRUD no ThiagoLanchesBackEnd
description: Padrões e convenções para implementar CRUD neste repositório (Express 5 + TypeScript + mysql2/promise + Zod). Use ao criar ou modificar recursos/entidades.
---

# CRUD neste projeto

Siga a arquitetura em camadas existente: `route -> controller -> service -> repository -> entity` (+ `schemas` Zod). Não introduza ORM, novos padrões de validação/erros ou estruturas de pastas diferentes sem necessidade.

## Camadas e responsabilidades

- **`src/routes/*.ts`**: instancia controller(s), define endpoints com `Router`, aplica `authMiddleware` onde necessário, `export default router`.
  - Rotas públicas específicas do recurso costumam ficar em arquivo próprio montado em `src/app.ts` (ex.: `productRoutes` em `/menu`).
  - CRUD administrativo protegido fica em `src/routes/adminCrudRoutes.ts` (`router.use(authMiddleware)`), com listagens via `AdminPaginationController` e `GET/:id|POST|PUT|DELETE` delegando ao controller do recurso.
- **`src/controllers/*.ts`**: classe com handlers arrow (`findAll/findById/create/update/delete = async (req,res): Promise<void>`), extrai dados de `req.params/body`, chama service, retorna status/JSON. Trata `AppError` com `error.statusCode`/`message`; erros não tratados viram `500` com `{ message: "Erro interno do servidor" }` (alguns controllers centralizam em `responderErro`, outros fazem inline — mantenha o estilo do arquivo que estiver alterando).
- **`src/services/*.ts`**: regras de negócio e validação. Valida ids/dados com schemas Zod (`safeParse`); em falha lança `new AppError(mensagem, 400)`. Busca entidade antes de atualizar/deletar quando aplicável e lança `404` se não existir. Verifica unicidade/conflitos (`409`) e vínculos antes de excluir (ou trata erros MySQL como `ER_ROW_IS_REFERENCED_2`/FK). Pode encapsular gravação para mapear erros de FK (`ER_NO_REFERENCED_ROW_2`) para `AppError` 400.
- **`src/repositories/*.ts`**: acesso MySQL via `pool` (`src/config/database.ts`, `mysql2/promise`). Define `interface *Row extends RowDataPacket` (e `CountRow`, etc.), usa `pool.query`/`pool.execute<ResultSetHeader>`, mapeia rows para entidades. Para operações multi-tabela/consistentes use transação: `getConnection()`, `beginTransaction()`, `commit()`/`rollback()` no `try/catch/finally`, `connection.release()` no `finally` (padrão em `ProductRepository`).
- **`src/entities/*.ts`**: classes de domínio que validam/guardam estado (muitas usam schemas no construtor/setters) e expõem `toJSON()` quando usado nas respostas.
- **`src/schemas/*.ts`**: schemas Zod para ids, campos e payloads de criação/atualização; reutilize-os no service.

## Convenções observadas
- **Erros HTTP**: use `AppError` (`src/errors/AppError.ts`); 400 validação/dados inválidos, 404 não encontrado, 409 conflito/vínculo, 500 interno. Mensagens em pt-BR.
- **IDs**: vindos de rota como `Number(req.params.id)`; valide no service com schema de id.
- **Respostas comuns**: `GET` lista/detalhe -> `200` + JSON; `POST` criação -> `201` (ex.: `{ id_categoria }` ou `{ id_produto }` conforme recurso); `PUT/DELETE` sucesso -> `200` com `{ message: "..." }`. Ajuste ao contrato já usado pelo recurso.
- **Banco**: nomes de tabelas/colunas seguem o esquema MySQL existente (muitos campos em pt, ex. `id_produto`, `nome_lanches`, `id_categoria`); confira `thiagolanche.sql` e o código atual antes de escrever SQL, mas lembre que o dump pode estar dessincronizado do modelo esperado pelo código (ver `AGENTS.md`).
- **Admin/auth**: `authMiddleware` é exclusivo para ADMIN e reconsulta `usuarios`; rotas sob `/admin` (via `adminCrudRoutes`) já ficam protegidas por `router.use(authMiddleware)`.

## Ao adicionar um novo CRUD
1. Criar/ajustar `schemas`, `entity`, `repository`, `service`, `controller`, `routes`.
2. Montar a rota em `src/app.ts` e/ou registrar em `src/routes/adminCrudRoutes.ts` conforme o recurso deva ser público e/ou administrativo (note que listagens admin usam `AdminPaginationController.listar("<recurso>")`).
3. Implementar validação Zod no service, tratamento de `AppError` no controller e SQL/transações no repository conforme complexidade.
4. Não há suíte de testes automatizados; valide com `npm run build` e teste manual dos endpoints (e `npm run dev`/banco conforme necessário). Evite alterar `dist/` diretamente.