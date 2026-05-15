// ⚠️ TROQUE PELA URL DO SEU BACKEND QUANDO HOSPEDAR
const BACKEND_URL = 'http://localhost:3000';

let produtoAtual = null;
let precoUnitario = 0;
let quantidadeAtual = 1;
let cupomAplicado = false;
let descontoCupom = 0;
let transactionId = null;
let pollingInterval = null;
let timerInterval = null;

/* =============================================
   RIPPLE DOURADO — ao clicar em Comprar Agora
   ============================================= */
function flashComprar(e) {
  const btn = e.currentTarget;

  btn.querySelectorAll('.ripple-gold').forEach(r => r.remove());

  const ripple = document.createElement('span');
  ripple.className = 'ripple-gold';

  const rect = btn.getBoundingClientRect();
  const size = Math.max(btn.offsetWidth, btn.offsetHeight) * 2.5;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
  `;

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 750);
}

/* =============================================
   ABRIR CHECKOUT
   ============================================= */
function abrirCheckout(produtoId, preco, nome) {
  produtoAtual = produtoId;
  precoUnitario = parseFloat(preco);
  quantidadeAtual = 1;
  cupomAplicado = false;
  descontoCupom = 0;

  let imgSrc = 'assets/' + produtoId + '-min.png';
  if (produtoId === '700') imgSrc = 'assets/700-1.png';
  document.getElementById('modalProdutoImg').src = imgSrc;

  document.getElementById('modalProdutoNome').textContent = nome;
  document.getElementById('modalProdutoPreco').textContent = 'R$ ' + precoUnitario.toFixed(2).replace('.', ',');
  document.getElementById('inputNome').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputTelefone').value = '';
  document.getElementById('inputQtd').value = 1;
  document.getElementById('inputCupom').value = '';
  document.getElementById('cupomMsg').textContent = '';
  document.getElementById('cupomMsg').className = 'checkout-cupom-msg';

  const precosOriginais = {
    '700': '27,90',
    '1200': '39,90',
    '1700': '59,90',
    '2100': '79,90',
    '3600': '129,90',
    '4500': '159,90',
    '7000': '249,90',
    '10000': '349,90'
  };
  const comparativoEl = document.getElementById('comparativoValor');
  if (comparativoEl && precosOriginais[produtoId]) {
    comparativoEl.textContent = 'R$ ' + precosOriginais[produtoId];
  }

  atualizarTotal();
  atualizarBotoesQtd();
  mostrarStep('step1');

  setTimeout(() => {
    document.getElementById('modalCheckout').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }, 350);
}

function fecharModal() {
  document.getElementById('modalCheckout').style.display = 'none';
  document.body.style.overflow = '';
  if (pollingInterval) clearInterval(pollingInterval);
  if (timerInterval) clearInterval(timerInterval);
  pollingInterval = null; timerInterval = null; transactionId = null;
}

function mostrarStep(step) {
  ['step1','stepPix','stepOndas','step2','step3'].forEach(s => {
    document.getElementById(s).style.display = s === step ? 'block' : 'none';
  });
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =============================================
   MÁSCARA DE TELEFONE
   ============================================= */
function mascaraTelefone(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.length <= 10) {
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
  }
  input.value = v;
}

/* =============================================
   CUPOM DE DESCONTO
   ============================================= */
function aplicarCupom() {
  const cupomInput = document.getElementById('inputCupom');
  const cupomMsg = document.getElementById('cupomMsg');
  const cupom = cupomInput.value.trim().toUpperCase();

  if (cupom === 'PRIMEIRO5') {
    if (!cupomAplicado) {
      cupomAplicado = true;
      descontoCupom = 0.05;
      cupomMsg.textContent = '✅ Cupom aplicado! 5% de desconto.';
      cupomMsg.className = 'checkout-cupom-msg sucesso';
      atualizarTotal();
    } else {
      cupomMsg.textContent = '⚠️ Cupom já aplicado.';
      cupomMsg.className = 'checkout-cupom-msg erro';
    }
  } else {
    cupomMsg.textContent = '❌ Cupom inválido.';
    cupomMsg.className = 'checkout-cupom-msg erro';
  }
}

/* =============================================
   SELETOR DE QUANTIDADE
   ============================================= */
function alterarQtd(delta) {
  quantidadeAtual += delta;
  if (quantidadeAtual < 1) quantidadeAtual = 1;
  if (quantidadeAtual > 10) quantidadeAtual = 10;

  document.getElementById('inputQtd').value = quantidadeAtual;
  atualizarTotal();
  atualizarBotoesQtd();
}

function atualizarTotal() {
  let total = precoUnitario * quantidadeAtual;
  if (cupomAplicado) {
    total = total * (1 - descontoCupom);
  }
  document.getElementById('modalTotalPreco').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function atualizarBotoesQtd() {
  const btnMinus = document.getElementById('qtyMinus');
  const btnPlus = document.getElementById('qtyPlus');
  btnMinus.disabled = quantidadeAtual <= 1;
  btnPlus.disabled = quantidadeAtual >= 10;
}

/* =============================================
   ANIMAÇÃO ETAPAS + ONDAS — ao clicar Gerar PIX
   ============================================= */
function mostrarAnimacaoPix(callback) {
  mostrarStep('stepPix');

  const dots   = document.querySelectorAll('.pix-step-dot');
  const labels = document.querySelectorAll('.pix-step-label');

  dots.forEach(d => { d.className = 'pix-step-dot'; d.innerHTML = ''; });
  labels.forEach(l => { l.className = 'pix-step-label'; });

  let s = 0;
  const iv = setInterval(() => {
    if (s > 0) {
      dots[s-1].className = 'pix-step-dot done';
      dots[s-1].innerHTML = '<i class="fas fa-check"></i>';
      labels[s-1].className = 'pix-step-label done';
    }
    if (s < dots.length) {
      dots[s].className = 'pix-step-dot active';
      labels[s].className = 'pix-step-label active';
    } else {
      clearInterval(iv);
      setTimeout(() => {
        mostrarStep('stepOndas');
        setTimeout(callback, 1500);
      }, 400);
    }
    s++;
  }, 900);
}

/* =============================================
   GERAR PIX
   ============================================= */
async function gerarPix() {
  const nome     = document.getElementById('inputNome').value.trim();
  const email    = document.getElementById('inputEmail').value.trim();
  const telefone = document.getElementById('inputTelefone').value.replace(/\D/g, '');

  if (!nome || nome.length < 3) { alert('Informe seu nome completo.'); return; }
  if (!validarEmail(email)) { alert('Informe um e-mail válido.'); return; }
  if (telefone.length < 10) { alert('Informe um telefone válido com DDD.'); return; }

  let total = precoUnitario * quantidadeAtual;
  if (cupomAplicado) {
    total = total * (1 - descontoCupom);
  }
  total = Math.round(total * 100) / 100;

  mostrarAnimacaoPix(async () => {
    try {
      const response = await fetch(BACKEND_URL + '/api/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto_id: produtoAtual,
          nome,
          email,
          telefone,
          quantidade: quantidadeAtual,
          valor_total: total,
          cupom: cupomAplicado ? 'PRIMEIRO5' : null
        }),
      });
      const data = await response.json();
      if (!data.sucesso) throw new Error(data.erro || 'Erro ao gerar PIX');

      transactionId = data.transaction_id;
      window._transactionIdFs = data.transaction_id;

      const copiaCola = data.pix_copia_cola || data.pix_qrcode || '';
      const qrImgUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(copiaCola);

      const totalFormatado = total.toFixed(2).replace('.', ',');

      const nomeProduto = document.getElementById('modalProdutoNome')?.textContent || '';
      let imgSrc = 'assets/' + produtoAtual + '-min.png';
      if (produtoAtual === '700') imgSrc = 'assets/700-1.png';

      // Fecha o modal de checkout
      fecharModal();

      // Abre a tela fullscreen do PIX
      abrirPixFullscreen({
        nomeProduto,
        imgSrc,
        quantidade: quantidadeAtual,
        precoUnitario: precoUnitario.toFixed(2).replace('.', ','),
        total: totalFormatado,
        cupom: cupomAplicado,
        nome,
        email,
        copiaCola,
        qrImgUrl,
      });

    } catch (err) {
      alert('Erro: ' + err.message);
      mostrarStep('step1');
      document.getElementById('modalCheckout').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
}

function copiarPix() {
  const texto = document.getElementById('pixCopiaCola')?.textContent;
  if (!texto) return;
  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.querySelector('.checkout-btn-copy');
    if (!btn) return;
    btn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--black)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-copy"></i> COPIAR CÓDIGO PIX';
      btn.style.background = '';
      btn.style.color = '';
    }, 2500);
  }).catch(() => {
    alert('Não foi possível copiar. Copie manualmente.');
  });
}