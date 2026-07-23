'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TimelineEvent } from '@/types/database';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Edit2, Trash2, Save } from 'lucide-react';

export function TimelineCMS() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<TimelineEvent>>({});

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from('timeline_events')
        .select('*')
        .order('order_index', { ascending: true });

      if (dbError) throw dbError;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timeline events.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditingId(event.id);
    setFormData(event);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleCreateNew = () => {
    const newOrder = events.length > 0 ? Math.max(...events.map(e => e.order_index)) + 1 : 1;
    setEditingId('new');
    setFormData({
      stage_name: `Stage ${newOrder}`,
      title: '',
      date_range: '',
      description: '',
      color: '#FF9933',
      order_index: newOrder,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      if (editingId === 'new') {
        const { error: insertError } = await supabase
          .from('timeline_events')
          .insert([formData as TimelineEvent]);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('timeline_events')
          .update(formData)
          .eq('id', editingId);
        if (updateError) throw updateError;
      }
      await loadEvents();
      setEditingId(null);
      setFormData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save timeline event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete timeline event.');
      setLoading(false);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Timeline Stages</h2>
        <Button onClick={handleCreateNew} disabled={editingId !== null} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
          {error}
        </div>
      )}

      {editingId && (
        <Card className="border-primary/20 bg-surface/80">
          <CardHeader>
            <CardTitle className="text-lg">{editingId === 'new' ? 'New Stage' : 'Edit Stage'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stage Name (e.g., Stage 1)</Label>
                <Input value={formData.stage_name || ''} onChange={e => setFormData({ ...formData, stage_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Input value={formData.date_range || ''} onChange={e => setFormData({ ...formData, date_range: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Color (hex or tailwind class)</Label>
                <Input value={formData.color || ''} onChange={e => setFormData({ ...formData, color: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Description</Label>
                <textarea 
                  className="w-full bg-input/50 border border-border rounded-md p-2 text-sm min-h-[100px]"
                  value={formData.description || ''} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Order Index (sort order)</Label>
                <Input type="number" value={formData.order_index || 0} onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Image URL (Optional)</Label>
                <Input value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="/protest-1.jpg" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Stage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="border-primary/10 bg-surface/40">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {event.stage_name}
                  </span>
                  <span className="text-sm text-muted-foreground">{event.date_range}</span>
                </div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl mt-1">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => handleEdit(event)} disabled={editingId !== null}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => handleDelete(event.id)} disabled={editingId !== null} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
