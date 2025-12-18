const { execSync } = require('child_process');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

/**
 * Script gerado automaticamente pelo Gerador V4.
 * Deve rodar dentro de Projeto_Petropolitan_v2/backend/scripts
 */

// Garante execução no diretório correto
process.chdir(path.resolve(__dirname));

const OUTPUT_FILE = path.join(
  'C:\\Users\\Claudio\\Desktop\\petropolitan\\sistema_Petropolian\\Petropolitan_Lab',
  'snapshot_petropolitan_lab.txt'
);

// Cabeçalho
fs.writeFileSync(
  OUTPUT_FILE,
  '=== SNAPSHOT PETROPOLITAN LAB ===\r\n\r\n',
  'utf8'
);

function section(title) {
  fs.appendFileSync(
    OUTPUT_FILE,
    `\r\n==============================\r\n${title}\r\n==============================\r\n`,
    'utf8'
  );
}

function write(line) {
  fs.appendFileSync(OUTPUT_FILE, line + '\r\n', 'utf8');
}

// Caminhos relativos a backend/scripts
const modulesPath = path.join('..', 'modules');
const publicPath  = path.join('..', 'public');

try {
  section('TREE backend/modules');
  const treeModules = execSync(
    `cmd /c chcp 65001>nul & tree /A /F "${modulesPath}"`,
    { encoding: 'utf8' }
  );
  write(treeModules.trim());
} catch (err) {
  write('ERRO TREE backend/modules: ' + err.message);
}

try {
  section('TREE backend/public');
  const treePublic = execSync(
    `cmd /c chcp 65001>nul & tree /A /F "${publicPath}"`,
    { encoding: 'utf8' }
  );
  write(treePublic.trim());
} catch (err) {
  write('ERRO TREE backend/public: ' + err.message);
}

(async () => {
  const client = new Client({
    user: 'bruxao',
    host: 'localhost',
    database: 'petropolitan_lab',
    password: 'bruxao123',
    port: 5432
  });

  try {
    await client.connect();

    section('TABELAS DO BANCO petropolitan_lab');

    const res = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `);

    res.rows.forEach(t => {
      write(`- ${t.table_schema}.${t.table_name}`);
    });

  } catch (err) {
    write('ERRO BANCO: ' + err.message);
  } finally {
    await client.end();
  }
})();