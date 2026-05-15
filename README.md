# 🎮 Robux Premium — Guia de Instalação

## Estrutura do Projeto

```
robux-premium/
├── index.html          ← Página principal (frontend)
├── css/style.css       ← Estilos
├── js/script.js        ← Scripts gerais
├── js/checkout.js      ← Lógica de pagamento PIX
├── assets/             ← Imagens (copie do projeto original)
└── backend/
    ├── server.js       ← Servidor Node.js
    └── package.json    ← Dependências
```

---

## 1️⃣ Configurar o Backend

### Instalar dependências
```bash
cd backend
npm install
```

### Colocar sua chave secreta
Abra `backend/server.js` e troque na linha:
```js
const SECRET_KEY = 'SUA_CHAVE_SECRETA_AQUI';
```

### Rodar o servidor
```bash
npm start
```
O servidor vai rodar em `http://localhost:3000`

---

## 2️⃣ Configurar o Frontend

Abra `js/checkout.js` e troque a URL do backend:
```js
const BACKEND_URL = 'http://localhost:3000'; // Em produção, troque pela URL do servidor
```

---

## 3️⃣ Copiar as imagens

Copie a pasta `assets/` do seu projeto original para dentro dessa pasta.

---

## 4️⃣ Hospedar em produção

### Frontend
- Pode continuar no GitHub Pages ou Vercel
- Só lembre de atualizar `BACKEND_URL` no checkout.js

### Backend (escolha um)
- **Railway** → https://railway.app (grátis para começar)
- **Render** → https://render.com (grátis)
- **VPS** → DigitalOcean, Hostinger

---

## 5️⃣ Configurar Webhook na SkalePay

No painel da SkalePay, configure o webhook para:
```
https://SEU-BACKEND.com/api/webhook
```

Assim quando o cliente pagar, o sistema confirma automaticamente.

---

## ⚠️ Importante

- **NUNCA** coloque a chave secreta no frontend (HTML/JS)
- A chave secreta fica SOMENTE no `backend/server.js`
- A chave pública pode ser usada no frontend se necessário
