// PBQE-C Gerador V4 – Modo Sentinela Supremo™
// -----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

const GERADOR_ROOT = __dirname;
const PROJECT_ROOT = path.resolve(GERADOR_ROOT, "."); // 🔧 ROOT CORRETO DO PROJETO
const DOWNLOADS_DIR = path.join(process.env.USERPROFILE || "", "Downloads");
const JSONS_HISTORY_DIR = path.join(GERADOR_ROOT, "jsons");
const LOG_DIR = path.join(GERADOR_ROOT, "pbqe_logs");
const BACKUP_DIR = path.join(GERADOR_ROOT, "pbqe_backups");

// ========================
// DDL ENGINE
// ========================
const DDL_ENGINE_ROOT = path.join(PROJECT_ROOT, "ddl_engine");
const DDL_INPUT_DIR = path.join(DDL_ENGINE_ROOT, "input");
const EXECUTOR_SCRIPT = path.join(DDL_ENGINE_ROOT, "executor.js");

let coreTouched = false;
let ddlQueuedThisCycle = false;

// ========================
// Bootstrap
// ========================
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(JSONS_HISTORY_DIR);
ensureDir(LOG_DIR);
ensureDir(BACKUP_DIR);

const LOG_FILE = path.join(LOG_DIR, "gerador_v4.log");

function log(msg) {
  fs.appendFileSync(
    LOG_FILE,
    `[${new Date().toISOString()}] ${msg}\n`,
    "utf-8"
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function listarJSONsDownloads() {
  if (!fs.existsSync(DOWNLOADS_DIR)) return [];
  return fs.readdirSync(DOWNLOADS_DIR).filter(f => f.endsWith(".json"));
}

// ========================
// BACKUP (PADRÃO ANTIGO)
// ========================
function backupSeExistir(destinoFinal) {
  if (!fs.existsSync(destinoFinal)) return;

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const nomeSeguro = destinoFinal
    .replace(PROJECT_ROOT, "")
    .replace(/[\\/]/g, "_")
    .replace(/^_+/, "");

  const backupFile = path.join(BACKUP_DIR, `${ts}__${nomeSeguro}`);
  fs.copyFileSync(destinoFinal, backupFile);
  log(`BACKUP: ${backupFile}`);
}

// ========================
// DDL
// ========================
function arquivoEhDDL(jsonData) {
  const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
  return arr.every(x => x?.tipo === "ddl" && x.executor === true);
}

function encaminharDDL(fullPath, nomeArquivo) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.renameSync(fullPath, path.join(DDL_INPUT_DIR, `${stamp}__${nomeArquivo}`));
  ddlQueuedThisCycle = true;
}

// ========================
// PROCESSAMENTO
// ========================
function processarJson(nomeArquivo) {
  const fullPath = path.join(DOWNLOADS_DIR, nomeArquivo);
  let jsonData;

  try {
    jsonData = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  } catch {
    return;
  }

  if (arquivoEhDDL(jsonData)) {
    encaminharDDL(fullPath, nomeArquivo);
    return;
  }

  const itens = Array.isArray(jsonData) ? jsonData : [jsonData];

  for (const item of itens) {
    const destinoFinal = path.resolve(
      PROJECT_ROOT,
      item.caminho || "",
      item.arquivo || ""
    );

    ensureDir(path.dirname(destinoFinal));
    backupSeExistir(destinoFinal);

    if (item.origem) {
      fs.copyFileSync(
        path.join(DOWNLOADS_DIR, item.origem),
        destinoFinal
      );
    } else {
      fs.writeFileSync(destinoFinal, item.conteudo ?? "", "utf-8");
    }

    verificarDominio(destinoFinal);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.renameSync(
    fullPath,
    path.join(JSONS_HISTORY_DIR, `${stamp}__${nomeArquivo}`)
  );
}

function verificarDominio(destinoFinal) {
  if (destinoFinal.replace(/\\/g, "/").includes("backend/modules")) {
    coreTouched = true;
  }
}

function reiniciarBackendSeNecessario() {
  if (coreTouched) {
    exec("pm2 reload backend", () => coreTouched = false);
  }
}

function executarExecutorSeNecessario() {
  if (!ddlQueuedThisCycle) return;
  execSync(`node "${EXECUTOR_SCRIPT}"`, { stdio: "inherit" });
  ddlQueuedThisCycle = false;
}

// ========================
// LOOP
// ========================
async function loopSentinela() {
  console.log("🧙‍♂️ Gerador V4 – Sentinela ativo");
  while (true) {
    const arquivos = listarJSONsDownloads();
    for (const nome of arquivos) processarJson(nome);
    executarExecutorSeNecessario();
    reiniciarBackendSeNecessario();
    await sleep(1000);
  }
}

loopSentinela();
