
// PBQE-C Gerador V4 – Modo Sentinela Supremo™
// Monitora a pasta Downloads, processa JSONs automaticamente e registra logs.
// Compatível com JSONs no formato: [ { "caminho": "...", "arquivo": "...", "conteudo": "..." }, ... ]

const fs = require("fs");
const path = require("path");

const GERADOR_ROOT = __dirname;
const DOWNLOADS_DIR = path.join(process.env.USERPROFILE || "", "Downloads");
const JSONS_HISTORY_DIR = path.join(GERADOR_ROOT, "jsons");
const LOG_DIR = path.join(GERADOR_ROOT, "pbqe_logs");
const BACKUP_DIR = path.join(GERADOR_ROOT, "pbqe_backups");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(JSONS_HISTORY_DIR);
ensureDir(LOG_DIR);
ensureDir(BACKUP_DIR);

const LOG_FILE = path.join(LOG_DIR, "gerador_v4.log");

function log(msg) {
  const linha = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, linha, "utf-8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listarJSONsDownloads() {
  if (!DOWNLOADS_DIR || !fs.existsSync(DOWNLOADS_DIR)) {
    console.log("❌ Pasta Downloads não encontrada.");
    log("ERRO: Pasta Downloads não encontrada.");
    return [];
  }

  return fs
    .readdirSync(DOWNLOADS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".json"));
}

function backupIfExists(destinoFinal) {
  if (!fs.existsSync(destinoFinal)) return;

  const relPath = path.relative(GERADOR_ROOT, destinoFinal);
  const safeRel = relPath.replace(/[\\\/:]/g, "__");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `${stamp}__${safeRel}`;
  const backupPath = path.join(BACKUP_DIR, backupName);

  fs.copyFileSync(destinoFinal, backupPath);
  log(`Backup criado: ${backupPath}`);
}

function processarJson(nomeArquivo) {
  const fullPath = path.join(DOWNLOADS_DIR, nomeArquivo);
  log(`Iniciando processamento do JSON: ${nomeArquivo}`);

  let conteudoRaw;
  try {
    conteudoRaw = fs.readFileSync(fullPath, "utf-8");
  } catch (err) {
    console.log(`❌ Erro ao ler JSON ${nomeArquivo}:`, err.message);
    log(`ERRO leitura JSON ${nomeArquivo}: ${err.message}`);
    return;
  }

  let jsonData;
  try {
    jsonData = JSON.parse(conteudoRaw);
  } catch (err) {
    console.log(`❌ JSON inválido (${nomeArquivo}). Confere o arquivo.`);
    log(`ERRO parse JSON ${nomeArquivo}: ${err.message}`);
    // move para histórico com prefixo erro_
    const erroDestino = path.join(JSONS_HISTORY_DIR, `erro_${nomeArquivo}`);
    fs.renameSync(fullPath, erroDestino);
    log(`JSON com erro movido para: ${erroDestino}`);
    return;
  }

  // Garante que vamos trabalhar com array de itens
  const itens = Array.isArray(jsonData) ? jsonData : [jsonData];

  for (const item of itens) {
    const caminho = item.caminho || "";
    const arquivo = item.arquivo || "";
    const conteudo = item.conteudo ?? "";

    if (!arquivo) {
      log(`AVISO: item sem 'arquivo' no JSON ${nomeArquivo}, ignorado.`);
      continue;
    }

    const destinoFinal = path.resolve(GERADOR_ROOT, caminho, arquivo);
    const dirDestino = path.dirname(destinoFinal);

    ensureDir(dirDestino);

    // backup se já existir
    backupIfExists(destinoFinal);

    try {
      fs.writeFileSync(destinoFinal, conteudo, "utf-8");
      console.log(`📄 Arquivo gerado/atualizado: ${destinoFinal}`);
      log(`OK: Arquivo gerado/atualizado: ${destinoFinal}`);
    } catch (err) {
      console.log(`❌ Erro ao escrever arquivo ${destinoFinal}:`, err.message);
      log(`ERRO escrita arquivo ${destinoFinal}: ${err.message}`);
    }
  }

  // mover JSON para histórico
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const novoNome = `${stamp}__${nomeArquivo}`;
  const destinoJson = path.join(JSONS_HISTORY_DIR, novoNome);
  try {
    fs.renameSync(fullPath, destinoJson);
    log(`JSON movido para histórico: ${destinoJson}`);
  } catch (err) {
    console.log(`⚠️ Não foi possível mover ${nomeArquivo} para histórico:`, err.message);
    log(`ERRO mover JSON ${nomeArquivo} para histórico: ${err.message}`);
  }
}

async function loopSentinela() {
  console.log("============================================================");
  console.log("🧙‍♂️ PBQE-C Gerador V4 – Modo Sentinela Supremo™");
  console.log("============================================================");
  console.log(`📂 Monitorando Downloads em: ${DOWNLOADS_DIR}`);
  console.log("Pressione CTRL + C para encerrar.\n");
  log("Sentinela iniciado.");

  let ciclo = 0;

  while (true) {
    ciclo += 1;
    const arquivos = listarJSONsDownloads();

    if (arquivos.length === 0) {
      if (ciclo % 10 === 1) {
        console.log("🧭 Sentinela ativo. Nenhum JSON novo por enquanto...");
      }
      await sleep(1000);
      continue;
    }

    console.log(`\n🔎 ${arquivos.length} JSON(s) detectado(s). Iniciando processamento...`);
    log(`Detectados ${arquivos.length} JSON(s) para processamento.`);

    for (const nome of arquivos) {
      console.log(`\n✨ Processando: ${nome}`);
      processarJson(nome);
    }

    console.log("\n✅ Lote concluído. Sentinela continua ativo.\n");
    await sleep(1000);
  }
}

loopSentinela().catch((err) => {
  console.error("❌ Erro fatal no Sentinela:", err);
  log(`ERRO FATAL: ${err.message}`);
});
