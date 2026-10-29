// Acalu Sereno · portfólio
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entradas: uma vez, quando a seção aparece
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }
}, { rootMargin: '0px 0px 15% 0px', threshold: 0 });
document.querySelectorAll('[data-reveal], .strip').forEach((el) => io.observe(el));

// Filtros dos trabalhos
const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach((btn) => btn.addEventListener('click', () => {
  const kind = btn.dataset.filter;
  filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  document.querySelectorAll('.strip').forEach((strip) => {
    strip.hidden = kind !== 'todos' && strip.dataset.kind !== kind;
    if (!strip.hidden) strip.classList.add('is-in');
  });
}));

// O e‑mail escolhido percorre o fluxo
const mails = {
  cotacao: {
    say1: 'Primeiro, chega um e‑mail.',
    call1: `<div class="mail__meta"><span><b>Marta Lopes</b>, Viagens Exemplo</span><span>Recebido às 03:12</span><span>Assunto: Cotação para 12 quartos em maio</span></div>
      <div class="mail__body"><p>Bom dia. Precisamos de 12 quartos duplos no Hotel Exemplo Algarve, de 14 a 17 de maio, para um grupo de clientes. Podem enviar a disponibilidade e os valores?</p></div>`,
    resp1: tags([['Remetente', 'agência'], ['Intenção', 'pedido de cotação'], ['Hotel', 'Hotel Exemplo Algarve']]),
    say2: 'Depois, consulta a base do hotel e a disponibilidade.',
    call2: '<code>disponibilidade(hotel: Exemplo Algarve, quartos: 12 duplos, de 14/05 a 17/05)</code>',
    resp2: tags([['Disponível', '12 duplos nas 3 noites'], ['Da base do hotel', 'regras para grupos']]),
    say3: 'Por fim, a resposta sai sozinha.',
    resp3: `<div class="mail__meta"><span>Para: <b>Marta Lopes</b></span><span>Assunto: Re: Cotação para 12 quartos em maio</span></div>
      <div class="mail__body"><p>Olá, Marta. Temos 12 quartos duplos disponíveis no Hotel Exemplo Algarve de 14 a 17 de maio. Seguem os valores para o grupo, com as condições de reserva.</p><p>Se as datas mudarem, responda a este e‑mail e refazemos a cotação.</p></div>
      <p class="mail__foot">Enviado às 03:13, sem ninguém precisar revisar.</p>`,
    path: ['webhook', 'remetente', 'pre', 'intencao', 'cotacao', 'juntar', 'rascunho', 'disponibilidade', 'enviar'],
    edges: ['webhook-remetente', 'remetente-pre', 'pre-intencao', 'intencao-cotacao', 'cotacao-juntar', 'juntar-rascunho', 'rascunho-disponibilidade', 'rascunho-enviar'],
  },
  info: {
    say1: 'Primeiro, chega um e‑mail.',
    call1: `<div class="mail__meta"><span><b>Rui Fernandes</b>, hóspede</span><span>Recebido às 23:47</span><span>Assunto: Estacionamento</span></div>
      <div class="mail__body"><p>Olá. Chego ao Hotel Exemplo Porto no sábado à noite. O hotel tem estacionamento? Posso deixar o carro até domingo à tarde?</p></div>`,
    resp1: tags([['Remetente', 'cliente individual'], ['Intenção', 'pedido de informação'], ['Hotel', 'Hotel Exemplo Porto']]),
    say2: 'Depois, procura a resposta na base do hotel.',
    call2: '<code>base_do_hotel(hotel: Exemplo Porto, perguntas: estacionamento, horário de saída)</code>',
    resp2: tags([['Estacionamento', 'garagem própria, pago por dia'], ['Saída', 'até às 12h, com tolerância']]),
    say3: 'Por fim, a resposta sai sozinha.',
    resp3: `<div class="mail__meta"><span>Para: <b>Rui Fernandes</b></span><span>Assunto: Re: Estacionamento</span></div>
      <div class="mail__body"><p>Olá, Rui. Sim, o Hotel Exemplo Porto tem garagem própria, com valor cobrado por dia. A saída é até às 12h de domingo, e o carro pode ficar na garagem até à tarde.</p><p>Boa viagem, e até sábado.</p></div>
      <p class="mail__foot">Enviado às 23:48, sem ninguém precisar revisar.</p>`,
    path: ['webhook', 'remetente', 'pre', 'intencao', 'base', 'juntar', 'rascunho', 'enviar'],
    edges: ['webhook-remetente', 'remetente-pre', 'pre-intencao', 'intencao-base', 'base-juntar', 'juntar-rascunho', 'rascunho-enviar'],
  },
  corp: {
    say1: 'Primeiro, chega um e‑mail.',
    call1: `<div class="mail__meta"><span><b>Ana Ribeiro</b>, Empresa Exemplo</span><span>Recebido às 08:05</span><span>Assunto: Encontro de equipa em junho</span></div>
      <div class="mail__body"><p>Somos 40 pessoas e queremos fazer um encontro de dois dias em junho, com sala de reuniões e jantar no primeiro dia. Que hotéis do grupo conseguem receber-nos?</p></div>`,
    resp1: tags([['Remetente', 'corporativo'], ['Intenção', 'evento com alojamento'], ['Rota', 'resumo para a equipe']]),
    say2: 'Depois, resume o pedido para a equipe comercial.',
    call2: '<code>resumir(e‑mail, campos: pessoas, datas, espaços, refeições, pergunta)</code>',
    resp2: tags([['Pessoas', '40'], ['Quando', '2 dias em junho'], ['Precisa de', 'sala de reuniões e jantar no 1º dia']]),
    say3: 'Por fim, o resumo chega à equipe.',
    resp3: `<div class="mail__meta"><span>Para: <b>equipe comercial</b></span><span>Assunto: Pedido corporativo, Empresa Exemplo</span></div>
      <div class="mail__body"><p>Ana Ribeiro, da Empresa Exemplo, quer um encontro de 40 pessoas por dois dias em junho, com sala de reuniões e jantar no primeiro dia. Pergunta quais hotéis do grupo conseguem receber o grupo.</p><p>E‑mail original em anexo.</p></div>
      <p class="mail__foot">Encaminhado às 08:05, um minuto depois de chegar.</p>`,
    path: ['webhook', 'remetente', 'int_corp', 'resumo', 'encaminhar'],
    edges: ['webhook-remetente', 'remetente-int_corp', 'int_corp-resumo', 'resumo-encaminhar'],
  },
};

