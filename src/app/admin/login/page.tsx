'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [devMode, setDevMode] = useState(false);

  // Check session on mount
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push('/admin');
        }
      });
    } catch {
      console.warn('Supabase client failed initialization. Entering local dev fallback mode.');
      setDevMode(true);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!email) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (devMode) {
      // Dev mode bypass
      localStorage.setItem('peoples-voices-mock-admin', 'true');
      router.push('/admin');
      return;
    }

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (signInError) throw signInError;
      setSuccess(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send magic link. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleMockBypass = () => {
    localStorage.setItem('peoples-voices-mock-admin', 'true');
    router.push('/admin');
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-12 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-primary/10 bg-surface/50 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Enter your admin email. We will send you a passwordless magic link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 rounded-lg border border-success/20 bg-success/10 p-3.5 text-xs text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Magic link sent! Check your email inbox to complete login.</span>
            </div>
          )}

          {devMode && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-500/90 leading-relaxed space-y-2">
              <p>
                ⚠️ <strong>Local Dev Fallback</strong>: Supabase environment variables are not configured. Click &ldquo;Bypass with Local Mock&rdquo; to test the admin dashboard without server keys.
              </p>
              <Button size="sm" onClick={handleMockBypass} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white text-[10px] h-7">
                Bypass with Local Mock
              </Button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email Address</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@peoplesvoices.org"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Magic Link'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
