'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ToolFormProps {
  tool?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string | null;
    category: string;
    icon?: string | null;
    toolUrl: string;
    priceMonthly: number;
    isActive: boolean;
    sortOrder: number;
    cookiesEncrypted?: string | null;
    cookiesExpiryDate?: Date | null;
  };
  mode: "create" | "edit";
}

export function ToolForm({ tool, mode }: ToolFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: tool?.name || "",
    slug: tool?.slug || "",
    description: tool?.description || "",
    shortDescription: tool?.shortDescription || "",
    category: tool?.category || "AI_WRITING",
    icon: tool?.icon || "",
    toolUrl: tool?.toolUrl || "",
    priceMonthly: tool ? tool.priceMonthly / 100 : 0,
    isActive: tool?.isActive ?? true,
    sortOrder: tool?.sortOrder || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = mode === "create" ? "/api/admin/tools" : `/api/admin/tools/${tool?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priceMonthly: Math.round(formData.priceMonthly * 100),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save tool");
      }

      router.push("/admin/tools");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tool details and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tool Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="ChatGPT Plus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="chatgpt-plus"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief description for cards"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description *</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Detailed description of the tool"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="AI_WRITING">AI Writing</option>
                <option value="SEO_TOOLS">SEO Tools</option>
                <option value="DESIGN">Design</option>
                <option value="PRODUCTIVITY">Productivity</option>
                <option value="CODE_DEV">Code & Dev</option>
                <option value="VIDEO_AUDIO">Video & Audio</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (emoji)</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="🤖"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toolUrl">Tool URL *</Label>
              <Input
                id="toolUrl"
                name="toolUrl"
                type="url"
                value={formData.toolUrl}
                onChange={handleChange}
                required
                placeholder="https://chat.openai.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceMonthly">Monthly Price (₹) *</Label>
              <Input
                id="priceMonthly"
                name="priceMonthly"
                type="number"
                step="0.01"
                value={formData.priceMonthly}
                onChange={handleChange}
                required
                placeholder="299"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Tool is active and available for subscription
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Tool" : "Update Tool"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tools")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
