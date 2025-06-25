#  TaskMaster Pro - Fullstack

> Projeto completo com **Vue 3 + Vite** no frontend e **Node.js + Express + MongoDB** no backend, tudo junto na raiz!

##  Como rodar

### 1. Instale as dependências
```bash
yarn install
```

### 2. Configure o banco de dados
- Edite o arquivo `.env` com sua string do MongoDB (ou use o padrão local)

### 3. Rode tudo junto (frontend + backend)
```bash
yarn dev
```
- Frontend: http://localhost:8080
- Backend/API: http://localhost:3000

### 4. Rodar só o backend
```bash
yarn dev:api
```

### 5. Rodar só o frontend
```bash
yarn dev:web
```

---

##  Estrutura
```
├── models/         # Models do MongoDB
├── routes/         # Rotas da API Express
├── src/            # Código Vue (frontend)
├── server.js       # Servidor Express principal
├── .env            # Configurações de ambiente
├── package.json    # Dependências e scripts
├── README.md       # Este arquivo
```

---

##  Funcionalidades
- CRUD de tarefas com MongoDB
- Interface moderna com Vuetify
- API RESTful
- Deploy fácil (tudo junto)

---

Feito para facilitar o desenvolvimento fullstack! 🚀 