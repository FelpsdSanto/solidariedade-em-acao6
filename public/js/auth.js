const API_URL = 'http://localhost:3000';

async function register() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!nome || !email || !senha) {
    alert('Por favor, preencha todos os campos para cadastro.');
    return;
  }

  console.log('Enviando cadastro:', { nome, email, senha });

  try {
    const response = await fetch(`${API_URL}/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    const mensagem = document.getElementById('mensagem');

    if (response.ok) {
      mensagem.innerText = 'Usuário cadastrado com sucesso!';
      mensagem.style.color = 'green';
    } else {
      const erro = await response.text();
      mensagem.innerText = erro;
      mensagem.style.color = 'red';
    }
  } catch (err) {
    console.error('Erro ao cadastrar:', err);
    alert('Erro na conexão.');
  }
}

async function login() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) {
    alert('Por favor, preencha e-mail e senha para login.');
    return;
  }

  console.log('Tentando login:', { email, senha });

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const mensagem = document.getElementById('mensagem');

    if (response.ok) {
      mensagem.innerText = 'Login bem-sucedido!';
      mensagem.style.color = 'green';
      window.location.href = 'home.html';
    } else {
      const erro = await response.text();
      mensagem.innerText = erro;
      mensagem.style.color = 'red';
    }
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    alert('Erro na conexão.');
  }
}
