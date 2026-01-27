// PBQE-C Gerador V4 – Modo Sentinela Supremo™
// PATCH FINAL ABSOLUTO:
// - JSON DDL vai para ../ddl_engine/input
// - Executor em ../ddl_engine/executor.js
// - Gerador NÃO cria estrutura do DDL Engine
// -----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

const GERADOR_ROOT = __dirname;
const DOWNLOADS_DIR = path.join(process.env.USERPROFILE || "", "Downloads");
const JSONS_HISTORY_DIR = path.join(GERADOR_ROOT, "jsons");
const LOG_DIR = path.join(GERADOR_ROOT, "pbqe_logs");
const BACKUP_DIR = path.join(GERADOR_ROOT, "pbqe_backups");

// ========================
// DDL ENGINE (USO, NÃO CRIAÇÃO)
// ========================
const DDL_ENGINE_ROOT = path.join(GERADOR_ROOT, "..", "ddl_engine");
const DDL_INPUT_DIR = path.join(DDL_ENGINE_ROOT, "input");     // 🔴 AQUI
const EXECUTOR_SCRIPT = path.join(DDL_ENGINE_ROOT, "executor.js");

// 🔥 Flags globais
let coreTouched = false;
let ddlQueuedThisCycle = false;

// ========================
// Bootstrap seguro
// ========================
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Diretórios DO GERADOR (esses ele pode criar)
ensureDir(JSONS_HISTORY_DIR);
ensureDir(LOG_DIR);
ensureDir(BACKUP_DIR);

// Diretório do DDL Engine (NÃO criar, apenas validar)
if (!fs.existsSync(DDL_INPUT_DIR)) {
  const msg = `ERRO CRÍTICO: pasta DDL Engine input não encontrada: ${DDL_INPUT_DIR}`;
  console.error(`❌ ${msg}`);
  fs.appendFileSync(
    path.join(LOG_DIR, "gerador_v4.log"),
    `[${new Date().toISOString()}] ${msg}\n`
  );
  process.exit(1);
}

const LOG_FILE = path.join(LOG_DIR, "gerador_v4.log");

function log(msg) {
  fs.appendFileSync(
    LOG_FILE,
    `[${new Date().toISOString()}] ${msg}\n`,
    "utf-8"
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listarJSONsDownloads() {
  if (!DOWNLOADS_DIR || !fs.existsSync(DOWNLOADS_DIR)) {
    log("ERRO: Pasta Downloads não encontrada.");
    return [];
  }

  return fs
    .readdirSync(DOWNLOADS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".json"));
}

// ========================
// CONTRATO OFICIAL DDL
// ========================
function arquivoEhDDL(jsonData) {
  const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
  if (arr.length === 0) return false;

  return arr.every(
    (x) =>
      x &&
      x.tipo === "ddl" &&
      x.executor === true &&
      typeof x.acao === "string" &&
      x.payload &&
      typeof x.payload === "object"
  );
}

function encaminharDDL(fullPath, nomeArquivo) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const destino = path.join(DDL_INPUT_DIR, `${stamp}__${nomeArquivo}`);

  // MOVE direto para ../ddl_engine/input
  fs.renameSync(fullPath, destino);

  ddlQueuedThisCycle = true;

  log(`DDL MOVIDO → ${destino}`);
  console.log(`🧱 DDL → ${destino}`);
}

function processarJson(nomeArquivo) {
  const fullPath = path.join(DOWNLOADS_DIR, nomeArquivo);
  log(`Processando JSON: ${nomeArquivo}`);

  let jsonData;
  try {
    jsonData = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  } catch (err) {
    log(`ERRO parse JSON ${nomeArquivo}: ${err.message}`);
    fs.renameSync(fullPath, path.join(JSONS_HISTORY_DIR, `erro_${nomeArquivo}`));
    return;
  }

  // 🔑 DDL: sai do domínio do gerador
  if (arquivoEhDDL(jsonData)) {
    encaminharDDL(fullPath, nomeArquivo);
    return;
  }

  // ========================
  // Fluxo normal (não DDL)
  // ========================
  const itens = Array.isArray(jsonData) ? jsonData : [jsonData];

  for (const item of itens) {
    const caminho = item.caminho || "";
    const arquivo = item.arquivo || "";
    const conteudo = item.conteudo ?? "";
    const origem = item.origem || null;

    if (!arquivo) continue;

    const destinoFinal = path.resolve(GERADOR_ROOT, caminho, arquivo);
    ensureDir(path.dirname(destinoFinal));

    try {
      if (origem) {
        fs.copyFileSync(
          path.resolve(DOWNLOADS_DIR, origem),
          destinoFinal
        );
      } else {
        fs.writeFileSync(destinoFinal, conteudo, "utf-8");
      }

      verificarDominio(destinoFinal);
      log(`OK: ${destinoFinal}`);
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

function verificarDominio(destinoFinal) {
  const normalizado = destinoFinal.replace(/\\/g, "/").toLowerCase();
  if (normalizado.includes("backend/modules/")) {
    coreTouched = true;
    log(`Domain Reload: backend/modules detectado -> ${destinoFinal}`);
  }
}

function reiniciarBackendSeNecessario() {
  if (!coreTouched) return;

  exec("pm2 reload backend", () => {
    coreTouched = false;
  });
}

function executarExecutorSeNecessario() {
  if (!ddlQueuedThisCycle) return;

  try {
    log(`Chamando executor: node "${EXECUTOR_SCRIPT}"`);
    console.log("🚀 Chamando executor DDL...");
    execSync(`node "${EXECUTOR_SCRIPT}"`, { stdio: "inherit" });
    log("Executor finalizou lote DDL");
  } catch (err) {
    log(`ERRO Executor: ${err.message}`);
    console.log("❌ Executor falhou. Ver executor.log");
  } finally {
    ddlQueuedThisCycle = false;
  }
}

// ========================
// LOOP SENTINELA
// ========================
async function loopSentinela() {
  console.log("🧙‍♂️ PBQE-C Gerador V4 – Sentinela Supremo™");
  log("Sentinela iniciado.");

  while (true) {
    const arquivos = listarJSONsDownloads();

    if (arquivos.length === 0) {
      await sleep(1000);
      continue;
    }

    ddlQueuedThisCycle = false;

    for (const nome of arquivos) {
      processarJson(nome);
    }

    executarExecutorSeNecessario();
    reiniciarBackendSeNecessario();

    await sleep(1000);
  }
}

loopSentinela();
