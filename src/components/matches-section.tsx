"use client";

import Image from "next/image";
import Link from "next/link";
import { PointerEvent, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  ChampionIcon,
  Location01Icon,
  Search01Icon,
  StarIcon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";
import { getStadiumBackground } from "@/data/stadium-backgrounds";
import { useWorldwide } from "@/hooks/use-worldwide";

type MatchStatus = "available" | "unavailable";
type FilterKey = "all" | "popular" | "available" | "unavailable";

type MatchCard = {
  id: string;
  teamA: string;
  teamB: string;
  flagA?: string;
  flagB?: string;
  date: string;
  city: string;
  stadium: string;
  code: string;
  status: MatchStatus;
  background: string;
  featured?: boolean;
};

const filters: Array<{ key: FilterKey; labelKey: string }> = [
  { key: "all", labelKey: "matches.all" },
  { key: "popular", labelKey: "matches.popular" },
  { key: "available", labelKey: "matches.available" },
  { key: "unavailable", labelKey: "matches.unavailable" },
];

const popularMatchOrder = [
  "grand-final",
  "brazil-morocco",
  "brazil-scotland",
  "france-senegal",
  "norway-france",
  "argentina-algeria",
  "argentina-austria",
  "usa-paraguay",
  "england-croatia",
  "spain-cape-verde",
  "portugal-uzbekistan",
];

const popularMatchIds = new Set(popularMatchOrder);
const popularMatchRank = new Map(
  popularMatchOrder.map((matchId, index) => [matchId, index]),
);

const flagByTeam: Record<string, string> = {
  Algeria: "/matches/flag-algeria.webp",
  Argentina: "/matches/flag-argentina.webp",
  Australia: "/matches/flag-australia.webp",
  Austria: "/matches/flag-austria.webp",
  Belgium: "/matches/flag-belgium.webp",
  Brazil: "/matches/flag-brazil.webp",
  "Cape Verde": "/matches/flag-cape-verde.webp",
  Colombia: "/matches/flag-colombia.webp",
  "Cote d'Ivoire": "/matches/flag-cote-divoire.webp",
  Croatia: "/matches/flag-croatia.webp",
  Curacao: "/matches/flag-curacao.webp",
  Ecuador: "/matches/flag-ecuador.webp",
  Egypt: "/matches/flag-egypt.webp",
  England: "/matches/flag-england.webp",
  France: "/matches/flag-france.webp",
  Germany: "/matches/flag-germany.webp",
  Ghana: "/matches/flag-ghana.webp",
  Haiti: "/matches/flag-haiti.webp",
  Iran: "/matches/flag-iran.webp",
  Japan: "/matches/flag-japan.webp",
  Jordan: "/matches/flag-jordan.webp",
  Morocco: "/matches/flag-morocco.webp",
  Netherlands: "/matches/flag-netherlands.webp",
  "New Zealand": "/matches/flag-new-zealand.webp",
  Norway: "/matches/flag-norway.webp",
  Panama: "/matches/flag-panama.webp",
  Paraguay: "/matches/flag-paraguay.webp",
  Portugal: "/matches/flag-portugal.webp",
  Qatar: "/matches/flag-qatar.webp",
  "Saudi Arabia": "/matches/flag-saudi-arabia.webp",
  Scotland: "/matches/flag-scotland.webp",
  Senegal: "/matches/flag-senegal.webp",
  "South Africa": "/matches/flag-south-africa.webp",
  Spain: "/matches/flag-spain.webp",
  Switzerland: "/matches/flag-switzerland.webp",
  Tunisia: "/matches/flag-tunisia.webp",
  "United States": "/matches/flag-usa.webp",
  Uruguay: "/matches/flag-uruguay.webp",
  Uzbekistan: "/matches/flag-uzbekistan.webp",
};

const matches: MatchCard[] = [
  {
    id: "grand-final",
    teamA: "Grand",
    teamB: "Final",
    date: "Sunday, July 19, 2026",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "FIFA World Cup 26 Final",
    status: "available",
    background: "/matches/stadium-b.webp",
    featured: true,
  },
  {
    id: "brazil-morocco",
    teamA: "Brazil",
    teamB: "Morocco",
    flagA: "/matches/flag-brazil.webp",
    flagB: "/matches/flag-morocco.webp",
    date: "Saturday, June 13 at 6:00 pm",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "M7: Brazil vs. Morocco",
    status: "available",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "france-senegal",
    teamA: "France",
    teamB: "Senegal",
    flagA: "/matches/flag-france.webp",
    flagB: "/matches/flag-senegal.webp",
    date: "Tuesday, June 16",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "France vs. Senegal",
    status: "available",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "argentina-algeria",
    teamA: "Argentina",
    teamB: "Algeria",
    flagA: "/matches/flag-argentina.webp",
    flagB: "/matches/flag-algeria.webp",
    date: "Tuesday, June 16",
    city: "Kansas City",
    stadium: "Arrowhead Stadium",
    code: "Argentina vs. Algeria",
    status: "available",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "usa-paraguay",
    teamA: "United States",
    teamB: "Paraguay",
    flagA: "/matches/flag-usa.webp",
    flagB: "/matches/flag-paraguay.webp",
    date: "Friday, June 12 at 6:00 pm",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    code: "M4: United States vs. Paraguay",
    status: "available",
    background: "/matches/stadium-la.webp",
  },
  {
    id: "england-croatia",
    teamA: "England",
    teamB: "Croatia",
    flagA: "/matches/flag-england.webp",
    flagB: "/matches/flag-croatia.webp",
    date: "Wednesday, June 17",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "England vs. Croatia",
    status: "available",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "spain-cape-verde",
    teamA: "Spain",
    teamB: "Cape Verde",
    flagA: "/matches/flag-spain.webp",
    flagB: "/matches/flag-cape-verde.webp",
    date: "Monday, June 15",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Spain vs. Cape Verde",
    status: "available",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "south-africa-uefa-d",
    teamA: "South Africa",
    teamB: "UEFA D",
    date: "Thursday, June 18",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "South Africa vs. UEFA D",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "spain-saudi-arabia",
    teamA: "Spain",
    teamB: "Saudi Arabia",
    flagA: "/matches/flag-spain.webp",
    date: "Sunday, June 21",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Spain vs. Saudi Arabia",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "morocco-haiti",
    teamA: "Morocco",
    teamB: "Haiti",
    flagA: "/matches/flag-morocco.webp",
    date: "Wednesday, June 24",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Morocco vs. Haiti",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "uzbekistan-playoff-1",
    teamA: "Uzbekistan",
    teamB: "Playoff 1",
    date: "Saturday, June 27",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Uzbekistan vs. Playoff 1",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "atlanta-round-of-16",
    teamA: "Round",
    teamB: "of 16",
    date: "Round of 16",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Round of 16 match",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "atlanta-quarterfinal",
    teamA: "Quarter",
    teamB: "Final",
    date: "Quarter-final",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Quarter-final match",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "atlanta-semifinal",
    teamA: "Semi",
    teamB: "Final",
    date: "Semi-final",
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    code: "Semi-final match",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "haiti-scotland",
    teamA: "Haiti",
    teamB: "Scotland",
    date: "Saturday, June 13",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "Haiti vs. Scotland",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "norway-playoff-2",
    teamA: "Norway",
    teamB: "Playoff 2",
    date: "Tuesday, June 16",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "Norway vs. Playoff 2",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "scotland-morocco",
    teamA: "Scotland",
    teamB: "Morocco",
    flagB: "/matches/flag-morocco.webp",
    date: "Friday, June 19",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "Scotland vs. Morocco",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "england-ghana",
    teamA: "England",
    teamB: "Ghana",
    flagA: "/matches/flag-england.webp",
    date: "Tuesday, June 23",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "England vs. Ghana",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "japan-uefa-b",
    teamA: "Japan",
    teamB: "UEFA B",
    date: "Thursday, June 25",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "Japan vs. UEFA B",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "norway-france",
    teamA: "Norway",
    teamB: "France",
    flagB: "/matches/flag-france.webp",
    date: "Friday, June 26",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "Norway vs. France",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "boston-round-of-16",
    teamA: "Round",
    teamB: "of 16",
    date: "Round of 16",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "Round of 16 match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "boston-quarterfinal",
    teamA: "Quarter",
    teamB: "Final",
    date: "Quarter-final",
    city: "Boston",
    stadium: "Gillette Stadium",
    code: "Quarter-final match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "netherlands-japan",
    teamA: "Netherlands",
    teamB: "Japan",
    date: "Sunday, June 14",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "Netherlands vs. Japan",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "argentina-austria",
    teamA: "Argentina",
    teamB: "Austria",
    flagA: "/matches/flag-argentina.webp",
    date: "Monday, June 22",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "Argentina vs. Austria",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "jordan-argentina",
    teamA: "Jordan",
    teamB: "Argentina",
    flagB: "/matches/flag-argentina.webp",
    date: "Saturday, June 27",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "Jordan vs. Argentina",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "dallas-round-of-16-a",
    teamA: "Round",
    teamB: "of 16",
    date: "Round of 16",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "Round of 16 match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "dallas-round-of-16-b",
    teamA: "Round",
    teamB: "of 16",
    date: "Round of 16",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "Round of 16 match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "dallas-quarterfinal",
    teamA: "Quarter",
    teamB: "Final",
    date: "Quarter-final",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "Quarter-final match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "dallas-semifinal",
    teamA: "Semi",
    teamB: "Final",
    date: "Tuesday, July 14",
    city: "Dallas",
    stadium: "AT&T Stadium",
    code: "Semi-final match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "germany-curacao",
    teamA: "Germany",
    teamB: "Curacao",
    date: "Sunday, June 14",
    city: "Houston",
    stadium: "NRG Stadium",
    code: "Germany vs. Curacao",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "portugal-playoff-1",
    teamA: "Portugal",
    teamB: "Playoff 1",
    date: "Wednesday, June 17",
    city: "Houston",
    stadium: "NRG Stadium",
    code: "Portugal vs. Playoff 1",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "netherlands-uefa-b",
    teamA: "Netherlands",
    teamB: "UEFA B",
    date: "Saturday, June 20",
    city: "Houston",
    stadium: "NRG Stadium",
    code: "Netherlands vs. UEFA B",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "portugal-uzbekistan",
    teamA: "Portugal",
    teamB: "Uzbekistan",
    date: "Tuesday, June 23",
    city: "Houston",
    stadium: "NRG Stadium",
    code: "Portugal vs. Uzbekistan",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "cape-verde-saudi",
    teamA: "Cape Verde",
    teamB: "Saudi Arabia",
    flagA: "/matches/flag-cape-verde.webp",
    date: "Friday, June 26",
    city: "Houston",
    stadium: "NRG Stadium",
    code: "Cape Verde vs. Saudi Arabia",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "houston-knockout",
    teamA: "Knockout",
    teamB: "Match",
    date: "Knockout stage",
    city: "Houston",
    stadium: "NRG Stadium",
    code: "Knockout stage match",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "ecuador-curacao",
    teamA: "Ecuador",
    teamB: "Curacao",
    date: "Saturday, June 20",
    city: "Kansas City",
    stadium: "Arrowhead Stadium",
    code: "Ecuador vs. Curacao",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "tunisia-netherlands",
    teamA: "Tunisia",
    teamB: "Netherlands",
    date: "Thursday, June 25",
    city: "Kansas City",
    stadium: "Arrowhead Stadium",
    code: "Tunisia vs. Netherlands",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "algeria-austria",
    teamA: "Algeria",
    teamB: "Austria",
    flagA: "/matches/flag-algeria.webp",
    date: "Saturday, June 27",
    city: "Kansas City",
    stadium: "Arrowhead Stadium",
    code: "Algeria vs. Austria",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "kansas-quarterfinal",
    teamA: "Quarter",
    teamB: "Final",
    date: "Quarter-final",
    city: "Kansas City",
    stadium: "Arrowhead Stadium",
    code: "Quarter-final match",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "iran-new-zealand",
    teamA: "Iran",
    teamB: "New Zealand",
    date: "Monday, June 15",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    code: "Iran vs. New Zealand",
    status: "unavailable",
    background: "/matches/stadium-la.webp",
  },
  {
    id: "switzerland-uefa-a",
    teamA: "Switzerland",
    teamB: "UEFA A",
    date: "Thursday, June 18",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    code: "Switzerland vs. UEFA A",
    status: "unavailable",
    background: "/matches/stadium-la.webp",
  },
  {
    id: "belgium-iran",
    teamA: "Belgium",
    teamB: "Iran",
    date: "Sunday, June 21",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    code: "Belgium vs. Iran",
    status: "unavailable",
    background: "/matches/stadium-la.webp",
  },
  {
    id: "uefa-c-usa",
    teamA: "UEFA C",
    teamB: "United States",
    flagB: "/matches/flag-usa.webp",
    date: "Thursday, June 25",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    code: "UEFA C vs. United States",
    status: "unavailable",
    background: "/matches/stadium-la.webp",
  },
  {
    id: "la-knockout",
    teamA: "Knockout",
    teamB: "Match",
    date: "Knockout stage",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    code: "Knockout stage match",
    status: "unavailable",
    background: "/matches/stadium-la.webp",
  },
  {
    id: "saudi-uruguay",
    teamA: "Saudi Arabia",
    teamB: "Uruguay",
    date: "Monday, June 15",
    city: "Miami",
    stadium: "Hard Rock Stadium",
    code: "Saudi Arabia vs. Uruguay",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "uruguay-cape-verde",
    teamA: "Uruguay",
    teamB: "Cape Verde",
    flagB: "/matches/flag-cape-verde.webp",
    date: "Sunday, June 21",
    city: "Miami",
    stadium: "Hard Rock Stadium",
    code: "Uruguay vs. Cape Verde",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "brazil-scotland",
    teamA: "Brazil",
    teamB: "Scotland",
    flagA: "/matches/flag-brazil.webp",
    date: "Wednesday, June 24",
    city: "Miami",
    stadium: "Hard Rock Stadium",
    code: "Brazil vs. Scotland",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "colombia-portugal",
    teamA: "Colombia",
    teamB: "Portugal",
    date: "Saturday, June 27",
    city: "Miami",
    stadium: "Hard Rock Stadium",
    code: "Colombia vs. Portugal",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "miami-knockout",
    teamA: "Knockout",
    teamB: "Match",
    date: "Knockout stage",
    city: "Miami",
    stadium: "Hard Rock Stadium",
    code: "Knockout stage match",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "norway-senegal",
    teamA: "Norway",
    teamB: "Senegal",
    flagB: "/matches/flag-senegal.webp",
    date: "Monday, June 22",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "Norway vs. Senegal",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "ecuador-germany",
    teamA: "Ecuador",
    teamB: "Germany",
    date: "Thursday, June 25",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "Ecuador vs. Germany",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "panama-england",
    teamA: "Panama",
    teamB: "England",
    flagB: "/matches/flag-england.webp",
    date: "Saturday, June 27",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "Panama vs. England",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "ny-knockout",
    teamA: "Knockout",
    teamB: "Match",
    date: "Knockout stage",
    city: "New York / New Jersey",
    stadium: "MetLife Stadium",
    code: "Knockout stage match",
    status: "unavailable",
    background: "/matches/stadium-b.webp",
  },
  {
    id: "cote-divoire-ecuador",
    teamA: "Cote d'Ivoire",
    teamB: "Ecuador",
    date: "Sunday, June 14",
    city: "Philadelphia",
    stadium: "Lincoln Financial Field",
    code: "Cote d'Ivoire vs. Ecuador",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "brazil-haiti",
    teamA: "Brazil",
    teamB: "Haiti",
    flagA: "/matches/flag-brazil.webp",
    date: "Friday, June 19",
    city: "Philadelphia",
    stadium: "Lincoln Financial Field",
    code: "Brazil vs. Haiti",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "france-playoff-2",
    teamA: "France",
    teamB: "Playoff 2",
    flagA: "/matches/flag-france.webp",
    date: "Monday, June 22",
    city: "Philadelphia",
    stadium: "Lincoln Financial Field",
    code: "France vs. Playoff 2",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "curacao-cote-divoire",
    teamA: "Curacao",
    teamB: "Cote d'Ivoire",
    date: "Thursday, June 25",
    city: "Philadelphia",
    stadium: "Lincoln Financial Field",
    code: "Curacao vs. Cote d'Ivoire",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "croatia-ghana",
    teamA: "Croatia",
    teamB: "Ghana",
    flagA: "/matches/flag-croatia.webp",
    date: "Saturday, June 27",
    city: "Philadelphia",
    stadium: "Lincoln Financial Field",
    code: "Croatia vs. Ghana",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "philadelphia-knockout",
    teamA: "Knockout",
    teamB: "Match",
    date: "Knockout stage",
    city: "Philadelphia",
    stadium: "Lincoln Financial Field",
    code: "Knockout stage match",
    status: "unavailable",
    background: "/matches/stadium-a.webp",
  },
  {
    id: "qatar-switzerland",
    teamA: "Qatar",
    teamB: "Switzerland",
    date: "Saturday, June 13",
    city: "San Francisco Bay Area",
    stadium: "Levi's Stadium",
    code: "Qatar vs. Switzerland",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "austria-jordan",
    teamA: "Austria",
    teamB: "Jordan",
    date: "Tuesday, June 16",
    city: "San Francisco Bay Area",
    stadium: "Levi's Stadium",
    code: "Austria vs. Jordan",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "uefa-c-paraguay",
    teamA: "UEFA C",
    teamB: "Paraguay",
    flagB: "/matches/flag-paraguay.webp",
    date: "Friday, June 19",
    city: "San Francisco Bay Area",
    stadium: "Levi's Stadium",
    code: "UEFA C vs. Paraguay",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "jordan-algeria",
    teamA: "Jordan",
    teamB: "Algeria",
    flagB: "/matches/flag-algeria.webp",
    date: "Monday, June 22",
    city: "San Francisco Bay Area",
    stadium: "Levi's Stadium",
    code: "Jordan vs. Algeria",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "paraguay-australia",
    teamA: "Paraguay",
    teamB: "Australia",
    flagA: "/matches/flag-paraguay.webp",
    date: "Thursday, June 25",
    city: "San Francisco Bay Area",
    stadium: "Levi's Stadium",
    code: "Paraguay vs. Australia",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "sf-knockout",
    teamA: "Knockout",
    teamB: "Match",
    date: "Knockout stage",
    city: "San Francisco Bay Area",
    stadium: "Levi's Stadium",
    code: "Knockout stage match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "belgium-egypt",
    teamA: "Belgium",
    teamB: "Egypt",
    date: "Monday, June 15",
    city: "Seattle",
    stadium: "Lumen Field",
    code: "Belgium vs. Egypt",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "usa-australia",
    teamA: "United States",
    teamB: "Australia",
    flagA: "/matches/flag-usa.webp",
    date: "Friday, June 19",
    city: "Seattle",
    stadium: "Lumen Field",
    code: "United States vs. Australia",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "uefa-a-qatar",
    teamA: "UEFA A",
    teamB: "Qatar",
    date: "Wednesday, June 24",
    city: "Seattle",
    stadium: "Lumen Field",
    code: "UEFA A vs. Qatar",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "seattle-round-of-16",
    teamA: "Round",
    teamB: "of 16",
    date: "Round of 16",
    city: "Seattle",
    stadium: "Lumen Field",
    code: "Round of 16 match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
  {
    id: "seattle-quarterfinal",
    teamA: "Quarter",
    teamB: "Final",
    date: "Quarter-final",
    city: "Seattle",
    stadium: "Lumen Field",
    code: "Quarter-final match",
    status: "unavailable",
    background: "/matches/stadium-c.webp",
  },
];

function getFilteredMatches(activeFilter: FilterKey, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  const filteredMatches = matches.filter((match) => {
    const searchable = [
      match.teamA,
      match.teamB,
      match.city,
      match.stadium,
      match.date,
      match.code,
      match.status,
    ]
      .join(" ")
      .toLowerCase();

    if (normalizedQuery && !searchable.includes(normalizedQuery)) {
      return false;
    }

    if (activeFilter === "popular") {
      return popularMatchIds.has(match.id);
    }

    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "available" || activeFilter === "unavailable") {
      return match.status === activeFilter;
    }

    return true;
  });

  if (activeFilter === "popular") {
    return filteredMatches.sort(
      (firstMatch, secondMatch) =>
        (popularMatchRank.get(firstMatch.id) ?? 0) -
        (popularMatchRank.get(secondMatch.id) ?? 0),
    );
  }

  return filteredMatches;
}

function FlagImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <span className="flex h-8 w-11 items-center justify-center rounded-sm bg-white/15 text-[10px] font-bold text-white">
        FIFA
      </span>
    );
  }

  return (
    <Image
      className="h-8 w-11 rounded-sm object-cover shadow-[0_5px_18px_rgba(0,0,0,0.25)]"
      src={src}
      alt={alt}
      width={72}
      height={48}
    />
  );
}

