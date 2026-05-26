import { promises as fs } from "node:fs";
import path from "node:path";
import { availableMatches } from "@/data/available-matches";

export type GameConfig = {
  id: string;
  name: string;
  priceUsd: number;
  oldPriceUsd: number;
  checkoutUrl: string;
};

export type CheckoutGroup = {
  id: string;
  label: string;
  productLinks: Record<string, string>;
};

export type SiteConfig = {
  activeCheckoutGroupId: string;
  checkoutGroups: CheckoutGroup[];
  games: GameConfig[];
  utmfyScripts: string[];
};

const CONFIG_PATH = path.join(process.cwd(), "data", "site-config.json");
const ADMIN_PASSWORD = process.env.CONFIG_PASSWORD ?? "aglomerado";

export function isValidConfigPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

export function getDefaultSiteConfig(): SiteConfig {
  const games = availableMatches.map((match) => ({
    checkoutUrl: `/matches/${match.id}`,
    id: match.id,
    name: match.featured ? "Grand Final" : `${match.teamA} vs ${match.teamB}`,
    oldPriceUsd: Math.round(match.price * 1.32),
    priceUsd: match.price,
  }));

  return {
    activeCheckoutGroupId: "group-1",
    checkoutGroups: [
      {
        id: "group-1",
        label: "Group 1",
        productLinks: Object.fromEntries(
          games.map((game) => [game.id, game.checkoutUrl]),
        ),
      },
    ],
    games,
    utmfyScripts: [],
  };
}

function normalizeNumber(value: unknown) {
  const numberValue =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));

  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : 0;
}

export function normalizeSiteConfig(config: Partial<SiteConfig>): SiteConfig {
  const defaultConfig = getDefaultSiteConfig();
  const incomingGames = Array.isArray(config.games) ? config.games : [];
  const incomingGroups = Array.isArray(config.checkoutGroups)
    ? config.checkoutGroups
    : [];
  const checkoutGroups = incomingGroups.length
    ? incomingGroups
        .filter((group) => typeof group?.id === "string")
        .map((group, index) => ({
          id: group.id,
          label:
            typeof group.label === "string" && group.label.trim()
              ? group.label.trim()
              : `Group ${index + 1}`,
          productLinks: defaultConfig.games.reduce<Record<string, string>>(
            (links, game) => {
              const incomingLink = group.productLinks?.[game.id];
              links[game.id] =
                typeof incomingLink === "string" && incomingLink.trim()
                  ? incomingLink.trim()
                  : game.checkoutUrl;
              return links;
            },
            {},
          ),
        }))
    : defaultConfig.checkoutGroups;
  const activeCheckoutGroupId =
    typeof config.activeCheckoutGroupId === "string" &&
    checkoutGroups.some((group) => group.id === config.activeCheckoutGroupId)
      ? config.activeCheckoutGroupId
      : checkoutGroups[0]?.id ?? defaultConfig.activeCheckoutGroupId;

  return {
    activeCheckoutGroupId,
    checkoutGroups,
    games: defaultConfig.games.map((defaultGame) => {
      const incomingGame = incomingGames.find(
        (game) => game?.id === defaultGame.id,
      );
      const activeGroup = checkoutGroups.find(
        (group) => group.id === activeCheckoutGroupId,
      );
      const groupedCheckoutUrl = activeGroup?.productLinks[defaultGame.id];

      return {
        checkoutUrl:
          typeof groupedCheckoutUrl === "string" && groupedCheckoutUrl.trim()
            ? groupedCheckoutUrl.trim()
            : typeof incomingGame?.checkoutUrl === "string" &&
                incomingGame.checkoutUrl.trim()
              ? incomingGame.checkoutUrl.trim()
              : defaultGame.checkoutUrl,
        id: defaultGame.id,
        name: defaultGame.name,
        oldPriceUsd: normalizeNumber(
          incomingGame?.oldPriceUsd ?? defaultGame.oldPriceUsd,
        ),
        priceUsd: normalizeNumber(
          incomingGame?.priceUsd ?? defaultGame.priceUsd,
        ),
      };
    }),
    utmfyScripts: Array.isArray(config.utmfyScripts)
      ? config.utmfyScripts.filter((script) => typeof script === "string")
      : [],
  };
}

export async function getSiteConfig() {
  try {
    const rawConfig = await fs.readFile(CONFIG_PATH, "utf8");
    return normalizeSiteConfig(JSON.parse(rawConfig) as Partial<SiteConfig>);
  } catch {
    const defaultConfig = getDefaultSiteConfig();
    await saveSiteConfig(defaultConfig);
    return defaultConfig;
  }
}

export async function saveSiteConfig(config: Partial<SiteConfig>) {
  const normalizedConfig = normalizeSiteConfig(config);
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.writeFile(
    CONFIG_PATH,
    `${JSON.stringify(normalizedConfig, null, 2)}\n`,
    "utf8",
  );
  return normalizedConfig;
}
