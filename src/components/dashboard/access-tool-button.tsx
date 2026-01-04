'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Chrome } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccessToolButtonProps {
  tool: {
    id: string;
    name: string;
    toolUrl: string;
    cookiesEncrypted?: string | null;
  };
}

export function AccessToolButton({ tool }: AccessToolButtonProps) {
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccessTool = async () => {
    setLoading(true);

    try {
      // Check if extension is installed
      const hasExtension = await checkExtension();

      if (!hasExtension) {
        setShowExtensionModal(true);
        setLoading(false);
        return;
      }

      // Fetch cookies from API
      const response = await fetch(`/api/cookies/${tool.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch cookies");
      }

      const { cookies, url } = await response.json();

      // Send message to extension
      window.postMessage(
        {
          type: "GROWTOOLS_ACCESS",
          toolId: tool.id,
          url: url,
          cookies: cookies,
        },
        "*"
      );
    } catch (error) {
      console.error("Error accessing tool:", error);
      alert("Failed to access tool. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkExtension = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // For now, we'll just check if the message can be posted
      // In production, the extension would respond with a confirmation
      const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;

      if (!extensionId) {
        // Extension not configured, show modal
        resolve(false);
        return;
      }

      // Try to communicate with extension
      try {
        window.postMessage({ type: "GROWTOOLS_CHECK" }, "*");

        // Wait for response (timeout after 1 second)
        const timeout = setTimeout(() => resolve(false), 1000);

        const handler = (event: MessageEvent) => {
          if (event.data.type === "GROWTOOLS_INSTALLED") {
            clearTimeout(timeout);
            window.removeEventListener("message", handler);
            resolve(true);
          }
        };

        window.addEventListener("message", handler);
      } catch {
        resolve(false);
      }
    });
  };

  return (
    <>
      <Button
        className="w-full"
        onClick={handleAccessTool}
        disabled={loading || !tool.cookiesEncrypted}
      >
        {loading ? (
          "Loading..."
        ) : !tool.cookiesEncrypted ? (
          "Cookies not configured"
        ) : (
          <>
            <ExternalLink className="h-4 w-4 mr-2" />
            Access Tool
          </>
        )}
      </Button>

      {/* Extension Required Modal */}
      <Dialog open={showExtensionModal} onOpenChange={setShowExtensionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Chrome className="h-6 w-6 text-primary" />
              Extension Required
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>
                To access your tools, you need to install the GrowTools Browser Extension.
              </p>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How it works:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Install the browser extension</li>
                  <li>Click "Access Tool" button</li>
                  <li>Tool opens automatically with your account logged in</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <a
                    href="https://chrome.google.com/webstore"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    Install Extension
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setShowExtensionModal(false)}>
                  Maybe Later
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
