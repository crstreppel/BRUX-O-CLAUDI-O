'use strict';

/**
 * =============================================================
 * 🧙‍♂️ gerador.js • PBQE-C Lab – Versão com Arquivamento de JSON
 * -------------------------------------------------------------
 * ✔ Cria pastas
 * ✔ Cria arquivos
 * ✔ Instala dependências (opcional)
 * ✔ E AO FINAL move o JSON executado para /jsons
 * =============================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// -------------------------------------------------------------
// Verifica se recebeu o JSON como parâmetro
// -------------------------------------------------------------
if (process.argv.length < 3) {
  console.error('❌ Arquivo JSON não informado.');
  console.error('Execute: node gerador.js nome.json');
  process.exit(1);
}

const jsonPath = process.argv[2];

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Arquivo JSON não encontrado: ${jsonPath}`);
  process.exit(1);
}

// -------------------------------------------------------------
// Lê e interpreta o JSON
// -------------------------------------------------------------
let dados;

try {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  dados = JSON.parse(raw);
} catch (err) {
  console.error('❌ Erro ao ler ou interpretar o JSON:');
  console.error(err.message);
  process.exit(1);
}

// Padroniza: sempre array
const itens = Array.isArray(dados) ? dados : [dados];

console.log('============================================================');
console.log('🧙‍♂️ Iniciando Gerador PBQE-C (modo Maria Fumaça)');
console.log('============================================================\n');

// -------------------------------------------------------------
// Garante pasta
// -------------------------------------------------------------
function garantirPasta(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Pasta criada: ${dirPath}`);
  }
}

// -------------------------------------------------------------
// Cria o arquivo
// -------------------------------------------------------------
function criarArquivo(caminhoArquivo, conteudo) {
  fs.writeFileSync(caminhoArquivo, conteudo, 'utf8');
  console.log(`📄 Arquivo criado: ${caminhoArquivo}`);
}

// -------------------------------------------------------------
// Instala dependências
// -------------------------------------------------------------
function instalarDependencias(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return;

  console.log('\n📦 Instalando dependências...');
  try {
    execSync(`npm install ${lista.join(' ')}`, { stdio: 'inherit' });
    console.log('✔ Dependências instaladas.');
  } catch (err) {
    console.error('❌ Erro ao instalar dependências:');
    console.error(err.message);
  }
}

// -------------------------------------------------------------
// PROCESSA CADA ITEM
// -------------------------------------------------------------
for (const item of itens) {
  const { caminho, arquivo, conteudo, dependencias } = item;

  if (!caminho || !arquivo || conteudo === undefined) {
    console.error('❌ Item inválido no JSON. Deve ter: caminho, arquivo, conteudo.');
    continue;
  }

  console.log('\n------------------------------------------------------------');
  console.log(`📦 Processando item: ${arquivo}`);

  garantirPasta(caminho);

  const caminhoCompleto = path.join(caminho, arquivo);
  criarArquivo(caminhoCompleto, conteudo);

  if (dependencias && dependencias.length > 0) {
    instalarDependencias(dependencias);
  }
}

// -------------------------------------------------------------
// Move o JSON executado para /jsons
// -------------------------------------------------------------
console.log('\n📚 Arquivando JSON executado...');

const pastaJsons = path.join(__dirname, 'jsons');

try {
  // garante pasta jsons
  if (!fs.existsSync(pastaJsons)) {
    fs.mkdirSync(pastaJsons, { recursive: true });
    console.log(`📁 Pasta criada: ${pastaJsons}`);
  }

  const nomeJson = path.basename(jsonPath);
  const destino = path.join(pastaJsons, nomeJson);

  fs.renameSync(jsonPath, destino);
  console.log(`📦 JSON movido para: ${destino}`);

} catch (err) {
  console.error('❌ Erro ao mover JSON para pasta jsons:', err.message);
}

console.log('\n============================================================');
console.log('🏁 Gerador PBQE-C finalizado.');
console.log('============================================================\n');
