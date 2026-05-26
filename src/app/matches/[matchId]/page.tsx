import { notFound } from "next/navigation";
import { MatchDetailClient } from "@/components/match-detail-client";
import {
  availableMatches,
  getAvailableMatch,
} from "@/data/available-matches";

type MatchPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export function generateStaticParams() {
  return availableMatches.map((match) => ({
    matchId: match.id,
  }));
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;
  const match = getAvailableMatch(matchId);

  if (!match) {
    notFound();
  }

  return (
    <MatchDetailClient
      availableMatches={availableMatches}
      match={match}
    />
  );
}
