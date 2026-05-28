import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from "./config";

type CopyValue = string | string[] | Record<string, string>;

export type WorldwideCopy = Record<string, CopyValue>;

export const enCopy = {
  "top.title": "GET CLOSER THAN EVER TO",
  "top.cta": "Secure ticket",
  "hero.kicker": "Visa x Coca-Cola Match Access Event",
  "hero.title1": "Event Access",
  "hero.title2": "Pitchside Lounge",
  "hero.title3": "World Cup 2026",
  "hero.description":
    "A premium experience with exclusive access, lounge hospitality, gastronomy and atmosphere. Limited batches released for a short time.",
  "ticket.batch": "Batch",
  "ticket.button": "Secure ticket",
  "lounge.title1": "Unrivaled",
  "lounge.title2": "Lounge Access",
  "lounge.subtitle": "Pitchside Lounge",
  "lounge.description":
    "Step into a realm where luxury hospitality and thrilling on-field action converge. Enjoy upscale dining with live-action cooking stations, gourmet offerings, and a premium beverage service served before and after the match. With unrivaled seat views located near the field along the sidelines, you are not just a spectator. You are part of the action.",
  "matches.kicker": "Official Hospitality",
  "matches.title": "Matches",
  "matches.search": "Search matches, cities, stadiums...",
  "matches.all": "All",
  "matches.popular": "Popular",
  "matches.available": "Available",
  "matches.unavailable": "Unavailable",
  "matches.buy": "Buy Now",
  "matches.from": "From",
  "matches.closed": "Closed",
  "matches.fast": "Going Fast",
  "matches.waitlist": "Waitlist",
  "matches.final": "Final",
  "detail.back": "Back to match list",
  "detail.view": "View details",
  "detail.package": "Pitchside Lounge Match Access",
  "detail.cart": "My Matches",
  "detail.quantity": "Quantity",
  "detail.each": "Each",
  "detail.total": "Total",
  "detail.checkout": "Checkout",
  "detail.timer": "You have {time} to complete your order",
  "detail.ticket": "ticket",
  "detail.tickets": "tickets",
  "faq.title": "Frequently Asked Questions",
  "faq.kicker": "Need to know",
  "faq.q1": "Do I need to be a Visa customer?",
  "faq.a1":
    "Not necessarily. Some releases may offer priority for Visa payments, but availability can vary by batch and match.",
  "faq.q2": "What is included in the Pitchside Lounge?",
  "faq.a2":
    "The experience may include premium lounge access, privileged views close to the field, gastronomy, dedicated service, and differentiated entry.",
  "faq.q3": "Are tickets limited?",
  "faq.a3":
    "Yes. Each match has an extremely limited number of available accesses, and some batches may sell out quickly.",
  "faq.q4": "How does the reservation work?",
  "faq.a4":
    "After checking availability, you can select your preferred match and proceed with the access request according to the conditions available at that moment.",
  "footer.purchasePrompt": "Not ready to make a purchase?",
  "footer.cta": "Register Interest",
  "footer.availability":
    "Interested in packages not available online? Please contact our hospitality team for current access availability.",
  "access.header": "Ticket Access",
  "access.confirmedOrder": "Confirmed order",
  "access.orderReceived": "Order received",
  "access.ticketHolder": "Ticket holder",
  "access.defaultPackage": "Hospitality Access",
  "access.purchase": "{date} purchase",
  "access.heroText":
    "Hi {customer}, your hospitality access page is active. Tickets are scheduled to unlock 6 hours before match time.",
  "access.matchDate": "Match date",
  "access.venue": "Venue",
  "access.quantity": "Quantity",
  "access.releaseTitle": "Ticket release",
  "access.releaseSubtitle": "6 hours before the match",
  "access.days": "Days",
  "access.hours": "Hours",
  "access.minutes": "Min",
  "access.seconds": "Sec",
  "access.processing": "Processing",
  "access.venueKicker": "Venue details",
  "access.venueTitle": "Matchday location",
  "access.venueDescription":
    "The access page stays available as your order moves toward the ticket release window.",
  "access.package": "Package",
  "access.status": "Status",
  "access.waiting": "Waiting for release",
  "access.faqKicker": "FAQ",
  "access.faqTitle": "Before kickoff",
  "access.faq.q1": "When will my ticket be released?",
  "access.faq.a1":
    "Your ticket and access instructions become available 6 hours before match time. Until then, follow the countdown on this page.",
  "access.faq.q2": "Do I need to refresh the page?",
  "access.faq.a2":
    "No. The countdown and progress bar update automatically as the release window approaches.",
  "access.faq.q3": "How can I access this page again?",
  "access.faq.a3":
    "Use the confirmation email link whenever you need to return. We recommend keeping that email saved until matchday.",
  "access.faq.q4": "What if my details are wrong?",
  "access.faq.a4":
    "Reply to the confirmation email if your name, match, quantity, venue, or package is incorrect.",
} satisfies WorldwideCopy;

