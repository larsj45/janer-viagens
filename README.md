# Janer Viagens

Site de viagens da família Janér, publicado no Vercel pelo projeto `janer-viagens`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy de produção

O fluxo padrão deve ser:

1. Trabalhar em uma branch ou PR.
2. Rodar `npx eslint` e `npx tsc --noEmit`.
3. Fazer merge para `main`.
4. Dar `git push origin main`.

O projeto Vercel `janer-viagens` está conectado ao GitHub `larsj45/janer-viagens` com production branch `main`. Com os domínios corretamente atribuídos ao projeto, um push em `main` deve criar o deploy de produção e publicar automaticamente em:

- `janer.com.br`
- `www.janer.com.br`

Não use `vercel alias set` como parte do fluxo normal. Esse comando só deve ser fallback emergencial se a atribuição de domínios no Vercel estiver quebrada.

### Estado validado em 2026-06-20

- `feat/milhas-tab` está 4 commits à frente de `main`; `main` não tem commits exclusivos. O caminho recomendado é mergear o PR #1 (`feat/milhas-tab` -> `main`) e manter `main` como production branch.
- O projeto Vercel `janer-viagens` já tem `main` como production branch.
- `janer.com.br` e `www.janer.com.br` ainda aparecem atribuídos ao projeto Vercel antigo `janer-dashboard`, não ao `janer-viagens`.
- Antes do próximo deploy automático, mover os dois domínios para o projeto `janer-viagens` em Vercel Settings -> Domains ou via CLI com `npx vercel domains add <dominio> janer-viagens --force`.

Troca de domínios, deploy público e push em `main` precisam de OK explícito do Lars.
