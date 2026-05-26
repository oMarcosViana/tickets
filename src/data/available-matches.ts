export type AvailableMatch = {
  id: string;
  teamA: string;
  teamB: string;
  flagA?: string;
  flagB?: string;
  date: string;
  shortDate: string;
  city: string;
  stadium: string;
  code: string;
  background: string;
  price: number;
  featured?: boolean;
};

export const availableMatches: AvailableMatch[] = [
  {
    id: "grand-final",
    teamA: "Grand",
    teamB: "Final",
    date: "Sunday, July 19, 2026",
    shortDate: "Jul 19, 2026",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "FIFA World Cup 26 Final",
    background: "/matches/stadium-b.webp",
    price: 5200,
    featured: true,
  },
  {
    id: "brazil-morocco",
    teamA: "Brazil",
    teamB: "Morocco",
    flagA: "/matches/flag-brazil.webp",
    flagB: "/matches/flag-morocco.webp",
    date: "Saturday, June 13, 2026 at 6:00 pm",
    shortDate: "Jun 13, 2026",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "M7: Brazil vs. Morocco",
    background: "/matches/stadium-b.webp",
    price: 2400,
  },
  {
    id: "france-senegal",
    teamA: "France",
    teamB: "Senegal",
    flagA: "/matches/flag-france.webp",
    flagB: "/matches/flag-senegal.webp",
    date: "Tuesday, June 16, 2026",
    shortDate: "Jun 16, 2026",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "France vs. Senegal",
    background: "/matches/stadium-b.webp",
    price: 2100,
  },
  {
    id: "argentina-algeria",
    teamA: "Argentina",
    teamB: "Algeria",
    flagA: "/matches/flag-argentina.webp",
    flagB: "/matches/flag-algeria.webp",
    date: "Tuesday, June 16, 2026",
    shortDate: "Jun 16, 2026",
    city: "Kansas City",
    stadium: "Arrowhead Stadium",
    code: "Argentina vs. Algeria",
    background: "/matches/stadium-a.webp",
    price: 2300,
  },
  {
    id: "usa-paraguay",
    teamA: "United States",
    teamB: "Paraguay",
    flagA: "/matches/flag-usa.webp",
    flagB: "/matches/flag-paraguay.webp",
    date: "Friday, June 12, 2026 at 6:00 pm",
    shortDate: "Jun 12, 2026",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    code: "M4: United States vs. Paraguay",
    background: "/matches/stadium-la.webp",
    price: 2000,
  },
  {
    id: "england-croatia",
    teamA: "England",
    teamB: "Croatia",
    flagA: "/matches/flag-england.webp",
    flagB: "/matches/flag-croatia.webp",
    date: "Wednesday, June 17, 2026",
    shortDate: "Jun 17, 2026",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "England vs. Croatia",
    background: "/matches/stadium-c.webp",
    price: 2200,
  },
  {
    id: "spain-cape-verde",
    teamA: "Spain",
    teamB: "Cape Verde",
    flagA: "/matches/flag-spain.webp",
    flagB: "/matches/flag-cape-verde.webp",
    date: "Monday, June 15, 2026",
    shortDate: "Jun 15, 2026",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Spain vs. Cape Verde",
    background: "/matches/stadium-a.webp",
    price: 1900,
  },
];

export function getAvailableMatch(matchId: string) {
  return availableMatches.find((match) => match.id === matchId);
}
