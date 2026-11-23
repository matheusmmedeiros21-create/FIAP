// AlertaJá: JavaScript puro, DOM e eventos.
// Os exemplos são fictícios e este site não envia dados a servidores.

// 1. Menu responsivo
const botaoMenu = document.getElementById('botao-menu');
const linksMenu = document.getElementById('links-menu');
if (botaoMenu && linksMenu) {
  botaoMenu.addEventListener('click', function () {
    const aberto = linksMenu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    botaoMenu.textContent = aberto ? '✕' : '☰';
  });
}

// 2. Classificação ilustrativa: não é uma escala oficial.
const ocorrencias = [
  { bairro: 'Penha', rua: 'Rua Exemplo A', nivel: 65, descricao: 'Acúmulo de água na via. Dado simulado.' },
  { bairro: 'Tatuapé', rua: 'Rua Exemplo B', nivel: 34, descricao: 'Ponto de alagamento. Dado simulado.' },
  { bairro: 'Itaquera', rua: 'Rua Exemplo C', nivel: 12, descricao: 'Acúmulo superficial de água. Dado simulado.' }
];
function classificarRisco(nivel) {
  if (nivel >= 50) return 'Alto';
  if (nivel >= 20) return 'Moderado';
  return 'Baixo';
}
function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// 3. Filtro por bairro com resultados no DOM
const listaOcorrencias = document.getElementById('lista-ocorrencias');
const filtroBairro = document.getElementById('filtro-bairro');
function exibirOcorrencias() {
  if (!listaOcorrencias) return;
  const consulta = filtroBairro ? normalizarTexto(filtroBairro.value) : '';
  const encontradas = ocorrencias.filter(item => normalizarTexto(item.bairro).includes(consulta));
  listaOcorrencias.replaceChildren();
  encontradas.forEach(item => {
    const cartao = document.createElement('article');
    cartao.className = 'cartao ocorrencia';
    const titulo = document.createElement('h3');
    titulo.textContent = item.bairro + ' — ' + item.rua;
    const risco = document.createElement('span');
    risco.className = 'risco ' + classificarRisco(item.nivel).toLowerCase();
    risco.textContent = 'Risco ' + classificarRisco(item.nivel);
    const descricao = document.createElement('p');
    descricao.textContent = item.descricao;
    const nivel = document.createElement('p');
    nivel.textContent = 'Nível informado: ' + item.nivel + ' cm';
    cartao.append(titulo, risco, descricao, nivel);
    listaOcorrencias.append(cartao);
  });
  if (encontradas.length === 0) {
    const aviso = document.createElement('p');
    aviso.className = 'aviso';
    aviso.textContent = 'Nenhum exemplo encontrado. Experimente Penha, Tatuapé ou Itaquera.';
    listaOcorrencias.append(aviso);
  }
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = encontradas.length + ' ocorrência(s) encontrada(s)';
}
if (listaOcorrencias) exibirOcorrencias();
if (filtroBairro) filtroBairro.addEventListener('input', exibirOcorrencias);
const limparFiltro = document.getElementById('limpar-filtro');
if (limparFiltro && filtroBairro) {
  limparFiltro.addEventListener('click', function () {
    filtroBairro.value = '';
    exibirOcorrencias();
    filtroBairro.focus();
  });
}
document.querySelectorAll('.pin-botao').forEach(pin => {
  pin.addEventListener('click', function () {
    if (!filtroBairro) return;
    filtroBairro.value = pin.dataset.bairro;
    exibirOcorrencias();
    filtroBairro.focus();
  });
});

// 4. Validação visual reutilizável
function erroNoCampo(campo, mensagem) {
  campo.classList.add('invalido');
  campo.setAttribute('aria-invalid', 'true');
  const feedback = document.createElement('small');
  feedback.className = 'erro-campo';
  feedback.textContent = mensagem;
  campo.insertAdjacentElement('afterend', feedback);
}
function limparErros(formulario) {
  formulario.querySelectorAll('.invalido').forEach(campo => {
    campo.classList.remove('invalido');
    campo.removeAttribute('aria-invalid');
  });
  formulario.querySelectorAll('.erro-campo').forEach(erro => erro.remove());
}
function mostrarMensagem(elemento, mensagem, sucesso) {
  elemento.className = 'mensagem ' + (sucesso ? 'sucesso' : 'erro');
  elemento.textContent = mensagem;
}

