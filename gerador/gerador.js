'use strict';

/**
 * =============================================================
 * 🧙‍♂️ gerador.js • Petropolitan Lab – PBQE-C™
 * -------------------------------------------------------------
 * Gerador simples de módulos.
 * 
 * Ele recebe um arquivo JSON como parâmetro:
 * node gerador.js moduloUsuarios.json
 *
 * O JSON contém:
 *  - caminho (string)        → caminho completo da pasta onde criar o arquivo
 *  - arquivo (string)        → nome do arquivo, ex: usuariosModel.js
 *  - conteudo (string)       → conteúdo inteiro do arquivo
 *  - dependencias (array)    → ["axios", "jsonwebtoken"] (opcional)
 *
 * O gerador:
 *  1) Lê o JSON
 *  2) Cria as pastas necessárias
 *  3) Cria o arquivo
 *  4) Instala dependências, se existirem
 * =============================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// -------------------------------------------------------------
// Verifica se o arquivo JSON foi informado
// -------------------------------------------------------------
if (process.argv.length < 3) {
  console.error('❌ Arquivo JSON não informado.');
  console.error('Execute: node gerador.js nomeDoArquivo.json');
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

// -------------------------------------------------------------
// O JSON pode ser um objeto único ou um array de objetos
// padroniza para sempre trabalhar como array
// -------------------------------------------------------------
const itens = Array.isArray(dados) ? dados : [dados];

console.log('============================================================');
console.log('🧙‍♂️  Iniciando Gerador PBQE-C (modo Maria Fumaça)');
console.log('============================================================\n');

// -------------------------------------------------------------
// Função: garante que a pasta exista
// -------------------------------------------------------------
function garantirPasta(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Pasta criada: ${dirPath}`);
  }
}

// -------------------------------------------------------------
// Função: escreve o arquivo
// -------------------------------------------------------------
function criarArquivo(caminhoArquivo, conteudo) {
  fs.writeFileSync(caminhoArquivo, conteudo, 'utf8');
  console.log(`📄 Arquivo criado: ${caminhoArquivo}`);
}

// -------------------------------------------------------------
// Função: instala dependências
// -------------------------------------------------------------
function instalarDependencias(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return;

  console.log('\n📦 Instalando dependências...');
  try {
    execSync(`npm install ${lista.join(' ')}`, { stdio: 'inherit' });
    console.log('✔ Dependências instaladas com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao instalar dependências:');
    console.error(err.message);
  }
}

// -------------------------------------------------------------
// PROCESSA CADA ITEM DO JSON
// -------------------------------------------------------------
for (const item of itens) {
  const { caminho, arquivo, conteudo, dependencias } = item;

  if (!caminho || !arquivo || !conteudo) {
    console.error('❌ Item inválido no JSON. Deve ter: caminho, arquivo, conteudo.');
    continue;
  }

  console.log('\n------------------------------------------------------------');
  console.log(`📦 Processando item: ${arquivo}`);

  // Criar pasta
  garantirPasta(caminho);

  // Criar arquivo
  const caminhoCompleto = path.join(caminho, arquivo);
  criarArquivo(caminhoCompleto, conteudo);

  // Instalar dependências (se existirem)
  if (dependencias && dependencias.length > 0) {
    instalarDependencias(dependencias);
  }
}

console.log('\n============================================================');
console.log('🏁 Gerador PBQE-C finalizado com sucesso.');
console.log('============================================================\n');
