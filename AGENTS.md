# AGENTS.md

## Projeto
- API em Node.js + TypeScript (CommonJS, `strict: true`) com Express 5 para "Thiago Lanches"; MySQL via `mysql2/promise`.
- Pontos de entrada: `src/server.ts` (listen, porta padrão `3000`) -> `src/app.ts` (app Express/rotas/CORS).
- Camadas seguem `routes/ -> controllers/ -> services/ -> repositories/ -> entities`; validação de requisições em `src/schemas` (Zod), pool de banco em `src/config/database.ts`.

## Comandos (de `package.json`)
- Instalar: `npm ci` (usado pelo `Dockerfile`) ou `npm install`.
- Dev: `npm run dev` -> `tsx watch --env-file=.env src/server.ts` (requer `.env` na raiz do repositório; carrega variáveis via tsx, não via dotenv em runtime).
- Build: `npm run build` -> `tsc` (`rootDir: src`, `outDir: dist`).
- Start (prod): `npm start` -> `node dist/server.js` (execute `npm run build` antes).
- Não há scripts de lint, teste ou checagem de tipos configurados. Não há test runner; `src/tests/testDatabase.ts` é um script manual de conectividade com o banco (não integrado ao npm).

## Peculiaridades de runtime / ambiente
- Chaves presentes no `.env`: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`. `src/config/database.ts` cria o pool apenas com host/usuário/senha/banco (não lê `DB_PORT`).
- `src/app.ts` define a origem do CORS de forma fixa como `http://localhost:5173`.
- `/admin` é montado duas vezes em `src/app.ts`: `adminRoutes` (`GET /admin/dashboard`) e `adminCrudRoutes` (CRUD protegido por autenticação em `/admin/produtos|ingredientes|categorias|estoque`). Outros routers são montados em `/` (ex.: `/auth`, `/menu`, `/ingredientes`, `/categorias`, `/estoque`, `/usuarios`, conforme definido nos arquivos de rota) — verifique o arquivo de rota específico antes de assumir os caminhos.

## Particularidades de autenticação / domínio
- O login em `AuthService` exige `email`, `cpf` e `senha` e permite apenas usuários com `role === "ADMIN"`; o payload do JWT contém `{ id, role }` (expiração de 2h). `POST /auth/register` recebe `nome,email,cpf,senha`.
- `authMiddleware` (`src/middlewares/authMiddleware.ts`) é exclusivo para admin: verifica o JWT, consulta novamente `usuarios` e rejeita a menos que `role` seja `ADMIN`.
- O código espera colunas/campos em `usuarios` incluindo `cpf` e `role` (veja `UserRepository`, `UserAdminRepository`, entidades/schemas). `thiagolanche.sql` é um dump do phpMyAdmin com schema/dados/triggers/views, mas sua definição/dados da tabela `usuarios` **não** incluem `cpf`/`role` — trate-o como potencialmente dessincronizado com o modelo da aplicação; verifique a estrutura do banco antes de confiar nele.

## Notas do repositório
- `dist/` e `thiagolanche.sql` estão versionados; evite editar diretamente a saída gerada em `dist/` — altere `src/` e refaça o build.
- `Dockerfile`: build multi-stage (`npm ci` -> `npm run build` -> imagem de produção executa `npm ci --omit=dev`, copia `dist`, expõe `3000`, `CMD ["npm","start"]`). Nenhum workflow de CI ou outros arquivos de instrução para agentes foram encontrados.

## Guardrails
- NUNCA leia, edite ou mostre o conteúdo de arquivos `.env`. Consulte apenas o `.env.example`.
- Não instale dependências novas sem pedir permissão.
- Não altere `src/middlewares/authMiddleware.ts`, `src/controllers/authController.ts` nem a lógica do bcrypt sem pedido explícito.
- Toda rota nova deve usar `authMiddleware` (exceto `POST /auth/login` e `POST /users`).
- Nunca use `sequelize.sync({ force: true })`: isso apaga os dados.
- Altere só os arquivos necessários para a tarefa; não refatore código não relacionado.
- Depois de qualquer alteração, rode `npx tsc --noEmit` e corrija os erros antes de finalizar.
- Se o pedido estiver ambíguo, pergunte antes de implementar.