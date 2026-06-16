const { WORDS } = require("./words");

function calculateColorsForGuess(guess, secretWord) {
  return guess.split("").map((letter, index) => {
    if (secretWord[index] === letter) return "green";
    if (!secretWord.includes(letter)) return "black";

    const totalSecretOccurrences = secretWord
      .split("")
      .filter((l) => l === letter).length;
    const greenOccurrences = secretWord
      .split("")
      .filter((l, i) => l === letter && guess[i] === letter).length;
    const occurrencesUntilNow = guess
      .slice(0, index + 1)
      .split("")
      .filter((l) => l === letter).length;

    if (occurrencesUntilNow <= totalSecretOccurrences - greenOccurrences) {
      return "yellow";
    }
    return "black";
  });
}

async function getServerLeaderboard(db, guildId, secretWord) {
  try {
    const players = await db.all(
      "SELECT user_id, attempts, won FROM user_games WHERE guild_id = ?",
      [guildId],
    );

    return players
      .map((p) => {
        const attemptsArray = JSON.parse(p.attempts);

        const gridColors = attemptsArray.map((guess) =>
          calculateColorsForGuess(guess, secretWord),
        );

        return {
          userId: p.user_id,
          username:
            p.user_id === "jogador_gogo"
              ? "Você (gogó)"
              : `Cavernoso_${p.user_id.slice(-4)}`,
          avatarUrl:
            p.user_id === "jogador_gogo"
              ? "https://api.dicebear.com/7.x/pixel-art/svg?seed=gogo"
              : `https://api.dicebear.com/7.x/bottts/svg?seed=${p.user_id}`,
          gridColors,
          attemptsCount: attemptsArray.length,
          won: p.won === 1,
        };
      })
      .sort((a, b) => {
        if (a.won !== b.won) return b.won - a.won;
        return a.attemptsCount - b.attemptsCount;
      });
  } catch (error) {
    console.error("Erro ao gerar o leaderboard:", error);
    return [];
  }
}

async function getOrCreateServerWord(db, guildId) {
  let streakData = await db.get(
    "SELECT * FROM server_streaks WHERE guild_id = ?",
    [guildId],
  );

  if (!streakData) {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    await db.run(
      "INSERT INTO server_streaks (guild_id, current_word_no, current_secret_word, last_win_date) VALUES (?, ?, ?, ?)",
      [guildId, 1, randomWord, ""],
    );
    return randomWord;
  }

  return streakData.current_secret_word;
}

async function getGameStatus(req, res, db) {
  const { guildId, userId } = req.query;
  if (!guildId || !userId) {
    return res.status(400).json({ error: "Faltando parâmetros." });
  }

  try {
    const secretWord = await getOrCreateServerWord(db, guildId);
    const key = `${guildId}_${userId}`;
    let userGame = await db.get("SELECT * FROM user_games WHERE id = ?", [key]);

    if (!userGame) {
      return res.json({ attempts: [], won: false, leaderboard: [] });
    }

    const attemptsRaw = JSON.parse(userGame.attempts);
    const attemptsWithColors = attemptsRaw.map((guess) => ({
      word: guess,
      colors: calculateColorsForGuess(guess, secretWord),
    }));

    const isGameOver = userGame.won === 1 || attemptsRaw.length >= 6;
    const leaderboard = isGameOver
      ? await getServerLeaderboard(db, guildId, secretWord)
      : [];

    return res.json({
      attempts: attemptsWithColors,
      won: userGame.won === 1,
      leaderboard,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno." });
  }
}

async function submitGuess(req, res, db) {
  const { guildId, userId, guess } = req.body;
  if (!guildId || !userId || !guess) {
    return res.status(400).json({ error: "Faltando parâmetros corporais." });
  }

  const key = `${guildId}_${userId}`;

  try {
    const secretWord = await getOrCreateServerWord(db, guildId);
    let userGame = await db.get("SELECT * FROM user_games WHERE id = ?", [key]);

    if (userGame && userGame.won === 1) {
      return res
        .status(400)
        .json({ error: "Você já acertou a palavra de hoje!" });
    }

    let attempts = userGame ? JSON.parse(userGame.attempts) : [];
    if (attempts.length >= 6) {
      return res.status(400).json({ error: "Jogo já finalizado." });
    }

    const guessUpper = guess.toUpperCase();

    if (!WORDS.includes(guessUpper)) {
      return res
        .status(400)
        .json({ error: "Palavra não aceita no dicionário do Worgle!" });
    }
    attempts.push(guessUpper);
    const won = guessUpper === secretWord ? 1 : 0;

    if (!userGame) {
      await db.run(
        "INSERT INTO user_games (id, guild_id, user_id, attempts, won) VALUES (?, ?, ?, ?, ?)",
        [key, guildId, userId, JSON.stringify(attempts), won],
      );
    } else {
      await db.run("UPDATE user_games SET attempts = ?, won = ? WHERE id = ?", [
        JSON.stringify(attempts),
        won,
        key,
      ]);
    }

    if (won) {
      const todayStr = new Date().toISOString().split("T")[0];
      const streakData = await db.get(
        "SELECT * FROM server_streaks WHERE guild_id = ?",
        [guildId],
      );

      if (streakData && streakData.last_win_date !== todayStr) {
        let newStreak = streakData.current_streak + 1;
        let newHighest = Math.max(newStreak, streakData.highest_streak);

        await db.run(
          "UPDATE server_streaks SET current_streak = ?, highest_streak = ?, last_win_date = ? WHERE guild_id = ?",
          [newStreak, newHighest, todayStr, guildId],
        );
      }
    }

    const attemptsWithColors = attempts.map((g) => ({
      word: g,
      colors: calculateColorsForGuess(g, secretWord),
    }));

    const isGameOver = won === 1 || attempts.length >= 6;
    const leaderboard = isGameOver
      ? await getServerLeaderboard(db, guildId, secretWord)
      : [];

    return res.json({
      attempts: attemptsWithColors,
      won: won === 1,
      leaderboard,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar palpite." });
  }
}

async function resetGame(req, res, db) {
  const { guildId, userId } = req.body;
  if (!guildId || !userId) {
    return res
      .status(400)
      .json({ error: "GuildId e UserId são obrigatórios." });
  }

  const key = `${guildId}_${userId}`;

  try {
    await db.run("DELETE FROM user_games WHERE id = ?", [key]);

    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    await db.run(
      "UPDATE server_streaks SET current_secret_word = ? WHERE guild_id = ?",
      [randomWord, guildId],
    );

    console.log(`🔄 Jogo Resetado! Nova palavra de teste: ${randomWord}`);
    return res.json({
      success: true,
      message: "Novo jogo gerado sem limites de tempo!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao resetar o jogo." });
  }
}

module.exports = { getGameStatus, submitGuess, resetGame };
