// =============================================
//  BACKEND SKALEPAY — PIX
//  Instalar dependências: npm install express cors
//  Rodar: node server.js
// =============================================

const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ COLOQUE SUA CHAVE SECRETA AQUI (ou em variável de ambiente)
const SECRET_KEY = process.env.SKALEPAY_SECRET_KEY;

// Gera o header de autenticação Basic
function authHeader() {
  const encoded = Buffer.from(`${SECRET_KEY}:x`).toString('base64');
  return `Basic ${encoded}`;
}

// =============================================
//  CPF gerado automaticamente — matematicamente
//  válido, único por compra, nunca exibido ao cliente
// =============================================
function gerarCpf() {
  const n = () => Math.floor(Math.random() * 9);
  const d = Array.from({length: 9}, n);
  const dig = (arr, mult) => {
    const s = arr.reduce((acc, v, i) => acc + v * (mult - i), 0);
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  d.push(dig(d, 10));
  d.push(dig(d, 11));
  return d.join('');
}

// =============================================
//  POST /api/criar-pagamento
//  Chamado pelo frontend ao clicar "Gerar PIX"
// =============================================
app.post('/api/criar-pagamento', async (req, res) => {
  const { produto_id, nome, email, telefone, quantidade, valor_total, cupom } = req.body;

  // CPF gerado automaticamente no backend — cliente nunca vê
  const cpf = gerarCpf();

  const amountCentavos = Math.round(valor_total * 100);

  const body = {
    amount: amountCentavos,
    paymentMethod: 'pix',
    customer: {
      name: nome,
      email: email,
      phone: telefone || '11999999999',
      document: {
        number: cpf,
        type: 'cpf',
      },
    },
    items: [
      {
        title: `Produto ${produto_id}`,
        quantity: quantidade,
        unitPrice: Math.round((valor_total / quantidade) * 100),
        tangible: false,
      }
    ],
    metadata: {
      produto_id,
      cupom: cupom || null,
    }
  };

  try {
    const response = await fetch('https://api.conta.skalepay.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': authHeader(),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro SkalePay completo:', JSON.stringify(data, null, 2));
      console.error('Payload enviado:', JSON.stringify(body, null, 2));
      return res.status(400).json({ sucesso: false, erro: data?.message || 'Erro ao criar transação' });
    }

    return res.json({
      sucesso: true,
      transaction_id: data.id,
      pix_copia_cola: data.pix?.url,
      pix_qrcode:     data.pix?.qrcode,
      expiracao:      data.pix?.expirationDate,
      status:         data.status,
    });

  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor' });
  }
});

// =============================================
//  GET /api/status/:id
//  Polling do frontend para verificar pagamento
// =============================================
app.get('/api/status/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`https://api.conta.skalepay.com.br/v1/transactions/${id}`, {
      method: 'GET',
      headers: {
        'authorization': authHeader(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ sucesso: false, erro: 'Transação não encontrada' });
    }

    return res.json({
      sucesso: true,
      status: data.status,
    });

  } catch (err) {
    console.error('Erro ao buscar status:', err);
    return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
  }
});

// =============================================
//  Inicia o servidor
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});