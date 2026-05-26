import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { WorldwideProvider } from "@/hooks/use-worldwide";
import { getSiteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Ingressos",
  description: "Landing page de ingressos criada com Next.js e Tailwind.",
};

function extractHeadScripts(scripts: string[]) {
  return scripts.flatMap((code, scriptIndex) => {
    const matches = [...code.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];

    if (!matches.length && code.trim()) {
      return [
        {
          attrs: {},
          content: code,
          key: `inline-${scriptIndex}`,
        },
      ];
    }

    return matches.map((match, matchIndex) => {
      const attrs: Record<string, string | boolean> = {};
      const rawAttrs = match[1] ?? "";

      for (const attr of rawAttrs.matchAll(
        /([a-zA-Z:-]+)(?:=["']?([^"'\s>]+)["']?)?/g,
      )) {
        attrs[attr[1]] = attr[2] ?? true;
      }

      return {
        attrs,
        content: match[2] ?? "",
        key: `script-${scriptIndex}-${matchIndex}`,
      };
    });
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  const headScripts = extractHeadScripts(config.utmfyScripts);

  return (
    <html lang="pt-BR" className={cn("font-sans", inter.variable)}>
      <head>
        {headScripts.map((script) => {
          const { src, ...attrs } = script.attrs;

          if (typeof src === "string") {
            return (
              <script
                {...attrs}
                defer={attrs.defer === undefined && attrs.async === undefined ? true : undefined}
                key={script.key}
                src={src}
              />
            );
          }

          return (
            <script
              {...attrs}
              dangerouslySetInnerHTML={{ __html: script.content }}
              key={script.key}
            />
          );
        })}
      </head>
      <body className={dmSans.variable}>
        <WorldwideProvider>{children}</WorldwideProvider>
      </body>
    </html>
  );
}
