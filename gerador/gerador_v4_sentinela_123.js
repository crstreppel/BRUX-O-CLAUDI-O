// PBQE-C Gerador V4 – Modo Sentinela Supremo™
// PATCH: Domain Reload (backend/modules) via PM2
// -----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const GERADOR_ROOT = __dirname;
const DOWNLOADS_DIR = path.join(process.env.USERPROFILE || "", "Downloads");
const JSONS_HISTORY_DIR = path.join(GERADOR_ROOT, "jsons");
const LOG_DIR = path.join(GERADOR_ROOT, "pbqe_logs");
const BACKUP_DIR = path.join(GERADOR_ROOT, "pbqe_backups");

// 🔥 Flag global do ciclo
let coreTouched = false;

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

function verificarDominio(destinoFinal) {
  const normalizado = destinoFinal.replace(/\\/g, "/").toLowerCase();
  if (normalizado.includes("backend/modules/")) {
    coreTouched = true;
    log(`Domain Reload: backend/modules detectado -> ${destinoFinal}`);
  }
}

function processarJson(nomeArquivo) {
  const fullPath = path.join(DOWNLOADS_DIR, nomeArquivo);
  log(`Iniciando processamento do JSON: ${nomeArquivo}`);

  let conteudoRaw;
  try {
    conteudoRaw = fs.readFileSync(fullPath, "utf-8");
  } catch (err) {
    log(`ERRO leitura JSON ${nomeArquivo}: ${err.message}`);
    return;
  }

  let jsonData;
  try {
    jsonData = JSON.parse(conteudoRaw);
  } catch (err) {
    log(`ERRO parse JSON ${nomeArquivo}: ${err.message}`);
    fs.renameSync(
      fullPath,
      path.join(JSONS_HISTORY_DIR, `erro_${nomeArquivo}`)
    );
    return;
  }

  const itens = Array.isArray(jsonData) ? jsonData : [jsonData];

  for (const item of itens) {
    const caminho = item.caminho || "";
    const arquivo = item.arquivo || "";
    const conteudo = item.conteudo ?? "";
    const origem = item.origem || null;

    if (!arquivo) continue;

    const destinoFinal = path.resolve(GERADOR_ROOT, caminho, arquivo);
    const dirDestino = path.dirname(destinoFinal);

    ensureDir(dirDestino);
    backupIfExists(destinoFinal);

    try {
      if (origem) {
        const origemPath = path.resolve(DOWNLOADS_DIR, origem);
        fs.copyFileSync(origemPath, destinoFinal);
      } else {
        fs.writeFileSync(destinoFinal, conteudo, "utf-8");
      }

      verificarDominio(destinoFinal);
      log(`OK: ${destinoFinal}`);
      console.log(`📄 ${destinoFinal}`);
    } catch (err) {
      log(`ERRO escrita ${destinoFinal}: ${err.message}`);
    }
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.renameSync(
    fullPath,
    path.join(JSONS_HISTORY_DIR, `${stamp}__${nomeArquivo}`)
  );
}

function reiniciarBackendSeNecessario() {
  if (!coreTouched) return;

  log("🚀 Domain Reload acionado: reiniciando backend via PM2...");
  console.log("🔄 Alterações no backend detectadas. Reiniciando via PM2...");

  exec("pm2 reload backend", (error, stdout, stderr) => {
    if (error) {
      log(`ERRO PM2 reload: ${error.message}`);
      return;
    }

    if (stderr) {
      log(`PM2 STDERR: ${stderr}`);
    }

    log(`PM2 reload OK: ${stdout}`);
  });

  coreTouched = false;
}

async function loopSentinela() {
  console.log("🧙‍♂️ PBQE-C Gerador V4 – Sentinela Supremo™");
  log("Sentinela iniciado.");

  while (true) {
    const arquivos = listarJSONsDownloads();

    if (arquivos.length === 0) {
      await sleep(1000);
      continue;
    }

    for (const nome of arquivos) {
      processarJson(nome);
    }

    reiniciarBackendSeNecessario();
    await sleep(1000);
  }
}

loopSentinela();