const ptBrCopy = {
  ...enCopy,
  "top.title": "CHEGUE MAIS PERTO DO QUE NUNCA",
  "top.cta": "Garantir ingresso",
  "hero.kicker": "Evento Visa x Coca-Cola Match Access",
  "hero.title1": "Acesso ao Evento",
  "hero.title2": "Pitchside Lounge",
  "hero.title3": "Copa do Mundo 2026",
  "hero.description":
    "Uma experiência premium com acesso exclusivo, lounge hospitality, gastronomia e atmosfera. Lotes limitados liberados por pouco tempo.",
  "ticket.batch": "Lote",
  "ticket.button": "Garantir ingresso",
  "lounge.title1": "Acesso",
  "lounge.title2": "Lounge Exclusivo",
  "lounge.subtitle": "Pitchside Lounge",
  "lounge.description":
    "Entre em um ambiente onde hospitalidade de luxo e emoção dentro de campo se encontram. Aproveite gastronomia premium, estações ao vivo, bebidas selecionadas e uma vista privilegiada perto do gramado.",
  "matches.kicker": "Hospitalidade Oficial",
  "matches.title": "Jogos",
  "matches.search": "Buscar jogos, cidades, estádios...",
  "matches.all": "Todos",
  "matches.popular": "Populares",
  "matches.available": "Disponíveis",
  "matches.unavailable": "Indisponíveis",
  "matches.buy": "Comprar agora",
  "matches.from": "A partir de",
  "matches.closed": "Encerrado",
  "matches.fast": "Últimas unidades",
  "matches.waitlist": "Lista de espera",
  "matches.final": "Final",
  "detail.back": "Voltar para jogos",
  "detail.view": "Ver detalhes",
  "detail.package": "Acesso Pitchside Lounge",
  "detail.cart": "Meus Jogos",
  "detail.quantity": "Quantidade",
  "detail.each": "Cada",
  "detail.total": "Total",
  "detail.checkout": "Finalizar compra",
  "detail.timer": "Você tem {time} para concluir seu pedido",
  "detail.ticket": "ingresso",
  "detail.tickets": "ingressos",
  "faq.title": "Perguntas Frequentes",
  "faq.kicker": "O que saber",
  "faq.q1": "Preciso ser cliente da Visa?",
  "faq.a1":
    "Não necessariamente. Algumas liberações podem oferecer prioridade para pagamentos Visa, mas a disponibilidade pode variar por lote e partida.",
  "faq.q2": "O que está incluso no Pitchside Lounge?",
  "faq.a2":
    "A experiência pode incluir acesso premium ao lounge, vista privilegiada próxima ao campo, gastronomia, serviço dedicado e entrada diferenciada.",
  "faq.q3": "Os ingressos são limitados?",
  "faq.a3":
    "Sim. Cada jogo possui quantidade extremamente limitada de acessos disponíveis e alguns lotes podem esgotar rapidamente.",
  "faq.q4": "Como funciona a reserva?",
  "faq.a4":
    "Após verificar a disponibilidade, você poderá selecionar o jogo desejado e seguir para a solicitação de acesso conforme as condições disponíveis no momento.",
  "footer.purchasePrompt": "Ainda não está pronto para comprar?",
  "footer.cta": "Registrar interesse",
  "footer.availability":
    "Interessado em pacotes indisponíveis online? Fale com nossa equipe de hospitality para consultar a disponibilidade atual.",
  "access.header": "Acesso ao Ingresso",
  "access.confirmedOrder": "Pedido confirmado",
  "access.orderReceived": "Pedido recebido",
  "access.ticketHolder": "Cliente",
  "access.defaultPackage": "Acesso Hospitality",
  "access.purchase": "Compra em {date}",
  "access.heroText":
    "Olá {customer}, sua página de acesso hospitality está ativa. Os ingressos serão liberados 6 horas antes do horário do jogo.",
  "access.matchDate": "Data do jogo",
  "access.venue": "Estádio",
  "access.quantity": "Quantidade",
  "access.releaseTitle": "Liberação do ingresso",
  "access.releaseSubtitle": "6 horas antes do jogo",
  "access.days": "Dias",
  "access.hours": "Horas",
  "access.minutes": "Min",
  "access.seconds": "Seg",
  "access.processing": "Processando",
  "access.venueKicker": "Detalhes do estádio",
  "access.venueTitle": "Local do jogo",
  "access.venueDescription":
    "A página de acesso permanece disponível enquanto seu pedido avança para a janela de liberação do ingresso.",
  "access.package": "Pacote",
  "access.status": "Status",
  "access.waiting": "Aguardando liberação",
  "access.faqKicker": "FAQ",
  "access.faqTitle": "Antes do jogo",
  "access.faq.q1": "Quando meu ingresso será liberado?",
  "access.faq.a1":
    "O ingresso e as instruções de acesso ficam disponíveis 6 horas antes do horário do jogo. Até lá, acompanhe o cronômetro nesta página.",
  "access.faq.q2": "Preciso atualizar a página?",
  "access.faq.a2":
    "Não precisa. O cronômetro e a barra de progresso atualizam automaticamente enquanto a janela de liberação se aproxima.",
  "access.faq.q3": "Como acesso esta página de novo?",
  "access.faq.a3":
    "Use o link do email de confirmação sempre que quiser voltar. Recomendamos manter esse email salvo até o dia do jogo.",
  "access.faq.q4": "E se meus dados estiverem errados?",
  "access.faq.a4":
    "Responda ao email de confirmação se nome, jogo, quantidade, estádio ou pacote estiverem incorretos.",
} satisfies WorldwideCopy;

