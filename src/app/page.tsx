'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

/* ────────────────────────────────────────────────────────────
   Animated Counter Component
   ──────────────────────────────────────────────────────────── */
function AnimatedCounter({
  value,
  duration = 2000,
  suffix = '',
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   Landing Page
   ──────────────────────────────────────────────────────────── */
import { createClient } from '@/lib/supabase/client';
import { TimelineEvent } from '@/types/database';

export default function HomePage() {
  const [stats, setStats] = useState({
    total_voices: 0,
    cities_represented: 0,
    states_represented: 0,
  });
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    
    async function fetchTimeline() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('timeline_events')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (!error && data) {
          setTimelineEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      }
    }

    fetchStats();
    fetchTimeline();
  }, []);

  const recentVoices: { message: string; city: string; state: string }[] = [];

  return (
    <div className="relative overflow-x-hidden bg-background">

      {/* ── Cinematic Hero Section ── */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col justify-end -mt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/protest_image.avif"
            alt="Protest background"
            fill
            className="object-cover object-center opacity-80 grayscale"
            priority
          />
          {/* Subtle gradient overlay to darken edges and make text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/90" />
          {/* Subtle tricolor tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-orange-900/10 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 pb-24 md:pb-32 flex flex-col-reverse md:flex-row justify-between items-end gap-12">

          {/* Left Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto"
          >
            <Link
              href="/submit"
              className="inline-flex items-center justify-center bg-gradient-to-b from-[#FF9933] to-[#138808] text-white font-semibold tracking-[0.2em] uppercase px-10 py-5 transition-transform hover:scale-105 active:scale-95 shadow-2xl"
            >
              ADD YOUR VOICE NOW
            </Link>

            <a
              href="#the-protest"
              className="inline-flex items-center justify-center border border-white/50 bg-black/30 backdrop-blur-sm text-white font-semibold tracking-[0.2em] uppercase px-10 py-5 transition-all hover:bg-white hover:text-black"
            >
              LEARN THE DEMANDS
            </a>
          </motion.div>

          {/* Right Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left md:text-right w-full md:w-auto"
          >
            {/* Waving Flag */}
            <div className="flex justify-start md:justify-end mb-6 md:pr-2">
              <div className="relative w-32 h-24 sm:w-40 sm:h-28 md:w-80 md:h-80">
                <Image 
                  src="/rebellion_flag.png" 
                  alt="Rebellion Flag" 
                  fill 
                  className="object-contain drop-shadow-2xl" 
                  style={{ 
                    maskImage: 'radial-gradient(circle, black 40%, transparent 75%)', 
                    WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)' 
                  }}
                  priority 
                />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-light uppercase leading-[1.1] tracking-tight text-white drop-shadow-2xl">
              THE VOICES<br />
              <span className="font-medium">ARE GROWING</span>
            </h1>
            <p className="mt-6 text-sm md:text-lg text-white/80 max-w-xl ml-0 md:ml-auto font-light tracking-wide leading-relaxed">
              Join the CJP movement at Jantar Mantar demanding accountability for paper leaks and education reforms.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="bg-background py-16 md:py-24 border-b border-border">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { label: 'Total Voices', value: stats.total_voices, suffix: '+' },
              { label: 'Cities Represented', value: stats.cities_represented, suffix: '' },
              { label: 'States Represented', value: stats.states_represented, suffix: '' },
            ].map((stat, i) => (
              <div key={i} className="pt-8 md:pt-0 md:pl-12 first:md:pl-0">
                <div className="text-4xl md:text-5xl font-light text-foreground mb-4">
                  <AnimatedCounter value={stat.value} duration={1500 + i * 300} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Protest Section ── */}
      <section id="the-protest" className="page-container section-spacing scroll-mt-24">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-light uppercase text-foreground leading-tight tracking-wide mb-2">
            The Protest
          </h2>
          <p className="text-lg md:text-xl font-light text-muted-foreground tracking-wider">
            Cockroach Janta Party (CJP) at Jantar Mantar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side: Content */}
          <div className="space-y-12">
            <div>
              <p className="text-base md:text-lg font-light leading-relaxed text-foreground/90">
                The Cockroach Janta Party (CJP), a youth-led movement, is holding an ongoing peaceful protest at Jantar Mantar, New Delhi, demanding accountability in India&apos;s education system.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-[#FF9933] mb-6">Why We Are Protesting</h3>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="text-[#FF9933] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Repeated paper leaks in major examinations including NEET-UG, CBSE, and other recruitment tests.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#FF9933] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Lack of accountability for the future of lakhs of students whose careers have been devastated.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#FF9933] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Tragic loss of lives due to stress and despair caused by these irregularities.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#FF9933] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Demand for systemic reforms to restore trust in the examination process.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-[#138808] mb-6">Our Key Demands</h3>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="text-[#138808] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Immediate resignation of Union Education Minister Dharmendra Pradhan.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#138808] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Strict action against those responsible for paper leaks and irregularities.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#138808] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Fair re-examination and compensation for affected students.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#138808] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Long-term structural reforms to prevent future leaks and ensure transparent examinations.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#138808] mt-1 font-bold">•</span>
                  <span className="font-light text-foreground/80 leading-relaxed">Justice for students and families impacted by the crisis.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-foreground mb-4">Current Status</h3>
              <p className="text-sm md:text-base font-light leading-relaxed text-foreground/80 mb-6">
                The protest began in June 2026 and continues as a sit-in at Jantar Mantar. Supporters, students, youth, and activists including climate activist Sonam Wangchuk have joined the movement. The protest has seen massive participation with people banging thalis (plates), wearing cockroach masks, and raising slogans for change.
              </p>
              <p className="text-lg italic font-medium text-white border-l-2 border-[#FF9933] pl-4">
                &quot;We believe that when the youth speak together, change becomes inevitable.&quot;
              </p>
            </div>



            <div className="pt-8">
              <p className="text-sm uppercase tracking-widest text-foreground mb-6">Stand with us.</p>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center bg-white text-black font-semibold tracking-[0.2em] uppercase px-8 py-4 transition-transform hover:scale-105 active:scale-95"
              >
                ADD YOUR VOICE NOW
              </Link>
            </div>

          </div>

          {/* Right Side: Photo Grid */}
          <div className="grid grid-cols-2 gap-4 h-fit sticky top-32">
            <div className="col-span-2 relative aspect-video group overflow-hidden border border-border">
              <Image src="/images/collage1.png" alt="Protest crowd at Jantar Mantar" fill className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 text-xs uppercase tracking-widest backdrop-blur-md text-white">Crowd at Jantar Mantar</div>
            </div>
            <div className="relative aspect-square group overflow-hidden border border-border">
              <Image src="/images/mask.avif" alt="Cockroach masks" fill className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-widest backdrop-blur-md text-white">Masks</div>
            </div>
            <div className="relative aspect-square group overflow-hidden border border-border">
              <Image src="/images/cjp1.jpg" alt="Sonam Wangchuk" fill className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-widest backdrop-blur-md text-white">Sonam Wangchuk</div>
            </div>
            <div className="col-span-2 relative aspect-[21/9] group overflow-hidden border border-border">
              <Image src="/images/cjp9.avif" alt="Dipke addressing the crowd" fill className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 text-xs uppercase tracking-widest backdrop-blur-md text-white">Addressing the Crowd</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <section className="bg-background py-24 border-t border-border">
        <div className="page-container">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-light uppercase text-foreground leading-tight tracking-wide mb-6">
              Timeline of the Movement
            </h2>
            <p className="text-lg md:text-xl font-light text-muted-foreground tracking-wider">
              How a digital spark ignited a nationwide demand for accountability.
            </p>
          </div>

          <div className="space-y-16 lg:space-y-32 relative before:absolute before:inset-0 before:ml-5 lg:before:left-1/2 lg:before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {timelineEvents.map((event) => {
              return (
                <div key={event.id} className="relative flex items-center justify-between lg:justify-normal lg:odd:flex-row-reverse group is-active">
                  {/* Image side */}
                  <div className="hidden lg:flex flex-1 w-[calc(50%-2.5rem)] items-center justify-end group-odd:justify-start">
                    {event.image_url ? (
                      <div className="relative w-full aspect-video border border-border bg-surface overflow-hidden">
                        <Image src={event.image_url} alt={event.title} fill className="object-cover opacity-80" />
                      </div>
                    ) : (
                      <div className="relative w-full aspect-video border border-border bg-surface overflow-hidden">
                         <div className="absolute inset-0 flex items-center justify-center bg-muted/20 text-muted-foreground uppercase text-xs tracking-widest">Image Placeholder</div>
                      </div>
                    )}
                  </div>
                  
                  {/* The connector dot (exactly centered on lg) */}
                  <div 
                    className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow shrink-0 absolute left-0 lg:left-1/2 lg:-translate-x-1/2 z-10" 
                    style={{ backgroundColor: event.color.startsWith('#') ? event.color : 'transparent' }}
                  >
                    {!event.color.startsWith('#') && (
                      <div className={`w-full h-full rounded-full bg-${event.color}`} />
                    )}
                  </div>
                  
                  {/* The text content side */}
                  {/* On small screens: text is always on the right of the line (pl-12). */}
                  {/* On lg screens (even): text is on the right, needs pl-12, text-left. */}
                  {/* On lg screens (odd): text is on the left, needs pr-12, text-right, and remove pl. */}
                  <div className="w-[calc(100%-3rem)] ml-12 lg:ml-0 lg:w-[calc(50%-2.5rem)] lg:group-even:pl-12 lg:group-even:text-left lg:group-odd:pr-12 lg:group-odd:text-right">
                    <p 
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: event.color.startsWith('#') ? event.color : undefined }}
                    >
                      <span className={!event.color.startsWith('#') ? `text-${event.color}` : ''}>
                        {event.stage_name}: {event.date_range}
                      </span>
                    </p>
                    <h4 className="text-2xl font-light text-foreground mb-4">{event.title}</h4>
                    <p className="text-base font-light text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Media Gallery ── */}
      <section className="bg-surface py-24 border-y border-border">
        <div className="page-container">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-light uppercase text-foreground leading-tight tracking-wide mb-4">
              Visual Evidence
            </h2>
            <p className="text-sm md:text-base font-light text-muted-foreground tracking-wider max-w-2xl mx-auto">
              Images captured from the ongoing protest. A testament to the resilience of the youth.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              "/images/cjp1.jpg",
              "/images/cjp2.jpg",
              "/images/cjp3.jpg",
              "/images/cjp5.jpg",
              "/images/cjp6.jpg",
              "/images/cjp9.avif",
              "/images/collage1.png",
              "/images/mask.avif",
              "/protest_bg.png"
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                viewport={{ once: true }}
                className="relative aspect-square group overflow-hidden bg-background border border-border/50"
              >
                <Image
                  src={src}
                  alt={`Protest image ${i + 1}`}
                  fill
                  className="object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 border border-white/10 group-hover:border-white/40 transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Voices Section ── */}
      <section className="page-container section-spacing">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-light uppercase text-foreground leading-tight tracking-wide mb-4">
              HEAR THE STREETS
            </h2>
            <p className="max-w-xl text-sm md:text-base font-light text-muted-foreground tracking-wider leading-relaxed">
              Real submissions from across the nation. 100% anonymous.
            </p>
          </div>
          <Link href="/voices" className="ghost-button">
            READ ALL VOICES
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {recentVoices.map((voice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 flex flex-col justify-between h-full bg-surface hover:bg-surface/80 transition-colors"
            >
              <p className="mb-12 text-lg font-light text-foreground leading-relaxed">
                &ldquo;{voice.message}&rdquo;
              </p>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mt-auto">
                <MapPin className="h-3 w-3" />
                <span>{voice.city}, {voice.state}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-surface">
        <div className="page-container py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} PEOPLE&apos;S VOICES. NO TRACKING.
          </div>
          <div className="flex items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
            <Link href="/privacy" className="hover:text-[#FF9933] transition-colors">Privacy Policy</Link>
            <Link href="/methodology" className="hover:text-[#138808] transition-colors">Methodology</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent transition-colors">
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
