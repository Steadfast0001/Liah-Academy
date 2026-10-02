const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dataDir = path.join(root, 'data');
const backupsDir = path.join(dataDir, 'backups');
const storeFile = path.join(dataDir, 'liah_academy_store.json');

function main() {
  const issues = [];

  if (!fs.existsSync(dataDir)) {
    issues.push('Missing data directory');
  }

  if (!fs.existsSync(storeFile)) {
    issues.push('Missing primary store file');
  }

  if (!fs.existsSync(backupsDir)) {
    issues.push('Missing backups directory');
  }

  if (fs.existsSync(storeFile)) {
    try {
      const raw = fs.readFileSync(storeFile, 'utf8');
      const parsed = JSON.parse(raw);
      if (!parsed.students || !Array.isArray(parsed.students)) issues.push('Store is missing students array');
      if (!parsed.payments || !Array.isArray(parsed.payments)) issues.push('Store is missing payments array');
      if (!parsed.settings || typeof parsed.settings !== 'object') issues.push('Store is missing settings');
    } catch (error) {
      issues.push(`Store JSON is unreadable: ${error.message}`);
    }
  }

  if (fs.existsSync(backupsDir)) {
    const backupFiles = fs.readdirSync(backupsDir).filter(name => name.endsWith('.json')).slice(0, 10);
    if (backupFiles.length === 0) {
      issues.push('No JSON backup files present');
    }
    for (const file of backupFiles) {
      const filePath = path.join(backupsDir, file);
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        JSON.parse(raw);
      } catch (error) {
        issues.push(`Backup file ${file} is not valid JSON: ${error.message}`);
      }
    }
  }

  const result = {
    ok: issues.length === 0,
    issues,
    backup_count: fs.existsSync(backupsDir) ? fs.readdirSync(backupsDir).filter(name => name.endsWith('.json')).length : 0,
    store_exists: fs.existsSync(storeFile)
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(issues.length === 0 ? 0 : 1);
}

main();