function MatchCardView({
  formattedPrice,
  match,
  t,
}: {
  formattedPrice?: string;
  match: MatchCard;
  t: (key: string) => string;
}) {
  const flagA = match.flagA ?? flagByTeam[match.teamA];
  const flagB = match.flagB ?? flagByTeam[match.teamB];
  const background = getStadiumBackground(match.stadium, match.background);

  return (
    <article className="min-w-[300px] overflow-hidden rounded-[14px] border border-white/10 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.32)] sm:min-w-[326px]">
      <div
        className="relative h-[238px] bg-cover bg-center"
        style={{ backgroundImage: `url('${background}')` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,13,31,0.15),rgba(3,13,31,0.78))]" />
        {match.featured ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#F3D788] px-3 py-1 text-[11px] font-extrabold uppercase text-[#030D1F]">
            <HugeiconsIcon icon={StarIcon} size={13} strokeWidth={2.4} />
            {t("matches.final")}
          </span>
        ) : null}
        {match.status === "available" && !match.featured ? (
          <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#ff3157]">
            {t("matches.fast")}
          </span>
        ) : null}
        {match.status === "unavailable" ? (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#5b6473]">
            {t("matches.waitlist")}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="mb-4 flex items-center justify-between">
            <FlagImage src={flagA} alt={`${match.teamA} flag`} />
            <FlagImage src={flagB} alt={`${match.teamB} flag`} />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <h3 className="font-title text-[34px] uppercase leading-[0.82]">
              {match.teamA}
            </h3>
            <span className="font-title text-[18px]">vs</span>
            <h3 className="font-title text-right text-[34px] uppercase leading-[0.82]">
              {match.teamB}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-5 py-5 text-[14px] text-[#465366]">
        <p className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={2} />
          <span>{match.date}</span>
        </p>
        <p className="flex items-center gap-2 font-bold">
          <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={2} />
          <span>
            {match.city} · {match.stadium},{" "}
            <span className="font-medium">USA</span>
          </span>
        </p>
        <p className="flex items-center gap-2">
          <HugeiconsIcon icon={Ticket01Icon} size={16} strokeWidth={2} />
          <span>{match.code}</span>
        </p>
      </div>

      <div className="border-t border-[#e8edf4] bg-[#f8faff] text-[15px] font-semibold text-[#465366]">
        {match.status === "available" ? (
          <Link
            className="flex items-center justify-between px-5 py-4 transition hover:bg-[#eef3ff] hover:text-[#19279B]"
            href={`/matches/${match.id}`}
          >
            <span>{t("matches.buy")}</span>
            <span className="flex items-center gap-3">
              {formattedPrice ? (
                <span className="text-right">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7a8495]">
                    {t("matches.from")}
                  </span>
                  <span className="font-title text-[25px] leading-none text-[#19279B]">
                    {formattedPrice}
                  </span>
                </span>
              ) : null}
              <HugeiconsIcon
                icon={match.featured ? ChampionIcon : ArrowRight01Icon}
                size={18}
                strokeWidth={2}
              />
            </span>
          </Link>
        ) : (
          <div className="px-5 py-4">
            <span className="text-[#e92c45]">{t("matches.closed")}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export function MatchesSection() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("popular");
  const [query, setQuery] = useState("");
  const { productPrice, t } = useWorldwide();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDragging: false,
    scrollLeft: 0,
    startX: 0,
  });
  const filteredMatches = useMemo(
    () => getFilteredMatches(activeFilter, query),
    [activeFilter, query],
  );

  const scrollCards = (direction: "left" | "right") => {
    scrollerRef.current?.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -352 : 352,
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) {
      return;
    }

    if (
      event.target instanceof Element &&
      event.target.closest("a, button, input")
    ) {
      return;
    }

    dragState.current = {
      isDragging: true,
      scrollLeft: scrollerRef.current.scrollLeft,
      startX: event.clientX,
    };
    scrollerRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging || !scrollerRef.current) {
      return;
    }

    const distance = event.clientX - dragState.current.startX;
    scrollerRef.current.scrollLeft = dragState.current.scrollLeft - distance;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragState.current.isDragging = false;
    scrollerRef.current?.releasePointerCapture(event.pointerId);
  };

  return (
    <section
      data-matches-section
      id="matches"
      className="overflow-hidden rounded-t-[50px] bg-[#030D1F] px-5 py-20 text-white sm:rounded-t-[100px] sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-[#B1BCFF]">
              {t("matches.kicker")}
            </p>
            <h2 className="font-title text-[64px] uppercase leading-[0.82] sm:text-[92px]">
              {t("matches.title")}
            </h2>
          </div>

          <div className="w-full max-w-xl">
            <label className="flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 text-white/75">
              <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={2} />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/45"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("matches.search")}
                type="search"
                value={query}
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-white text-[#030D1F]"
                    : "border border-white/12 text-white/72 hover:border-white/30 hover:text-white"
                }`}
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                type="button"
              >
                {t(filter.labelKey)}
              </button>
            );
          })}
        </div>

        <div
          className="scrollbar-none mt-10 flex cursor-grab gap-6 overflow-x-auto pb-2 active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={scrollerRef}
        >
          {filteredMatches.map((match) => (
            <MatchCardView
              formattedPrice={
                match.status === "available" ? productPrice(match.id) : undefined
              }
              key={match.id}
              match={match}
              t={t}
            />
          ))}
        </div>

        <div className="mt-7 flex justify-center gap-6">
          <button
            aria-label="Previous matches"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/8 hover:text-white"
            onClick={() => scrollCards("left")}
            type="button"
          >
            <HugeiconsIcon
              className="rotate-180"
              icon={ArrowRight01Icon}
              size={24}
              strokeWidth={2}
            />
          </button>
          <button
            aria-label="Next matches"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/8 hover:text-white"
            onClick={() => scrollCards("right")}
            type="button"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
