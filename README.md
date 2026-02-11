# Flugo

Aplicação de gestão de colaboradores desenvolvida com React, TypeScript, Vite, Material UI e Firebase.

## Como rodar localmente

### Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** (ou npm/yarn)

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd front-end-challenge
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com as credenciais do seu projeto Firebase:

```bash
cp .env.example .env
```

Edite o `.env` e preencha os valores (obtidos no [Firebase Console](https://console.firebase.google.com) → seu projeto → Configurações do projeto → Seus apps):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Subir o projeto

```bash
pnpm dev
```

A aplicação estará disponível em **http://localhost:5173** (ou na porta indicada no terminal).

---

## Outros comandos

| Comando          | Descrição                      |
|------------------|--------------------------------|
| `pnpm build`     | Gera o build de produção       |
| `pnpm preview`   | Preview do build localmente    |
| `pnpm test`      | Roda os testes (modo watch)   |
| `pnpm test:run`  | Roda os testes uma vez (CI)    |
| `pnpm lint`      | Roda o ESLint                  |

## Stack

- React 19 + TypeScript
- Vite 7
- Material UI
- React Query (TanStack Query)
- React Hook Form + Zod
- Firebase (Firestore)
- Vitest + Testing Library
