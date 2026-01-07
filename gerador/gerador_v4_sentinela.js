// PBQE-C Gerador V4 – Modo Sentinela Supremo™
// PATCH v4.3 – Execução do Executor com CWD fixo
// -----------------------------------------------------------------------------
// Correção:
// - Força cwd para ddl_engine ao disparar o executor
// - Garante caminhos relativos corretos no Windows
// -----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const GERADOR_ROOT = __dirname;
const PROJECT_ROOT = path.resolve(GERADOR_ROOT, "..");
const DOWNLOADS_DIR = path.join(process.env.USERPROFILE || "", "Downloads");
const JSONS_HISTORY_DIR = path.join(GERADOR_ROOT, "jsons");
const LOG_DIR = path.join(GERADOR_ROOT, "pbqe_logs");
const BACKUP_DIR = path.join(GERADOR_ROOT, "pbqe_backups");

const DDL_ENGINE_DIR = path.join(PROJECT_ROOT, "ddl_engine");
const DDL_INPUT_DIR = path.join(DDL_ENGINE_DIR, "input");
const DDL_EXECUTOR = path.join(DDL_ENGINE_DIR, "executor.js");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

[JSONS_HISTORY_DIR, LOG_DIR, BACKUP_DIR, DDL_INPUT_DIR].forEach(ensureDir);

const LOG_FILE = path.join(LOG_DIR, "gerador_v4.log");

function log(msg) {
  fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${msg}\n`, "utf-8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listarJSONsDownloads() {
  if (!DOWNLOADS_DIR || !fs.existsSync(DOWNLOADS_DIR)) return [];
  return fs.readdirSync(DOWNLOADS_DIR).filter((f) => f.toLowerCase().endsWith(".json"));
}

function isDDL(json) {
  if (Array.isArray(json)) {
    return json[0] && (json[0].tipo === "table" || json[0].tipo === "database");
  }
  return json && (json.tipo === "table" || json.tipo === "database");
}

function processarJson(nomeArquivo) {
  const fullPath = path.join(DOWNLOADS_DIR, nomeArquivo);
  let jsonData;

  try {
    jsonData = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  } catch {
    log(`JSON inválido ignorado: ${nomeArquivo}`);
    return;
  }

  // ===== DDL DISPATCH =====
  if (isDDL(jsonData)) {
    const destino = path.join(DDL_INPUT_DIR, nomeArquivo);
    fs.renameSync(fullPath, destino);
    log(`DDL JSON movido para ddl_engine/input: ${nomeArquivo}`);

    exec(`node "${DDL_EXECUTOR}"`, { cwd: DDL_ENGINE_DIR }, () => {
      log("Executor DDL disparado com CWD fixo.");
    });

    return;
  }

  // ===== FLUXO NORMAL =====
  const itens = Array.isArray(jsonData) ? jsonData : [jsonData];

  for (const item of itens) {
    const caminho = item.caminho || "";
    const arquivo = item.arquivo || "";
    const conteudo = item.conteudo ?? "";
    const origem = item.origem || null;

    if (!arquivo) continue;

    const destinoFinal = path.resolve(GERADOR_ROOT, caminho, arquivo);
    ensureDir(path.dirname(destinoFinal));

    if (origem) {
      const origemPath = path.resolve(DOWNLOADS_DIR, origem);
      fs.copyFileSync(origemPath, destinoFinal);
    } else {
      fs.writeFileSync(destinoFinal, conteudo, "utf-8");
    }
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.renameSync(fullPath, path.join(JSONS_HISTORY_DIR, `${stamp}__${nomeArquivo}`));
}

async function loopSentinela() {
  while (true) {
    const arquivos = listarJSONsDownloads();
    for (const nome of arquivos) processarJson(nome);
    await sleep(1000);
  }
}

loopSentinela();