// 5. Registro demonstrativo de ocorrência
const formOcorrencia = document.getElementById('form-ocorrencia');
if (formOcorrencia) {
  formOcorrencia.addEventListener('submit', function (evento) {
    evento.preventDefault();
    limparErros(formOcorrencia);
    const bairro = document.getElementById('bairro');
    const rua = document.getElementById('rua');
    const nivel = document.getElementById('nivel');
    const descricao = document.getElementById('descricao');
    const resposta = document.getElementById('resposta-ocorrencia');
    let valido = true;
    if (bairro.value.trim().length < 2) { erroNoCampo(bairro, 'Informe um bairro válido.'); valido = false; }
    if (rua.value.trim().length < 3) { erroNoCampo(rua, 'Informe uma rua válida.'); valido = false; }
    const altura = Number(nivel.value);
    if (nivel.value.trim() === '' || !Number.isFinite(altura) || altura < 0 || altura > 500) {
      erroNoCampo(nivel, 'Informe uma altura entre 0 e 500 cm.'); valido = false;
    }
    if (descricao.value.trim().length < 10) { erroNoCampo(descricao, 'Descreva a situação em pelo menos 10 caracteres.'); valido = false; }
    if (!valido) { mostrarMensagem(resposta, 'Corrija os campos destacados.', false); formOcorrencia.querySelector('.invalido').focus(); return; }
    const resultado = document.getElementById('relato-criado');
    resultado.replaceChildren();
    const titulo = document.createElement('h3');
    titulo.textContent = 'Relato demonstrativo: ' + bairro.value.trim();
    const etiqueta = document.createElement('span');
    etiqueta.className = 'risco ' + classificarRisco(altura).toLowerCase();
    etiqueta.textContent = 'Risco ' + classificarRisco(altura);
    const local = document.createElement('p');
    local.textContent = 'Local: ' + rua.value.trim() + ' • Altura informada: ' + altura + ' cm';
    const texto = document.createElement('p');
    texto.textContent = descricao.value.trim();
    resultado.append(titulo, etiqueta, local, texto);
    resultado.className = 'cartao relato-resultado';
    mostrarMensagem(resposta, 'Relato de exemplo criado. Ele não é enviado nem salvo em servidor.', true);
    formOcorrencia.reset();
  });
  const novoRelato = document.getElementById('novo-relato');
  if (novoRelato) novoRelato.addEventListener('click', function () {
    formOcorrencia.reset();
    limparErros(formOcorrencia);
    document.getElementById('resposta-ocorrencia').textContent = '';
    const resultado = document.getElementById('relato-criado');
    resultado.replaceChildren();
    resultado.className = '';
    document.getElementById('bairro').focus();
  });
}

// 6. Contato: campos obrigatórios, e-mail e feedback
const formContato = document.getElementById('form-contato');
if (formContato) {
  formContato.addEventListener('submit', function (evento) {
    evento.preventDefault();
    limparErros(formContato);
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const assunto = document.getElementById('assunto');
    const mensagem = document.getElementById('mensagem');
    const resposta = document.getElementById('resposta-contato');
    let valido = true;
    if (nome.value.trim().length < 2) { erroNoCampo(nome, 'Informe seu nome.'); valido = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { erroNoCampo(email, 'Digite um e-mail válido.'); valido = false; }
    if (assunto.value.trim().length < 3) { erroNoCampo(assunto, 'Informe o assunto.'); valido = false; }
    if (mensagem.value.trim().length < 10) { erroNoCampo(mensagem, 'Escreva pelo menos 10 caracteres.'); valido = false; }
    if (!valido) { mostrarMensagem(resposta, 'Verifique os campos destacados antes de continuar.', false); formContato.querySelector('.invalido').focus(); return; }
    mostrarMensagem(resposta, 'Formulário validado com sucesso! Nenhuma mensagem foi enviada.', true);
    formContato.reset();
  });
}

// 7. FAQ com acordeão acessível
const perguntas = document.querySelectorAll('.pergunta-botao');
perguntas.forEach(botao => {
  botao.addEventListener('click', function () {
    const resposta = botao.nextElementSibling;
    const aberto = botao.getAttribute('aria-expanded') !== 'true';
    botao.setAttribute('aria-expanded', String(aberto));
    resposta.hidden = !aberto;
  });
});
