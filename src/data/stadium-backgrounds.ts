export const stadiumBackgroundByName: Record<string, string> = {
  "AT&T Stadium": "/matches/stadium-att.webp",
  "Arrowhead Stadium": "/matches/stadium-arrowhead.webp",
  "Gillette Stadium": "/matches/stadium-gillette.webp",
  "Hard Rock Stadium": "/matches/stadium-hard-rock.webp",
  "Levi's Stadium": "/matches/stadium-levis.webp",
  "Lincoln Financial Field": "/matches/stadium-lincoln-financial.webp",
  "Lumen Field": "/matches/stadium-lumen.webp",
  "Mercedes-Benz Stadium": "/matches/stadium-mercedes-benz.webp",
  "MetLife Stadium": "/matches/stadium-metlife.webp",
  "NRG Stadium": "/matches/stadium-nrg.webp",
  "SoFi Stadium": "/matches/stadium-sofi.webp",
};

export function getStadiumBackground(stadium: string, fallback: string) {
  return stadiumBackgroundByName[stadium] ?? fallback;
}
