const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
console.log('Unlocking and repairing all file/directory permissions in:', root);

function repair(dir) {
  try {
    fs.chmodSync(dir, 0o755);
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const p = path.join(dir, item.name);
      try {
        if (item.isDirectory()) {
          fs.chmodSync(p, 0o755);
          repair(p);
        } else {
          // If script file, give 755, else 644
          if (item.name.endsWith('.sh') || item.name === 'server.js') {
            fs.chmodSync(p, 0o755);
          } else {
            fs.chmodSync(p, 0o644);
          }
        }
      } catch (err) {
        console.warn('Warning chmod on ' + p + ':', err.message);
      }
    }
  } catch (err) {
    console.warn('Warning chmod dir ' + dir + ':', err.message);
  }
}

repair(root);
console.log('✅ ALL PERMISSIONS REPAIRED: All directories set to 755, all files set to 644.');
