'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  LogOut, 
  Check, 
  X, 
  Download, 
  Loader2, 
  MapPin, 
  Calendar, 
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';

import { TimelineCMS } from '@/components/admin/timeline-cms';
import { User } from '@supabase/supabase-js';
import { Submission, SubmissionStatus } from '@/types/database';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<User | { email: string } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  // Authenticate session or mock session on mount
  useEffect(() => {
    const loadMockSubmissions = () => {
      setSubmissions([
        { id: '1', city: 'Lucknow', locality: null, district: null, state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, participation_status: 'supporting', attendance: 'planning_to_attend', support_reason: 'We want transparency and accountability in governance.', desired_outcome: 'An independent oversight board.', age_group: '25-34', occupation: 'Software Engineer', student_field: null, status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString(), submission_hash: 'mock_hash' },
        { id: '2', city: 'Delhi', locality: null, district: null, state: 'Delhi', country: 'India', latitude: 28.7041, longitude: 77.1025, participation_status: 'participating', attendance: 'already_attended', support_reason: 'I simply want answers to our basic questions.', desired_outcome: 'Direct dialog with the organizers.', age_group: '18-24', occupation: 'Student', student_field: 'Engineering', status: 'pending', created_at: new Date(Date.now() - 7200000).toISOString(), submission_hash: 'mock_hash' },
        { id: '3', city: 'Kanpur', locality: null, district: null, state: 'Uttar Pradesh', country: 'India', latitude: 26.4499, longitude: 80.3319, participation_status: 'supporting', attendance: 'supporting_online', support_reason: 'Our concerns deserve attention and action, not deflection.', desired_outcome: 'Formal response to the memorandum.', age_group: '35-44', occupation: 'Teacher', student_field: null, status: 'pending', created_at: new Date(Date.now() - 10800000).toISOString(), submission_hash: 'mock_hash' },
        { id: '4', city: 'Mumbai', locality: null, district: null, state: 'Maharashtra', country: 'India', latitude: 19.076, longitude: 72.8777, participation_status: 'supporting', attendance: 'planning_to_attend', support_reason: 'Peaceful protest is the bedrock of democracy.', desired_outcome: 'Protection of civil liberties.', age_group: '25-34', occupation: 'Designer', student_field: null, status: 'approved', created_at: new Date(Date.now() - 14400000).toISOString(), submission_hash: 'mock_hash' },
        { id: '5', city: 'Bangalore', locality: null, district: null, state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, participation_status: 'participating', attendance: 'already_attended', support_reason: 'To show solidarity with the movement and raise awareness.', desired_outcome: 'Policy reforms and revisions.', age_group: '18-24', occupation: 'Student', student_field: 'Law', status: 'hidden', created_at: new Date(Date.now() - 18000000).toISOString(), submission_hash: 'mock_hash' }
      ]);
    };

    const loadRealSubmissions = async (supabase: ReturnType<typeof createClient>) => {
      try {
        const { data, error: dbError } = await supabase
          .from('submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (dbError) throw dbError;
        setSubmissions(data || []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load registry submissions.';
        setError(msg);
        loadMockSubmissions(); // Fallback to mock
      }
    };

    async function checkAuth() {
      // 1. Check if mock bypass is active
      const mockAdmin = localStorage.getItem('peoples-voices-mock-admin');
      if (mockAdmin === 'true') {
        setIsMock(true);
        setSessionUser({ email: 'local-dev-admin@peoplesvoices.org' });
        loadMockSubmissions();
        setLoading(false);
        return;
      }

      // 2. Otherwise authenticate via Supabase
      try {
        const supabase = createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          router.push('/admin/login');
          return;
        }

        if (session.user.email !== 'abhi.codescode@gmail.com') {
          console.warn('Unauthorized user attempted to access admin page.');
          await supabase.auth.signOut();
          router.push('/admin/login');
          return;
        }

        setSessionUser(session.user);
        await loadRealSubmissions(supabase);
      } catch (err) {
        console.error('Supabase authentication failed. Redirecting to login.', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    if (isMock) {
      localStorage.removeItem('peoples-voices-mock-admin');
      router.push('/admin/login');
      return;
    }

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const handleModerate = async (id: string, action: 'approve' | 'hide') => {
    setActionLoading(id);
    setError(null);

    if (isMock) {
      setSubmissions(prev =>
        prev.map(sub => sub.id === id ? { ...sub, status: (action === 'approve' ? 'approved' : 'hidden') as SubmissionStatus } : sub)
      );
      setActionLoading(null);
      return;
    }

    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action === 'approve' ? 'approved' : 'hidden' })
      });

      if (!response.ok) {
        throw new Error('Failed to update submission status.');
      }

      setSubmissions(prev =>
        prev.map(sub => sub.id === id ? { ...sub, status: (action === 'approve' ? 'approved' : 'hidden') as SubmissionStatus } : sub)
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to moderate submission.';
      setError(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCsvExport = async () => {
    setExportLoading(true);
    setError(null);
    try {
      window.location.href = '/api/admin/export';
    } catch {
      setError('Failed to trigger export. Try again.');
    } finally {
      setTimeout(() => setExportLoading(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-sm text-muted-foreground">Authenticating admin portal...</span>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const hiddenSubmissions = submissions.filter(s => s.status === 'hidden');

  return (
    <div className="page-container py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-primary/10 pb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Moderation Dashboard</h1>
            <p className="text-xs text-muted-foreground">Logged in as {sessionUser?.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleCsvExport} disabled={exportLoading} variant="outline" className="border-primary/20 hover:bg-surface text-foreground h-9">
            {exportLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export Aggregates (CSV)
          </Button>
          <Button onClick={handleSignOut} variant="ghost" className="text-muted-foreground hover:text-foreground h-9">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {isMock && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3.5 text-xs text-yellow-500/90 flex items-start gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>You are viewing the dashboard in local mockup dev mode. Actions are simulated in-memory and will reset upon page refresh.</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Main Navigation Tabs */}
      <Tabs defaultValue="submissions" className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-sm bg-surface border border-primary/5">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="timeline">Timeline CMS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-6">
          <TimelineCMS />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <Tabs defaultValue="pending" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md bg-surface border border-primary/5">
          <TabsTrigger value="pending" className="flex items-center gap-1.5">
            Pending
            <Badge variant="outline" className="ml-1 bg-primary/10 border-primary/20 text-primary px-1.5 py-0">
              {pendingSubmissions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="hidden">Hidden</TabsTrigger>
        </TabsList>

        {/* Tab 1: Pending */}
        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length === 0 ? (
            <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground text-sm">
              <Check className="mx-auto h-8 w-8 text-success mb-2" />
              All submissions are moderated! Queue is empty.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map((sub) => (
                <Card key={sub.id} className="border border-primary/10 bg-surface/40">
                  <CardContent className="p-4.5 flex flex-col justify-between sm:flex-row sm:items-start gap-4">
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {sub.city}, {sub.state}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/15 uppercase">
                          {sub.participation_status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {sub.support_reason && (
                          <p className="text-sm italic text-foreground leading-relaxed">
                            &ldquo;{sub.support_reason}&rdquo;
                          </p>
                        )}
                        {sub.desired_outcome && (
                          <div className="text-xs text-muted-foreground bg-background/30 p-2.5 rounded border border-border">
                            <span className="font-bold text-[10px] uppercase block mb-1 text-primary/80">Outcome requested</span>
                            {sub.desired_outcome}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col gap-2 shrink-0 justify-end sm:justify-start">
                      <Button
                        size="sm"
                        onClick={() => handleModerate(sub.id, 'approve')}
                        disabled={actionLoading === sub.id}
                        className="bg-success hover:bg-success/90 text-white h-8"
                      >
                        {actionLoading === sub.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 mr-1" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleModerate(sub.id, 'hide')}
                        disabled={actionLoading === sub.id}
                        variant="outline"
                        className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8"
                      >
                        {actionLoading === sub.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5 mr-1" />}
                        Hide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Approved */}
        <TabsContent value="approved" className="space-y-4">
          {approvedSubmissions.length === 0 ? (
            <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground text-sm">
              No approved submissions found in memory.
            </div>
          ) : (
            <div className="space-y-3">
              {approvedSubmissions.map((sub) => (
                <Card key={sub.id} className="border border-border bg-surface/30">
                  <CardContent className="p-4 flex flex-col justify-between sm:flex-row sm:items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {sub.city}, {sub.state}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/15 uppercase">
                          {sub.participation_status}
                        </Badge>
                      </div>
                      {sub.support_reason && <p className="text-xs text-foreground/80 leading-relaxed italic">&ldquo;{sub.support_reason}&rdquo;</p>}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleModerate(sub.id, 'hide')}
                      disabled={actionLoading === sub.id}
                      variant="outline"
                      className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 shrink-0"
                    >
                      Hide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Hidden */}
        <TabsContent value="hidden" className="space-y-4">
          {hiddenSubmissions.length === 0 ? (
            <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground text-sm">
              No hidden submissions found.
            </div>
          ) : (
            <div className="space-y-3">
              {hiddenSubmissions.map((sub) => (
                <Card key={sub.id} className="border border-border bg-surface/30">
                  <CardContent className="p-4 flex flex-col justify-between sm:flex-row sm:items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {sub.city}, {sub.state}
                        </span>
                      </div>
                      {sub.support_reason && <p className="text-xs text-muted-foreground leading-relaxed line-through italic">&ldquo;{sub.support_reason}&rdquo;</p>}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleModerate(sub.id, 'approve')}
                      disabled={actionLoading === sub.id}
                      className="bg-success hover:bg-success/90 text-white h-8 shrink-0"
                    >
                      Restore
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
