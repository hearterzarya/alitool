'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AdminSettingsForm(props: {
  initialMetaPixelId: string;
  initialMetaPixelEnabled: boolean;
  initialWhatsappNumber: string;
  initialWhatsappDefaultMessage: string;
  initialTelegramLink: string;
}) {
  const [metaPixelId, setMetaPixelId] = useState(props.initialMetaPixelId);
  const [metaPixelEnabled, setMetaPixelEnabled] = useState(props.initialMetaPixelEnabled);
  const [whatsappNumber, setWhatsappNumber] = useState(props.initialWhatsappNumber);
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState(props.initialWhatsappDefaultMessage);
  const [telegramLink, setTelegramLink] = useState(props.initialTelegramLink);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metaPixelId,
          metaPixelEnabled,
          whatsappNumber,
          whatsappDefaultMessage,
          telegramLink,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save settings");
      }

      setSaved(true);
    } catch (e: any) {
      setError(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-green-50 text-green-800 text-sm p-3 rounded-md border border-green-200">
          Settings saved.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Support</CardTitle>
          <CardDescription>
            This number is used for the floating WhatsApp button, contact links, and order emails. Leave empty to use env vars (WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE) or the built-in default.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp number</Label>
            <Input
              id="whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="919155313223"
            />
            <p className="text-xs text-gray-500">
              Country code + number, no spaces or plus (e.g. 919155313223 for India).
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappDefaultMessage">Default pre-filled message</Label>
            <Textarea
              id="whatsappDefaultMessage"
              value={whatsappDefaultMessage}
              onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
              placeholder="Hello! I need help with my subscription."
              rows={2}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Telegram</CardTitle>
          <CardDescription>
            Telegram link or username for the floating Telegram button. Leave empty to hide the button. Use full URL (e.g. https://t.me/yourgroup) or username (e.g. yourgroup).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegramLink">Telegram link or username</Label>
            <Input
              id="telegramLink"
              value={telegramLink}
              onChange={(e) => setTelegramLink(e.target.value)}
              placeholder="https://t.me/yourgroup or yourgroup"
            />
            <p className="text-xs text-gray-500">
              Updates apply site-wide. You can also set TELEGRAM_LINK in env as fallback.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking Pixels</CardTitle>
          <CardDescription>Configure tracking pixels for the public website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="metaPixelEnabled"
              type="checkbox"
              checked={metaPixelEnabled}
              onChange={(e) => setMetaPixelEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="metaPixelEnabled" className="cursor-pointer">
              Enable Meta (Facebook) Pixel
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
            <Input
              id="metaPixelId"
              value={metaPixelId}
              onChange={(e) => setMetaPixelId(e.target.value)}
              placeholder="123456789012345"
            />
            <p className="text-xs text-gray-500">
              Paste your Pixel ID (numbers). We’ll inject the standard `fbq` snippet site-wide.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

