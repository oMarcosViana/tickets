"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/lib/site-config";

const PASSWORD_STORAGE_KEY = "worldcup-config-password";

function emptyConfig(): SiteConfig {
  return {
    activeCheckoutGroupId: "group-1",
    checkoutGroups: [],
    games: [],
    utmfyScripts: [],
  };
}

function createGroupId() {
  return `group-${Date.now().toString(36)}`;
}

export function ConfigClient() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(emptyConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const totalPrice = useMemo(
    () => config.games.reduce((sum, game) => sum + Number(game.priceUsd), 0),
    [config.games],
  );

  useEffect(() => {
    const savedPassword = window.localStorage.getItem(PASSWORD_STORAGE_KEY);

    if (savedPassword) {
      queueMicrotask(() => {
        setPassword(savedPassword);
        setIsAuthenticated(true);
      });
    }

    fetch("/api/config", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { config: SiteConfig }) => {
        setConfig(payload.config);
      })
      .catch(() => {
        setMessage("Could not load the saved configuration.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const updateGame = (
    gameId: string,
    key: "priceUsd" | "oldPriceUsd",
    value: string,
  ) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      games: currentConfig.games.map((game) => {
        if (game.id !== gameId) {
          return game;
        }

        return {
          ...game,
          [key]: Number(value),
        };
      }),
    }));
  };

  const updateCheckoutGroupLabel = (groupId: string, value: string) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      checkoutGroups: currentConfig.checkoutGroups.map((group) =>
        group.id === groupId ? { ...group, label: value } : group,
      ),
    }));
  };

  const updateCheckoutGroupLink = (
    groupId: string,
    gameId: string,
    value: string,
  ) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      checkoutGroups: currentConfig.checkoutGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              productLinks: { ...group.productLinks, [gameId]: value },
            }
          : group,
      ),
    }));
  };

  const addCheckoutGroup = () => {
    setConfig((currentConfig) => {
      const firstGroup = currentConfig.checkoutGroups[0];
      const nextGroup = {
        id: createGroupId(),
        label: `Group ${currentConfig.checkoutGroups.length + 1}`,
        productLinks: Object.fromEntries(
          currentConfig.games.map((game) => [
            game.id,
            firstGroup?.productLinks[game.id] ?? game.checkoutUrl ?? "",
          ]),
        ),
      };

      return {
        ...currentConfig,
        checkoutGroups: [...currentConfig.checkoutGroups, nextGroup],
      };
    });
  };

  const removeCheckoutGroup = (groupId: string) => {
    setConfig((currentConfig) => {
      if (currentConfig.checkoutGroups.length <= 1) {
        return currentConfig;
      }

      const checkoutGroups = currentConfig.checkoutGroups.filter(
        (group) => group.id !== groupId,
      );

      return {
        ...currentConfig,
        activeCheckoutGroupId:
          currentConfig.activeCheckoutGroupId === groupId
            ? checkoutGroups[0]?.id
            : currentConfig.activeCheckoutGroupId,
        checkoutGroups,
      };
    });
  };

  const activateCheckoutGroup = (groupId: string) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      activeCheckoutGroupId: groupId,
    }));
  };

  const updateScript = (index: number, value: string) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      utmfyScripts: currentConfig.utmfyScripts.map((script, scriptIndex) =>
        scriptIndex === index ? value : script,
      ),
    }));
  };

  const addScript = () => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      utmfyScripts: [...currentConfig.utmfyScripts, ""],
    }));
  };

  const removeScript = (index: number) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      utmfyScripts: currentConfig.utmfyScripts.filter(
        (_, scriptIndex) => scriptIndex !== index,
      ),
    }));
  };

  const handleLogin = () => {
    const normalizedPassword = password.trim();

    window.localStorage.setItem(PASSWORD_STORAGE_KEY, normalizedPassword);
    setPassword(normalizedPassword);
    setIsAuthenticated(true);
    setMessage("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    const savedPassword =
      password.trim() || window.localStorage.getItem(PASSWORD_STORAGE_KEY) || "";

    const response = await fetch("/api/config", {
      body: JSON.stringify({ config, password: savedPassword }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.localStorage.removeItem(PASSWORD_STORAGE_KEY);
        setIsAuthenticated(false);
        setPassword("");
        setMessage("Password expired or invalid. Please enter it again.");
      } else {
        setMessage("Save error. Please try again.");
      }
      setIsSaving(false);
      return;
    }

    const payload = (await response.json()) as { config: SiteConfig };
    setConfig(payload.config);
    setMessage("Configuration saved. Prices update on the landing page automatically.");
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" data-icon="inline-start" />
          Loading panel
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin panel</CardTitle>
            <CardDescription>
              Enter the local password to edit game prices and links.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleLogin();
                  }
                }}
                type="password"
                value={password}
              />
            </div>
            <Button onClick={handleLogin} type="button">
              Open panel
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Badge variant="outline">World Cup Hospitality</Badge>
            <div className="text-2xl font-semibold tracking-tight">
              Configuration panel
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Edit prices, checkout groups, internal match page links, and
              scripts from one clean white panel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                Landing
                <ExternalLink data-icon="inline-end" />
              </Link>
            </Button>
            <Button disabled={isSaving} onClick={handleSave} type="button">
              {isSaving ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <Save data-icon="inline-start" />
              )}
              Save changes
            </Button>
          </div>
        </div>

        {message ? (
          <div className="rounded-xl border bg-muted p-3 text-sm text-muted-foreground">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle>Games</CardTitle>
              <CardDescription>
                Prices are base USD values. Checkout URLs are managed in groups
                below, so you can rotate all match links together.
              </CardDescription>
              <CardAction>
                <Badge variant="secondary">{config.games.length} games</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead>Price USD</TableHead>
                    <TableHead>Old price USD</TableHead>
                    <TableHead>Page</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.games.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{game.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {game.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Input
                          min={0}
                          onChange={(event) =>
                            updateGame(game.id, "priceUsd", event.target.value)
                          }
                          type="number"
                          value={game.priceUsd}
                        />
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Input
                          min={0}
                          onChange={(event) =>
                            updateGame(
                              game.id,
                              "oldPriceUsd",
                              event.target.value,
                            )
                          }
                          type="number"
                          value={game.oldPriceUsd}
                        />
                      </TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/matches/${game.id}`}>
                            Open
                            <ExternalLink data-icon="inline-end" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checkout groups</CardTitle>
              <CardDescription>
                Select one active group. Each group needs one checkout URL for
                every sellable match.
              </CardDescription>
              <CardAction>
                <Button onClick={addCheckoutGroup} size="sm" type="button">
                  <Plus data-icon="inline-start" />
                  Add group
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {config.checkoutGroups.map((group) => {
                const isActive = config.activeCheckoutGroupId === group.id;

                return (
                  <div className="rounded-xl border p-4" key={group.id}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
                        <Label htmlFor={`${group.id}-label`}>Group label</Label>
                        <Input
                          id={`${group.id}-label`}
                          onChange={(event) =>
                            updateCheckoutGroupLabel(group.id, event.target.value)
                          }
                          value={group.label}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => activateCheckoutGroup(group.id)}
                          type="button"
                          variant={isActive ? "default" : "outline"}
                        >
                          {isActive ? "Active" : "Set active"}
                        </Button>
                        <Button
                          disabled={config.checkoutGroups.length <= 1}
                          onClick={() => removeCheckoutGroup(group.id)}
                          type="button"
                          variant="destructive"
                        >
                          <Trash2 data-icon="inline-start" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {config.games.map((game) => (
                        <div className="grid gap-2" key={`${group.id}-${game.id}`}>
                          <Label htmlFor={`${group.id}-${game.id}`}>
                            Checkout {game.name}
                          </Label>
                          <Input
                            id={`${group.id}-${game.id}`}
                            onChange={(event) =>
                              updateCheckoutGroupLink(
                                group.id,
                                game.id,
                                event.target.value,
                              )
                            }
                            value={group.productLinks[game.id] ?? ""}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Saved config file</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-xl bg-muted p-4">
                  <div className="text-sm text-muted-foreground">
                    Combined current prices
                  </div>
                  <div className="mt-1 text-3xl font-semibold">
                    ${totalPrice.toLocaleString("en-US")}
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <span>Source: data/site-config.json</span>
                  <span>Password default: aglomerado</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UTMFY script</CardTitle>
                <CardDescription>
                  Optional scripts stored with the panel configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {config.utmfyScripts.map((script, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <Label htmlFor={`script-${index}`}>Script {index + 1}</Label>
                    <Textarea
                      id={`script-${index}`}
                      onChange={(event) =>
                        updateScript(index, event.target.value)
                      }
                      rows={5}
                      value={script}
                    />
                    <Button
                      onClick={() => removeScript(index)}
                      size="sm"
                      type="button"
                      variant="destructive"
                    >
                      <Trash2 data-icon="inline-start" />
                      Remove script
                    </Button>
                  </div>
                ))}
                <Button onClick={addScript} type="button" variant="outline">
                  <Plus data-icon="inline-start" />
                  Add script
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
