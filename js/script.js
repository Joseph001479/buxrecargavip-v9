/* ============================================
   🌓 TEMA CLARO/ESCURO
   ============================================ */
(function() {
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'claro') {
    document.body.classList.add('tema-claro');
    document.getElementById('themeIconSun').style.display = 'none';
    document.getElementById('themeIconMoon').style.display = 'inline-block';
  }
})();

function alternarTema() {
  const body = document.body;
  const iconSun  = document.getElementById('themeIconSun');
  const iconMoon = document.getElementById('themeIconMoon');
  if (body.classList.contains('tema-claro')) {
    body.classList.remove('tema-claro');
    iconSun.style.display  = 'inline-block';
    iconMoon.style.display = 'none';
    localStorage.setItem('tema', 'escuro');
  } else {
    body.classList.add('tema-claro');
    iconSun.style.display  = 'none';
    iconMoon.style.display = 'inline-block';
    localStorage.setItem('tema', 'claro');
  }
}

/* ============================================
   LOADING SCREEN
   ============================================ */
window.addEventListener('load', () => {
  const screen = document.getElementById('loadingScreen');
  const bar    = document.getElementById('lsBar');
  let prog = 0;
  const iv = setInterval(() => {
    prog += Math.random() * 16;
    if (prog >= 100) {
      prog = 100;
      clearInterval(iv);
      bar.style.width = '100%';
      setTimeout(() => screen.classList.add('oculto'), 380);
    } else {
      bar.style.width = prog + '%';
    }
  }, 110);
});

/* ============================================
   HEADER SCROLL
   ============================================ */
let lastScrollY = window.scrollY;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > 100) {
    if (currentScrollY > lastScrollY) {
      header.style.transform  = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease';
    } else {
      header.style.transform  = 'translateY(0)';
      header.style.transition = 'transform 0.3s ease';
    }
  } else {
    header.style.transform = 'translateY(0)';
  }
  header.classList.toggle('scrolled', currentScrollY > 10);
  lastScrollY = currentScrollY;
});

/* ============================================
   BUSCA FUNCIONAL
   ============================================ */
const produtos = [
  { id:'700',   nome:'700 Robux',    preco:'R$ 18,90',  img:'assets/700-1.png' },
  { id:'1200',  nome:'1.200 Robux',  preco:'R$ 29,90',  img:'assets/1200-min-1.png' },
  { id:'1700',  nome:'1.700 Robux',  preco:'R$ 44,90',  img:'assets/1700-min.png' },
  { id:'2100',  nome:'2.100 Robux',  preco:'R$ 59,90',  img:'assets/2100-min.png' },
  { id:'3600',  nome:'3.600 Robux',  preco:'R$ 99,90',  img:'assets/3600-min.png' },
  { id:'4500',  nome:'4.500 Robux',  preco:'R$ 129,90', img:'assets/4500-min.png' },
  { id:'7000',  nome:'7.000 Robux',  preco:'R$ 199,90', img:'assets/7000-min.png' },
  { id:'10000', nome:'10.000 Robux', preco:'R$ 299,90', img:'assets/10000-min.png' },
];

const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput?.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) { searchResults.classList.remove('aberto'); return; }
  const found = produtos.filter(p => p.nome.toLowerCase().includes(q));
  if (!found.length) { searchResults.classList.remove('aberto'); return; }
  searchResults.innerHTML = found.map(p => `
    <div class="search-result-item" onclick="flashComprar(event);abrirCheckout('${p.id}','${p.preco.replace('R$ ','')}','${p.nome}');searchResults.classList.remove('aberto');searchInput.value=''">
      <img src="${p.img}" alt="${p.nome}">
      <div>
        <div class="search-result-nome">${p.nome}</div>
        <div class="search-result-preco">${p.preco}</div>
      </div>
    </div>
  `).join('');
  searchResults.classList.add('aberto');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) searchResults?.classList.remove('aberto');
});

document.getElementById('menuToggle')?.addEventListener('click', () => {
  document.getElementById('searchWrap').classList.toggle('mobile-open');
});

