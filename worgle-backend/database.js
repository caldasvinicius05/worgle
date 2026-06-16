const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function setupDatabase() {
  const db = await open({
    filename: "./worgle.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS server_streaks (
      guild_id TEXT PRIMARY KEY,
      current_streak INTEGER DEFAULT 0,
      highest_streak INTEGER DEFAULT 0,
      last_win_date TEXT,
      current_word_no INTEGER DEFAULT 1,
      current_secret_word TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_games (
      id TEXT PRIMARY KEY, -- formato: guildId_userId
      guild_id TEXT,
      user_id TEXT,
      attempts TEXT, -- Salvaremos como JSON stringificado ex: ["TERMO", "SAGAZ"]
      won INTEGER DEFAULT 0
    )
  `);

  return db;
}

module.exports = { setupDatabase };
