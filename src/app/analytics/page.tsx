'use client';

import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  Briefcase,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/analytics/stat-card';
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner';
import { PlatformStats } from '@/types/database';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<PlatformStats>({
    total_voices: 0,
    cities_represented: 0,
    states_represented: 0,
    supporting_count: 0,
    participating_count: 0,
    undecided_count: 0
  });

  // Fetch stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    }
    fetchStats();
  }, []);

  // Empty arrays since dummy data is removed
  const timeData: Record<string, unknown>[] = [];
  
  // Alignment distribution
  const alignmentData = [
    { name: 'Supporting', value: stats.supporting_count, color: '#E05A16' },
    { name: 'Participating', value: stats.participating_count, color: '#1D8348' },
    { name: 'Undecided', value: stats.undecided_count, color: '#A0A0A0' }
  ].filter(d => d.value > 0);

  // Attendance breakdown (requires actual API data for true values, zeroing for now)
  const attendanceData: Record<string, unknown>[] = [];
  const cityData: Record<string, unknown>[] = [];
  const stateData: Record<string, unknown>[] = [];
  const ageData: Record<string, unknown>[] = [];
  const occupationData: Record<string, unknown>[] = [];

  const supportingPct = stats.total_voices > 0 ? (stats.supporting_count / stats.total_voices) * 100 : 0;
  const participatingPct = stats.total_voices > 0 ? (stats.participating_count / stats.total_voices) * 100 : 0;

  return (
    <div className="relative min-h-[90vh]">
      <DisclaimerBanner />

      <div className="page-container py-12 space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex rounded-full bg-primary/10 p-2 text-primary mb-2">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Public aggregated metrics of all registered voices. Under no circumstances do these charts track or display personal identification data.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard 
            title="Total Registered" 
            value={stats.total_voices} 
            icon={<Users className="h-4.5 w-4.5" />} 
            delay={0}
          />
          <StatCard 
            title="Cities Represented" 
            value={stats.cities_represented} 
            icon={<MapPin className="h-4.5 w-4.5" />} 
            delay={0.05}
          />
          <StatCard 
            title="States Represented" 
            value={stats.states_represented} 
            icon={<TrendingUp className="h-4.5 w-4.5" />} 
            delay={0.1}
          />
          <StatCard 
            title="Supporting" 
            value={Math.round(supportingPct)} 
            suffix="%"
            icon={<CheckCircle2 className="h-4.5 w-4.5" />} 
            delay={0.15}
          />
          <StatCard 
            title="Participating" 
            value={Math.round(participatingPct)} 
            suffix="%"
            icon={<UserCheck className="h-4.5 w-4.5" />} 
            delay={0.2}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chart 1: Participation Over Time */}
          <Card className="border-border bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Participation Trend
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Voluntary daily registrations cumulative overview.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {timeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSupport" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E05A16" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#E05A16" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1D8348" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#1D8348" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#A0A0A0" fontSize={11} />
                    <YAxis stroke="#A0A0A0" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#F5F5F5' }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Area type="monotone" dataKey="Supporting" stroke="#E05A16" strokeWidth={3} fillOpacity={1} fill="url(#colorSupport)" />
                    <Area type="monotone" dataKey="Participating" stroke="#1D8348" strokeWidth={3} fillOpacity={1} fill="url(#colorPart)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">Awaiting enough data...</p>
              )}
            </CardContent>
          </Card>

          {/* Chart 2: Alignment Distribution Donut */}
          <Card className="border-border bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Movement Alignment
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Percentage split of registered alignment categories.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {alignmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alignmentData}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {alignmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#F5F5F5' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">Awaiting data...</p>
              )}
            </CardContent>
          </Card>

          {/* Chart 3: Top Cities */}
          <Card className="border-border bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Top Represented Cities
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Indian cities sorted by total voice counts.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {cityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#A0A0A0" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#A0A0A0" fontSize={11} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#F5F5F5' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" fill="#E05A16" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">Awaiting enough data...</p>
              )}
            </CardContent>
          </Card>

          {/* Chart 4: Top States */}
          <Card className="border-border bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                Top States
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Indian states sorted by voice volume.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {stateData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#A0A0A0" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#A0A0A0" fontSize={11} width={90} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#F5F5F5' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" fill="#1D8348" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">Awaiting enough data...</p>
              )}
            </CardContent>
          </Card>

          {/* Chart 5: Attendance Distribution */}
          <Card className="border-border bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
                <Users className="h-4 w-4 text-primary" />
                Attendance Plan
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Proportion of physical vs online participants.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="45%"
                      innerRadius={0}
                      outerRadius={90}
                      dataKey="value"
                      stroke="none"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#F5F5F5' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">Awaiting data...</p>
              )}
            </CardContent>
          </Card>

          {/* Chart 6: Age Groups */}
          <Card className="border-border bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
                <Users className="h-4 w-4 text-primary" />
                Age Group Distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Demographic split of voluntary submissions.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {ageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#A0A0A0" fontSize={11} />
                    <YAxis stroke="#A0A0A0" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#F5F5F5' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" fill="#E05A16" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">Awaiting enough data...</p>
              )}
            </CardContent>
          </Card>

          {/* Chart 7: Occupation */}
          <Card className="border-border bg-background shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                Participation by Sector / Occupation
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Top occupational fields among contributors.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {occupationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupationData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#A0A0A0" fontSize={11} />
                    <YAxis stroke="#A0A0A0" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#F5F5F5' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" fill="#1D8348" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">Awaiting enough data...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