/* ============================================
   FAQ
   ============================================ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.parentElement;
    const isOpen = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isOpen) item.classList.add('active');
  });
});

/* ============================================
   Fechar modal ao clicar fora
   ============================================ */
document.getElementById('modalCheckout')?.addEventListener('click', function(e) {
  if (e.target === this) fecharModal();
});

/* ============================================
   NOTIFICAÇÃO DE VENDAS
   ============================================ */
const nomesVenda    = ['Lucas S.','Marina C.','Pedro H.','Ana J.','Rafael M.','Julia B.','Bruno A.','Carla D.','Felipe R.','Gabriela L.'];
const produtosVenda = ['700 Robux','1.200 Robux','1.700 Robux','2.100 Robux','3.600 Robux','4.500 Robux'];
const temposVenda   = ['agora mesmo','há 30 seg','há 1 min','há 2 min','há 3 min'];

function mostrarNotificacao() {
  const notif = document.getElementById('notificacaoVenda');
  if (!notif) return;
  document.getElementById('notificacaoNome').textContent    = nomesVenda[Math.floor(Math.random() * nomesVenda.length)];
  document.getElementById('notificacaoProduto').textContent = produtosVenda[Math.floor(Math.random() * produtosVenda.length)];
  document.getElementById('notificacaoTempo').textContent   = temposVenda[Math.floor(Math.random() * temposVenda.length)];
  notif.classList.add('ativo');
  setTimeout(() => notif.classList.remove('ativo'), 4000);
}
setTimeout(mostrarNotificacao, 10000);
setInterval(() => setTimeout(mostrarNotificacao, Math.floor(Math.random() * 20000) + 25000), 45000);

/* ============================================
   COPIAR CUPOM
   ============================================ */
function copiarCupom() {
  const btn = document.querySelector('.cupom-btn');
  if (!btn) return;
  navigator.clipboard.writeText('PRIMEIRO5').then(() => {
    btn.textContent    = 'COPIADO!';
    btn.style.background = '#fff';
    btn.style.color    = 'var(--green)';
    setTimeout(() => { btn.textContent = 'COPIAR'; btn.style.background = ''; btn.style.color = ''; }, 2000);
  });
}

/* ============================================
   DEPOIMENTOS — loop infinito
   ============================================ */
(function() {
  const track = document.getElementById('depoimentosTrack');
  if (track) track.innerHTML += track.innerHTML;
})();

/* ============================================
   CHAT AO VIVO — WebSocket + ID persistente
   ⚠️ Troque pela URL do chat-admin quando hospedar
   ============================================ */
