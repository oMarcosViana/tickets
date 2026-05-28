import type { Metadata } from "next";
import { TicketAccessClient, type TicketAccessData } from "./TicketAccessClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ticket access | FIFA World Cup 26",
  description: "Personalized ticket access page.",
};

type TicketAccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function TicketAccessPage({
  searchParams,
}: TicketAccessPageProps) {
  const params = await searchParams;
  const initialData: TicketAccessData = {
    customer: getParam(params, "customer"),
    date: getParam(params, "date"),
    match: getParam(params, "match"),
    order: getParam(params, "order"),
    purchaseDate: getParam(params, "purchase_date"),
    quantity: getParam(params, "quantity"),
    seat: getParam(params, "seat"),
    venue: getParam(params, "venue"),
  };

  return <TicketAccessClient initialData={initialData} />;
}
