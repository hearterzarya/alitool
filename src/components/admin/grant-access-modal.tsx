'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GrantAccessModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: { id: string; name: string | null; email: string } | null;
    tools: Array<{ id: string; name: string }>;
    bundles: Array<{ id: string; name: string }>;
    onSuccess: () => void;
}

export function GrantAccessModal({
    open,
    onOpenChange,
    user,
    tools,
    bundles,
    onSuccess
}: GrantAccessModalProps) {
    const [loading, setLoading] = useState(false);
    const [accessType, setAccessType] = useState<'TOOL' | 'BUNDLE'>('TOOL');
    const [selectedId, setSelectedId] = useState<string>('');
    const [planType, setPlanType] = useState<string>('SHARED');
    const [duration, setDuration] = useState<string>('30');
    const { toast } = useToast();

    const handleGrantAccess = async () => {
        if (!user || !selectedId) return;

        setLoading(true);
        try {
            const response = await fetch('/api/admin/grant-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    [accessType === 'TOOL' ? 'toolId' : 'bundleId']: selectedId,
                    planType,
                    durationDays: parseInt(duration),
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Success',
                    description: 'Access granted successfully',
                });
                onOpenChange(false);
                onSuccess();
                // Reset form
                setSelectedId('');
                setDuration('30');
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Failed to grant access',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error granting access:', error);
            toast({
                title: 'Error',
                description: 'Failed to grant access',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Grant Manual Access</DialogTitle>
                    <DialogDescription>
                        Give {user?.name || user?.email} access to a tool or bundle without payment.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex gap-4">
                        <Button
                            variant={accessType === 'TOOL' ? 'default' : 'outline'}
                            onClick={() => { setAccessType('TOOL'); setSelectedId(''); }}
                            className="flex-1"
                        >
                            Single Tool
                        </Button>
                        <Button
                            variant={accessType === 'BUNDLE' ? 'default' : 'outline'}
                            onClick={() => { setAccessType('BUNDLE'); setSelectedId(''); }}
                            className="flex-1"
                        >
                            Bundle
                        </Button>
                    </div>

                    <div>
                        <Label htmlFor="select-item">Select {accessType === 'TOOL' ? 'Tool' : 'Bundle'}</Label>
                        <Select value={selectedId} onValueChange={setSelectedId}>
                            <SelectTrigger>
                                <SelectValue placeholder={`Choose a ${accessType === 'TOOL' ? 'tool' : 'bundle'}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {accessType === 'TOOL' ? (
                                    tools.map(tool => (
                                        <SelectItem key={tool.id} value={tool.id}>{tool.name}</SelectItem>
                                    ))
                                ) : (
                                    bundles.map(bundle => (
                                        <SelectItem key={bundle.id} value={bundle.id}>{bundle.name}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="plan-type">Plan Type</Label>
                        <Select value={planType} onValueChange={setPlanType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select plan type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SHARED">Shared Plan</SelectItem>
                                <SelectItem value="PRIVATE">Private Plan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">7 Days</SelectItem>
                                <SelectItem value="30">30 Days (1 Month)</SelectItem>
                                <SelectItem value="90">90 Days (3 Months)</SelectItem>
                                <SelectItem value="180">180 Days (6 Months)</SelectItem>
                                <SelectItem value="365">365 Days (1 Year)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleGrantAccess}
                        disabled={loading || !selectedId}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Granting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Grant Access
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