(function() {

  const CHAT_SERVER = 'http://localhost:4000';

  const respostas_auto = [
    'Um momento, já estou verificando isso para você! 😊',
    'Claro! Vou te ajudar. Pode me dar mais detalhes?',
    'Entendido! Estou verificando aqui...',
    'Perfeito! Aguarda um instante. 🙏',
    'Pode falar! Estou aqui para ajudar. 😊',
  ];

  // ── ID ÚNICO PERSISTENTE ──
  function gerarUID() {
    return 'uid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }
  function getUID() {
    let uid = localStorage.getItem('chat_uid');
    if (!uid) { uid = gerarUID(); localStorage.setItem('chat_uid', uid); }
    return uid;
  }
  function getNomeSalvo() {
    return localStorage.getItem('chat_nome') || null;
  }
  function salvarNome(nome) {
    localStorage.setItem('chat_nome', nome);
  }

  const clienteUID  = getUID();
  const nomeSalvo   = getNomeSalvo();

  let chatAberto  = false;
  let primeiraVez = !nomeSalvo; // Se já tem nome, não é primeira vez
  let nomeCliente = nomeSalvo;
  let socketChat  = null;
  let conectado   = false;

  // ── HTML DO CHAT ──
  const chatHTML = `
    <button class="chat-bubble-btn" id="chatBubbleBtn" onclick="toggleChat()" aria-label="Suporte ao vivo">
      <i class="fas fa-comment-dots chat-icon-msg"></i>
      <i class="fas fa-times chat-icon-x"></i>
      <span class="chat-bubble-badge"></span>
    </button>

    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div class="chat-header-avatar">R</div>
        <div class="chat-header-info">
          <div class="chat-header-nome">Suporte Robux VIP</div>
          <div class="chat-header-status" id="chatStatusLabel">Online agora</div>
        </div>
      </div>

      <div class="chat-msgs" id="chatMsgs"></div>

      <!-- Input de nome (só aparece na primeira vez) -->
      <div class="chat-nome-wrap" id="chatNomeWrap" style="display:none;">
        <input
          type="text"
          class="chat-nome-input"
          id="chatNomeInput"
          placeholder="Digite seu nome para começar..."
          maxlength="40"
          onkeydown="nomeKeyDown(event)"
          autocomplete="off"
        >
        <button class="chat-nome-btn" onclick="confirmarNome()">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>

      <!-- Input de mensagem -->
      <div class="chat-input-wrap" id="chatInputWrap" style="display:none;">
        <textarea
          class="chat-input"
          id="chatInputEl"
          placeholder="Digite sua mensagem..."
          rows="1"
          onkeydown="chatKeyDown(event)"
          oninput="autoResizeChat(this)"
        ></textarea>
        <button class="chat-send-btn" onclick="enviarMsgChat()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>

      <div class="chat-disclaimer">🔒 Atendimento seguro e privado</div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatHTML);

  // ── CONECTAR SOCKET ──
  function conectarSocket() {
    if (window.io) { iniciarSocket(); return; }
    const script  = document.createElement('script');
    script.src    = CHAT_SERVER + '/socket.io/socket.io.js';
    script.onload = iniciarSocket;
    script.onerror = () => { conectado = false; };
    document.head.appendChild(script);
  }

  function iniciarSocket() {
    try {
      socketChat = io(CHAT_SERVER, { transports: ['websocket', 'polling'] });

      socketChat.on('connect', () => {
        conectado = true;

        // Envia uid + nome para o servidor reconhecer o cliente
        socketChat.emit('cliente:init', {
          uid:    clienteUID,
          nome:   nomeCliente || 'Visitante',
          pagina: window.location.pathname
        });

        const status = document.getElementById('chatStatusLabel');
        if (status) { status.textContent = 'Online agora'; status.style.color = ''; }
      });

      socketChat.on('disconnect', () => {
        conectado = false;
      });

      // Histórico de mensagens ao reconectar
      socketChat.on('cliente:historico', (msgs) => {
        if (!msgs || !msgs.length) return;
        const container = document.getElementById('chatMsgs');
        if (!container) return;
        // Limpa msgs de boas-vindas e renderiza histórico real
        container.innerHTML = '';
        msgs.forEach(msg => {
          if (msg.de === 'cliente') adicionarMsgCliente(msg.texto, msg.hora);
          else adicionarMsgSuporte(escapeHtml(msg.texto), msg.hora);
        });
      });

      // Mensagem do suporte chegando
      socketChat.on('cliente:msg:suporte', (msg) => {
        esconderTyping();
        adicionarMsgSuporte(escapeHtml(msg.texto), msg.hora);
        if (!chatAberto) toggleChat();
      });

      // Admin digitando
      socketChat.on('cliente:suporte:digitando', () => {
        esconderTyping();
        mostrarTyping();
        clearTimeout(window._typingTimeout);
        window._typingTimeout = setTimeout(esconderTyping, 3000);
      });

    } catch(e) {
      conectado = false;
    }
  }

  conectarSocket();

  // ── TOGGLE CHAT ──
  window.toggleChat = function() {
    chatAberto = !chatAberto;
    const btn = document.getElementById('chatBubbleBtn');
    const win = document.getElementById('chatWindow');
    btn.classList.toggle('aberto', chatAberto);
    win.classList.toggle('aberto', chatAberto);

    if (chatAberto) {
      if (primeiraVez) {
        // Primeira vez — pede o nome
        primeiraVez = false;
        setTimeout(() => {
          adicionarMsgSuporte('Olá! 👋 Bem-vindo ao suporte da <strong>Robux VIP</strong>.<br>Como posso te ajudar hoje?');
          setTimeout(() => {
            adicionarMsgSuporte('Antes de começar, qual é o seu <strong>nome</strong>? 😊');
            document.getElementById('chatNomeWrap').style.display = 'flex';
            setTimeout(() => document.getElementById('chatNomeInput')?.focus(), 200);
          }, 800);
        }, 600);
      } else {
        // Já tem nome — libera input direto
        document.getElementById('chatNomeWrap').style.display  = 'none';
        document.getElementById('chatInputWrap').style.display = 'flex';
        setTimeout(() => document.getElementById('chatInputEl')?.focus(), 300);
      }
    }
  };

  // ── CONFIRMAR NOME ──
  window.confirmarNome = function() {
    const input = document.getElementById('chatNomeInput');
    const nome  = input.value.trim();

    if (!nome || nome.length < 2) {
      input.style.borderColor = 'var(--red)';
      setTimeout(() => input.style.borderColor = '', 1500);
      return;
    }

    nomeCliente = nome;
    salvarNome(nome); // Salva no localStorage

    // Esconde input de nome, mostra input de mensagem
    document.getElementById('chatNomeWrap').style.display  = 'none';
    document.getElementById('chatInputWrap').style.display = 'flex';

    // Mostra como msg do cliente
    adicionarMsgCliente(nome);

    // Avisa servidor do nome real
    if (conectado && socketChat) {
      socketChat.emit('cliente:nome', { uid: clienteUID, nome });
    }

    setTimeout(() => {
      adicionarMsgSuporte(`Prazer, <strong>${escapeHtml(nome)}</strong>! 😊 Como posso te ajudar?`);
      document.getElementById('chatInputEl')?.focus();
    }, 600);
  };

  window.nomeKeyDown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); confirmarNome(); }
  };

  window.chatKeyDown = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMsgChat(); }
  };

  window.autoResizeChat = function(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 90) + 'px';
  };

  // ── ENVIAR MENSAGEM ──
  window.enviarMsgChat = function() {
    const input = document.getElementById('chatInputEl');
    const texto = input.value.trim();
    if (!texto) return;

    adicionarMsgCliente(texto);
    input.value        = '';
    input.style.height = 'auto';

    if (conectado && socketChat) {
      socketChat.emit('cliente:msg', { uid: clienteUID, texto });
    } else {
      // Fallback offline
      mostrarTyping();
      setTimeout(() => {
        esconderTyping();
        adicionarMsgSuporte(respostas_auto[Math.floor(Math.random() * respostas_auto.length)]);
      }, 1800 + Math.random() * 1400);
    }
  };

  // ── FUNÇÕES DE MENSAGEM ──
  function adicionarMsgCliente(texto, hora) {
    const msgs = document.getElementById('chatMsgs');
    const div  = document.createElement('div');
    div.className = 'chat-msg cliente';
    div.innerHTML = `
      <div class="chat-msg-bubble">${escapeHtml(texto)}</div>
      <span class="chat-msg-hora">${hora || horaAtual()} ✓✓</span>
    `;
    msgs.appendChild(div);
    rolarParaBaixo();
  }

  function adicionarMsgSuporte(html, hora) {
    const msgs = document.getElementById('chatMsgs');
    const div  = document.createElement('div');
    div.className = 'chat-msg suporte';
    div.innerHTML = `
      <div class="chat-msg-bubble">${html}</div>
      <span class="chat-msg-hora">${hora || horaAtual()}</span>
    `;
    msgs.appendChild(div);
    rolarParaBaixo();
  }

  function mostrarTyping() {
    if (document.getElementById('chatTyping')) return;
    const msgs = document.getElementById('chatMsgs');
    const div  = document.createElement('div');
    div.className = 'chat-typing';
    div.id        = 'chatTyping';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(div);
    rolarParaBaixo();
  }

  function esconderTyping() { document.getElementById('chatTyping')?.remove(); }

  function rolarParaBaixo() {
    const msgs = document.getElementById('chatMsgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function horaAtual() {
    const d = new Date();
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  }

  function escapeHtml(t) {
    if (!t) return '';
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

})();

/* ============================================
   PIX FULLSCREEN
   ============================================ */
let _pixFsData = {};

function abrirPixFullscreen(dados) {
  _pixFsData = dados;
  document.getElementById('pixFullscreen')?.remove();

  const fs = document.createElement('div');
  fs.className = 'pix-fullscreen';
  fs.id        = 'pixFullscreen';

  fs.innerHTML = `
    <div class="pix-fs-header">
      <div class="pix-fs-logo">ROBUX<span>VIP</span></div>
      <button class="pix-fs-voltar" onclick="fecharPixFullscreen()">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
    </div>
    <div class="pix-fs-body" id="pixFsMain">
      <div class="pix-fs-resumo">
        <div class="pix-fs-resumo-header">RESUMO DO PEDIDO</div>
        <div class="pix-fs-resumo-body">
          <div class="pix-fs-produto-row">
            <img src="${dados.imgSrc}" alt="${dados.nomeProduto}" class="pix-fs-produto-img">
            <div>
              <div class="pix-fs-produto-nome">${dados.nomeProduto}</div>
              <div class="pix-fs-produto-entrega"><i class="fas fa-bolt"></i> Entrega automática via e-mail</div>
            </div>
          </div>
          <div class="pix-fs-info-row"><span>Quantidade</span><span>${dados.quantidade}x</span></div>
          <div class="pix-fs-info-row"><span>Valor unitário</span><span>R$ ${dados.precoUnitario}</span></div>
          ${dados.cupom ? `<div class="pix-fs-info-row"><span>Desconto (cupom)</span><span style="color:var(--green)">-5%</span></div>` : ''}
          <div class="pix-fs-info-row total"><span>TOTAL</span><span>R$ ${dados.total}</span></div>
          <div class="pix-fs-cliente">
            <div class="pix-fs-cliente-titulo">Dados do comprador</div>
            <div class="pix-fs-cliente-dado"><i class="fas fa-user"></i> ${dados.nome}</div>
            <div class="pix-fs-cliente-dado"><i class="fas fa-envelope"></i> ${dados.email}</div>
            <div class="pix-fs-cliente-dado"><i class="fas fa-phone"></i> ${dados.telMascarado || ''}</div>
          </div>
          <div class="pix-fs-selos">
            <span><i class="fas fa-lock"></i> SSL Criptografado</span>
            <span><i class="fas fa-shield-alt"></i> Compra Protegida</span>
            <span><i class="fas fa-undo"></i> Garantia 7 dias</span>
          </div>
        </div>
      </div>
      <div class="pix-fs-qr">
        <div class="pix-fs-qr-card">
          <div class="pix-fs-qr-titulo">PAGUE COM PIX</div>
          <div class="pix-fs-qr-sub">Escaneie o QR Code ou copie o código abaixo</div>
          <div class="pix-fs-qr-img-wrap">
            <img id="pixFsQrImg" src="${dados.qrImgUrl}" alt="QR Code PIX" class="pix-fs-qr-img">
          </div>
          <div class="pix-fs-timer">
            <i class="fas fa-clock"></i>
            Expira em <span class="pix-fs-timer-val" id="pixFsTimer">29:59</span>
          </div>
          <div class="pix-fs-status">
            <div class="pix-fs-pulse"></div>
            <p>Aguardando pagamento de <strong>R$ ${dados.total}</strong></p>
          </div>
        </div>
        <div class="pix-fs-copia">
          <div class="pix-fs-copia-header">PIX COPIA E COLA</div>
          <div class="pix-fs-copia-body">
            <p class="pix-fs-copia-code" id="pixFsCopiaCola">${dados.copiaCola}</p>
            <button class="pix-fs-copiar-btn" id="pixFsCopiarBtn" onclick="copiarPixFs()">
              <i class="fas fa-copy"></i> COPIAR CÓDIGO PIX
            </button>
          </div>
        </div>
        <div class="pix-fs-passos">
          <div class="pix-fs-passos-titulo">Como pagar</div>
          <div class="pix-fs-passo"><div class="pix-fs-passo-num">1</div><span>Abra o app do seu banco e acesse a área <strong>PIX</strong></span></div>
          <div class="pix-fs-passo"><div class="pix-fs-passo-num">2</div><span>Escolha <strong>"Pagar com QR Code"</strong> ou <strong>"Copia e Cola"</strong></span></div>
          <div class="pix-fs-passo"><div class="pix-fs-passo-num">3</div><span>Confirme o valor de <strong>R$ ${dados.total}</strong> e finalize</span></div>
          <div class="pix-fs-passo"><div class="pix-fs-passo-num">4</div><span>Seu gift card chega em <strong>${dados.email}</strong> em segundos ✅</span></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(fs);
  document.body.style.overflow = 'hidden';
  iniciarTimerFs();
  iniciarPollingFs();
}

function fecharPixFullscreen() {
  document.getElementById('pixFullscreen')?.remove();
  document.body.style.overflow = '';
  if (window._pollingFs) clearInterval(window._pollingFs);
  if (window._timerFs)   clearInterval(window._timerFs);
}

function iniciarTimerFs() {
  let seg = 29 * 60 + 59;
  if (window._timerFs) clearInterval(window._timerFs);
  window._timerFs = setInterval(() => {
    const el = document.getElementById('pixFsTimer');
    if (!el) { clearInterval(window._timerFs); return; }
    if (seg <= 0) { clearInterval(window._timerFs); return; }
    seg--;
    const m = String(Math.floor(seg / 60)).padStart(2,'0');
    const s = String(seg % 60).padStart(2,'0');
    el.textContent = m + ':' + s;
    if (seg < 60) el.style.color = 'var(--red)';
  }, 1000);
}

function iniciarPollingFs() {
  if (!window._transactionIdFs) return;
  if (window._pollingFs) clearInterval(window._pollingFs);
  window._pollingFs = setInterval(async () => {
    try {
      const r    = await fetch(BACKEND_URL + '/api/status/' + window._transactionIdFs);
      const data = await r.json();
      if (data.status === 'paid' || data.status === 'approved') {
        clearInterval(window._pollingFs);
        if (window._timerFs) clearInterval(window._timerFs);
        mostrarSucessoFs();
      }
    } catch(e) {}
  }, 5000);
  setTimeout(() => { if (window._pollingFs) clearInterval(window._pollingFs); }, 35 * 60 * 1000);
}

function mostrarSucessoFs() {
  const main = document.getElementById('pixFsMain');
  if (!main) return;
  main.innerHTML = `
    <div class="pix-fs-sucesso" style="grid-column:1/-1">
      <div class="pix-fs-ok-ring"><i class="fas fa-check"></i></div>
      <div class="pix-fs-ok-title">PAGAMENTO CONFIRMADO! 🎉</div>
      <p class="pix-fs-ok-sub">Seu gift card foi enviado com sucesso.<br>Verifique sua caixa de entrada e a pasta de spam.</p>
      <div class="pix-fs-ok-email"><i class="fas fa-envelope"></i> Gift card enviado para <strong>${_pixFsData.email || ''}</strong></div>
      <button class="pix-fs-fechar" onclick="fecharPixFullscreen();location.reload()">VOLTAR À LOJA</button>
    </div>
  `;
}

function copiarPixFs() {
  const texto = document.getElementById('pixFsCopiaCola')?.textContent;
  if (!texto) return;
  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.getElementById('pixFsCopiarBtn');
    if (!btn) return;
    btn.innerHTML    = '<i class="fas fa-check"></i> COPIADO!';
    btn.style.background = 'var(--gold)';
    btn.style.color  = 'var(--black)';
    setTimeout(() => {
      btn.innerHTML    = '<i class="fas fa-copy"></i> COPIAR CÓDIGO PIX';
      btn.style.background = '';
      btn.style.color  = '';
    }, 2500);
  });
}