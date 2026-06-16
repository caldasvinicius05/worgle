// src/utils/discord.ts
import { DiscordSDK, type CommandResponse } from "@discord/embedded-app-sdk";

const isEmbedded = window.self !== window.top;

export const discordSDK = isEmbedded
  ? new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID)
  : null;

interface DiscordContext {
  guildId: string | null;
  userId: string;
  username: string;
  avatar: string | null;
}

export async function setupDiscord(): Promise<DiscordContext> {
  if (!isEmbedded || !discordSDK) {
    return {
      guildId: "cavernosos_server_1",
      userId: "jogador_gogo",
      username: "gogó (Local)",
      avatar: null,
    };
  }

  try {
    await discordSDK.ready();

    if (!discordSDK.commands) {
      throw new Error(
        "Discord SDK inicializou, mas os comandos não estão disponíveis.",
      );
    }

    const { code } = await discordSDK.commands.authorize({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify", "guilds.members.read"],
    });

    const auth = (await discordSDK.commands.authenticate({
      access_token: code,
    })) as CommandResponse<"authenticate">;

    return {
      guildId: discordSDK.guildId,
      userId: auth?.user?.id || "jogador_gogo",
      username: auth?.user?.username || "gogó",
      avatar: auth?.user?.avatar ?? null,
    };
  } catch (error) {
    console.error("Erro ao inicializar o SDK oficial do Discord:", error);

    return {
      guildId: "cavernosos_server_1",
      userId: "jogador_gogo",
      username: "gogó (Fallback)",
      avatar: null,
    };
  }
}