function tags(rows) {
  return `<dl class="tags">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
}

const exchanges = document.querySelector('.exchanges');
const panels = Object.fromEntries([...document.querySelectorAll('[data-panel]')].map((el) => [el.dataset.panel, el]));

function lightPath(mail) {
  document.querySelectorAll('.n8n [data-node]').forEach((g) => {
    const i = mail.path.indexOf(g.dataset.node);
    g.classList.toggle('is-on', i >= 0);
    g.style.setProperty('--n', Math.max(i, 0));
  });
  document.querySelectorAll('.n8n [data-edge]').forEach((p) => {
    const i = mail.edges.indexOf(p.dataset.edge);
    p.classList.toggle('is-on', i >= 0);
    p.style.setProperty('--n', Math.max(i, 0) + 0.5);
  });
}

function showMail(key) {
  const mail = mails[key];
  const swap = () => {
    for (const [name, el] of Object.entries(panels)) if (mail[name]) el.innerHTML = mail[name];
    exchanges.classList.remove('is-swapping');
  };
  if (reduce) swap();
  else { exchanges.classList.add('is-swapping'); setTimeout(swap, 220); }
  lightPath(mail);
}

const mailButtons = document.querySelectorAll('[data-mail]');
mailButtons.forEach((btn) => btn.addEventListener('click', () => {
  mailButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  showMail(btn.dataset.mail);
}));
lightPath(mails.cotacao);

// A filmagem só roda enquanto está na tela, e nunca com movimento reduzido.
// O cinejornal tem 1:29; as telefonistas aparecem só entre 31 s e 46 s, então o loop fica nesse trecho.
const film = document.querySelector('.flow__aside video');
const LOOP_START = 31, LOOP_END = 46;
if (film) {
  film.addEventListener('loadedmetadata', () => { film.currentTime = LOOP_START; });
  film.addEventListener('timeupdate', () => {
    const inLoop = film.currentTime >= LOOP_START - 0.5 && film.currentTime < LOOP_END;
    film.classList.toggle('is-ready', inLoop);
    if (!inLoop) film.currentTime = LOOP_START;
  });
  // Se o navegador parar no fim do arquivo, volta ao começo do trecho
  film.addEventListener('ended', () => { film.currentTime = LOOP_START; if (!reduce) film.play().catch(() => {}); });
}
if (film && !reduce) {
  new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) film.play().catch(() => {});
      else film.pause();
    }
  }, { threshold: 0.2 }).observe(film);
}

// Trajetória: a linha ativa troca a imagem
const rows = [...document.querySelectorAll('.row')];
const pics = document.querySelectorAll('.path__frame img');
const caption = document.querySelector('[data-caption]');

function activate(row) {
  if (row.classList.contains('is-active')) return;
  rows.forEach((r) => {
    const on = r === row;
    r.classList.toggle('is-active', on);
    r.querySelector('.row__head').setAttribute('aria-expanded', String(on));
  });
  pics.forEach((img) => img.classList.toggle('is-on', img.dataset.pic === row.dataset.pic));
  caption.textContent = row.dataset.caption;
}

const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
rows.forEach((row) => {
  const head = row.querySelector('.row__head');
  head.addEventListener('click', () => activate(row));
  head.addEventListener('focus', () => activate(row));
  if (fine) head.addEventListener('mouseenter', () => activate(row));
});

// No scroll, a linha mais perto do meio da tela fica ativa
const rowIO = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) activate(e.target);
}, { rootMargin: '-48% 0px -48% 0px' });
rows.forEach((r) => rowIO.observe(r));
