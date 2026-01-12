'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Edit, GripVertical, X } from 'lucide-react';
import Image from 'next/image';

interface Screenshot {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewsManagementClientProps {
  screenshots: Screenshot[];
}

export function ReviewsManagementClient({ screenshots: initialScreenshots }: ReviewsManagementClientProps) {
  const [screenshots, setScreenshots] = useState(initialScreenshots);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScreenshot, setEditingScreenshot] = useState<Screenshot | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ imageUrl: '', caption: '', sortOrder: 0 });
  const { toast } = useToast();

  const handleOpenDialog = (screenshot?: Screenshot) => {
    if (screenshot) {
      setEditingScreenshot(screenshot);
      setFormData({
        imageUrl: screenshot.imageUrl,
        caption: screenshot.caption || '',
        sortOrder: screenshot.sortOrder,
      });
    } else {
      setEditingScreenshot(null);
      setFormData({ imageUrl: '', caption: '', sortOrder: screenshots.length });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingScreenshot(null);
    setFormData({ imageUrl: '', caption: '', sortOrder: 0 });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/reviews/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.imageUrl) {
      toast({
        title: 'Error',
        description: 'Please upload an image',
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = editingScreenshot
        ? `/api/admin/reviews/${editingScreenshot.id}`
        : '/api/admin/reviews';
      const method = editingScreenshot ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: editingScreenshot ? 'Screenshot updated' : 'Screenshot added',
        });

        if (editingScreenshot) {
          setScreenshots(prev =>
            prev.map(s => (s.id === editingScreenshot.id ? data.screenshot : s))
          );
        } else {
          setScreenshots(prev => [...prev, data.screenshot]);
        }

        handleCloseDialog();
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save screenshot',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this screenshot?')) return;

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Screenshot deleted',
        });
        setScreenshots(prev => prev.filter(s => s.id !== id));
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete screenshot',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await response.json();

      if (data.success) {
        setScreenshots(prev =>
          prev.map(s => (s.id === id ? { ...s, isActive: !isActive } : s))
        );
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reviews & Proofs Management</h1>
        <p className="text-slate-600">Manage WhatsApp purchase screenshots for the reviews page</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Screenshots</CardTitle>
              <CardDescription>
                Upload and manage WhatsApp purchase screenshots (7-8 recommended)
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Upload className="mr-2 h-4 w-4" />
              Add Screenshot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {screenshots.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No screenshots yet. Click "Add Screenshot" to upload one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((screenshot) => (
                <Card
                  key={screenshot.id}
                  className={`relative overflow-hidden ${!screenshot.isActive ? 'opacity-50' : ''}`}
                >
                  <div className="relative aspect-[9/16] w-full">
                    <Image
                      src={screenshot.imageUrl}
                      alt={screenshot.caption || 'Screenshot'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-600 mb-2 truncate">
                      {screenshot.caption || 'No caption'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(screenshot)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(screenshot.id, screenshot.isActive)}
                      >
                        {screenshot.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(screenshot.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingScreenshot ? 'Edit Screenshot' : 'Add Screenshot'}
            </DialogTitle>
            <DialogDescription>
              Upload a WhatsApp purchase screenshot for the reviews page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="image-upload">Image</Label>
              {!formData.imageUrl ? (
                <div className="mt-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-slate-500 mt-2">Uploading...</p>}
                </div>
              ) : (
                <div className="mt-2 relative">
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Enter caption..."
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.imageUrl || uploading}>
              {editingScreenshot ? 'Update' : 'Add'} Screenshot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
