const fs = require('node:fs');
const path = require('node:path');

class SignupDB {
  constructor(filePath) {
    this.filePath = filePath;
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  addSignup(email) {
    const normalized = email.toLowerCase().trim();
    const signups = this._read();
    if (signups.some((s) => s.email === normalized)) {
      return { created: false };
    }
    signups.push({ email: normalized, created_at: new Date().toISOString() });
    this._write(signups);
    return { created: true };
  }

  getSignups() {
    return this._read().sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }
}

module.exports = { Database: SignupDB };