const compactTranslations: Partial<Record<SupportedLocale, Partial<WorldwideCopy>>> = {
  ar: { "top.cta": "احجز التذكرة", "matches.title": "المباريات" },
  de: { "top.cta": "Ticket sichern", "matches.title": "Spiele" },
  es: { "top.cta": "Asegurar entrada", "matches.title": "Partidos" },
  fr: { "top.cta": "Réserver", "matches.title": "Matchs" },
  he: { "top.cta": "הבטח כרטיס", "matches.title": "משחקים" },
  hi: { "top.cta": "टिकट सुरक्षित करें", "matches.title": "मैच" },
  id: { "top.cta": "Amankan tiket", "matches.title": "Pertandingan" },
  it: { "top.cta": "Assicura il biglietto", "matches.title": "Partite" },
  ja: { "top.cta": "チケットを確保", "matches.title": "試合" },
  ko: { "top.cta": "티켓 확보", "matches.title": "경기" },
  nl: { "top.cta": "Ticket reserveren", "matches.title": "Wedstrijden" },
  pl: { "top.cta": "Zarezerwuj bilet", "matches.title": "Mecze" },
  "pt-BR": ptBrCopy,
  "pt-PT": { ...ptBrCopy, "top.cta": "Garantir bilhete" },
  ru: { "top.cta": "Получить билет", "matches.title": "Матчи" },
  sv: { "top.cta": "Säkra biljett", "matches.title": "Matcher" },
  tr: { "top.cta": "Bileti al", "matches.title": "Maçlar" },
  "zh-Hans": { "top.cta": "确保门票", "matches.title": "比赛" },
  "zh-Hant": { "top.cta": "確保門票", "matches.title": "賽事" },
};

export const copyByLocale: Record<SupportedLocale, WorldwideCopy> =
  Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      { ...enCopy, ...compactTranslations[locale] },
    ]),
  ) as unknown as Record<SupportedLocale, WorldwideCopy>;

export function getCopy(locale: SupportedLocale) {
  return copyByLocale[locale] ?? copyByLocale[DEFAULT_LOCALE];
}
