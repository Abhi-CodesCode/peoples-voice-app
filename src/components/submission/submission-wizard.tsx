'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Shield, 
  MapPin, 
  Info, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CitySearch } from './city-search';
import { PrivacyConfirmation } from './privacy-confirmation';
import { AutocompleteOtherField } from './autocomplete-other-field';
import { SubmissionFormData, CitySearchResult, ParticipationStatus, AttendanceType, AgeGroup } from '@/types/database';
import { MAX_REASON_LENGTH, MAX_OUTCOME_LENGTH, MAX_OCCUPATION_LENGTH } from '@/lib/constants';

const STEPS = [
  { id: 1, name: 'Location' },
  { id: 2, name: 'Participation' },
  { id: 3, name: 'Attendance' },
  { id: 4, name: 'Why Support?' },
  { id: 5, name: 'Desired Outcome' },
  { id: 6, name: 'Details' },
  { id: 7, name: 'Confirm' }
];

const SUPPORT_REASON_OPTIONS = [
  "To demand accountability for repeated exam paper leaks (NEET, etc.) and justice for affected students.",
  "Because students' futures and lives are being ruined by systemic failures in the education system.",
  "To support the call for Education Minister Dharmendra Pradhan's resignation and better governance.",
  "As a concerned citizen/parent/youth who wants transparent and fair examinations in India."
];

const DESIRED_OUTCOME_OPTIONS = [
  "Resignation of the Education Minister and strict action against those responsible for leaks.",
  "Complete cancellation/re-examination of compromised tests + compensation for affected students/families.",
  "Long-term reforms: stronger security for exams, independent oversight, and prevention of future leaks.",
  "Nationwide awareness and pressure for systemic change in recruitment and education policies."
];

export function SubmissionWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<SubmissionFormData>>({
    city: '',
    state: '',
    country: 'India',
    participation_status: 'supporting',
    attendance: 'planning_to_attend',
    support_reason: '',
    desired_outcome: '',
    age_group: undefined,
    occupation: ''
  });

  const [selectedCityResult, setSelectedCityResult] = useState<CitySearchResult | null>(null);
  const [isOtherSupportReason, setIsOtherSupportReason] = useState(false);
  const [isOtherDesiredOutcome, setIsOtherDesiredOutcome] = useState(false);

  const handleCitySelect = (cityResult: CitySearchResult) => {
    setSelectedCityResult(cityResult);
    setFormData((prev) => ({
      ...prev,
      city: cityResult.city,
      state: cityResult.state,
      country: cityResult.country,
      latitude: cityResult.latitude,
      longitude: cityResult.longitude
    }));
    setError(null);
  };

  const handleTextChange = (field: 'support_reason' | 'desired_outcome' | 'occupation', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepNext = () => {
    // Validations per step
    if (currentStep === 1 && !formData.city) {
      setError('Please search and select your city first.');
      return;
    }
    if (currentStep === 6 && (!formData.age_group || !formData.occupation || formData.occupation.trim() === '')) {
      setError('Please provide your age group and occupation to proceed. This is required to prove the authenticity of the movement.');
      return;
    }
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleStepBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!privacyConfirmed) {
      setError('Please accept the privacy confirmation notice to submit.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  // Animation variants
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Voice Registered Successfully</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground mb-8">
          Thank you for sharing your voice anonymously. Your perspective helps document the voluntary support for the movement.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push('/map')} className="bg-primary hover:bg-primary/90 text-white">
            View Heatmap
          </Button>
          <Button variant="outline" onClick={() => router.push('/voices')}>
            Read Voices
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Step Indicator & Progress */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-1.5" />
      </div>

      <Card className="border border-primary/10 bg-surface/40 backdrop-blur-md shadow-xl">
        <CardContent className="pt-6 pb-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-5"
            >
              {/* STEP 1: City Search */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Where are you based?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Search your city. We only store approximate city centroids, never your precise GPS location.
                    </p>
                  </div>
                  <div className="pt-2">
                    <CitySearch onSelect={handleCitySelect} selectedCity={selectedCityResult} />
                  </div>
                  {formData.city && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-primary font-medium">
                      <Info className="h-4 w-4 shrink-0" />
                      <span>
                        Mapped to: <strong>{formData.city}, {formData.state}</strong>. Centroid coordinates [{formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}] cached.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Participation Status */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">Your participation status</h2>
                    <p className="text-sm text-muted-foreground">
                      Select how you define your alignment with the protest movement.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                    {[
                      { value: 'supporting', label: 'Supporting', desc: 'Align with goals but not protesting physically.' },
                      { value: 'participating', label: 'Participating', desc: 'Actively participating in demonstration grounds.' },
                      { value: 'undecided', label: 'Undecided', desc: 'Still evaluating the movement.' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, participation_status: opt.value as ParticipationStatus }))}
                        className={`p-4 rounded-xl border text-left transition-all hover:bg-primary/5 flex flex-col justify-between ${
                          formData.participation_status === opt.value
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border bg-surface/30'
                        }`}
                      >
                        <span className="font-semibold text-foreground text-sm">{opt.label}</span>
                        <span className="text-xs text-muted-foreground mt-2 leading-relaxed">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Attendance Status */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">Attendance plan</h2>
                    <p className="text-sm text-muted-foreground">
                      Have you attended or how do you plan to participate in CJP events?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {[
                      { value: 'already_attended', label: 'Already Attended', desc: 'Have visited demonstration venues or participated in local hubs.' },
                      { value: 'planning_to_attend', label: 'Planning to Attend', desc: 'Intend to join the protests physically soon.' },
                      { value: 'local_protest', label: 'Will Join Protest in Own City', desc: 'Cannot travel far, but will participate locally.' },
                      { value: 'supporting_online', label: 'Supporting Online Only', desc: 'Help spread awareness online and support remotely.' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, attendance: opt.value as AttendanceType }))}
                        className={`p-4 rounded-xl border text-left transition-all hover:bg-primary/5 flex items-center justify-between ${
                          formData.attendance === opt.value
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border bg-surface/30'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-sm">{opt.label}</span>
                          <span className="text-xs text-muted-foreground mt-1">{opt.desc}</span>
                        </div>
                        {formData.attendance === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Why are you supporting */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">Why are you supporting?</h2>
                    <p className="text-sm text-muted-foreground">
                      Select your primary reason or write your own.
                    </p>
                  </div>
                  <div className="pt-2 space-y-3">
                    {SUPPORT_REASON_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setIsOtherSupportReason(false);
                          handleTextChange('support_reason', opt);
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all hover:bg-primary/5 flex items-start gap-3 ${
                          !isOtherSupportReason && formData.support_reason === opt
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border bg-surface/30'
                        }`}
                      >
                        <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${!isOtherSupportReason && formData.support_reason === opt ? 'border-primary' : 'border-muted-foreground'}`}>
                          {!isOtherSupportReason && formData.support_reason === opt && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">{opt}</span>
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtherSupportReason(true);
                        if (SUPPORT_REASON_OPTIONS.includes(formData.support_reason || '')) {
                          handleTextChange('support_reason', '');
                        }
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all hover:bg-primary/5 flex items-start gap-3 ${
                        isOtherSupportReason
                          ? 'border-primary bg-primary/10 ring-1 ring-primary'
                          : 'border-border bg-surface/30'
                      }`}
                    >
                      <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${isOtherSupportReason ? 'border-primary' : 'border-muted-foreground'}`}>
                        {isOtherSupportReason && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm text-foreground">Other (free text)</span>
                    </button>

                    {isOtherSupportReason && (
                      <div className="mt-3 pl-7">
                        <AutocompleteOtherField
                          field="support_reason"
                          value={isOtherSupportReason ? (formData.support_reason || '') : ''}
                          onChange={(val) => handleTextChange('support_reason', val)}
                          maxLength={MAX_REASON_LENGTH}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Desired Outcome */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">What outcome would you like to see?</h2>
                    <p className="text-sm text-muted-foreground">
                      What is the resolution or specific change you want to achieve?
                    </p>
                  </div>
                  <div className="pt-2 space-y-3">
                    {DESIRED_OUTCOME_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setIsOtherDesiredOutcome(false);
                          handleTextChange('desired_outcome', opt);
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all hover:bg-primary/5 flex items-start gap-3 ${
                          !isOtherDesiredOutcome && formData.desired_outcome === opt
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border bg-surface/30'
                        }`}
                      >
                        <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${!isOtherDesiredOutcome && formData.desired_outcome === opt ? 'border-primary' : 'border-muted-foreground'}`}>
                          {!isOtherDesiredOutcome && formData.desired_outcome === opt && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">{opt}</span>
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtherDesiredOutcome(true);
                        if (DESIRED_OUTCOME_OPTIONS.includes(formData.desired_outcome || '')) {
                          handleTextChange('desired_outcome', '');
                        }
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all hover:bg-primary/5 flex items-start gap-3 ${
                        isOtherDesiredOutcome
                          ? 'border-primary bg-primary/10 ring-1 ring-primary'
                          : 'border-border bg-surface/30'
                      }`}
                    >
                      <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${isOtherDesiredOutcome ? 'border-primary' : 'border-muted-foreground'}`}>
                        {isOtherDesiredOutcome && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm text-foreground">Other (free text)</span>
                    </button>

                    {isOtherDesiredOutcome && (
                      <div className="mt-3 pl-7">
                        <AutocompleteOtherField
                          field="desired_outcome"
                          value={isOtherDesiredOutcome ? (formData.desired_outcome || '') : ''}
                          onChange={(val) => handleTextChange('desired_outcome', val)}
                          maxLength={MAX_OUTCOME_LENGTH}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: Demographics */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">Demographics (Required)</h2>
                    <p className="text-sm text-muted-foreground">
                      We require this to showcase that real, diverse people are supporting the protest, proving this is a genuine movement and not propaganda.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="age-group-select">Age Group</Label>
                      <Select
                        value={formData.age_group || 'none'}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, age_group: val === 'none' ? undefined : val as AgeGroup }))}
                      >
                        <SelectTrigger id="age-group-select">
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Prefer not to say</SelectItem>
                          <SelectItem value="18-24">18-24</SelectItem>
                          <SelectItem value="25-34">25-34</SelectItem>
                          <SelectItem value="35-44">35-44</SelectItem>
                          <SelectItem value="45-54">45-54</SelectItem>
                          <SelectItem value="55-64">55-64</SelectItem>
                          <SelectItem value="65+">65+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="occupation-input">Occupation / Sector</Label>
                      <Input
                        id="occupation-input"
                        type="text"
                        value={formData.occupation || ''}
                        onChange={(e) => handleTextChange('occupation', e.target.value.slice(0, MAX_OCCUPATION_LENGTH))}
                        placeholder="e.g. Student, IT, Farmer, Healthcare"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Confirm & Submit */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">Confirm Submission</h2>
                    <p className="text-sm text-muted-foreground">
                      Please review our privacy commitment and submit your anonymous voice.
                    </p>
                  </div>
                  <PrivacyConfirmation 
                    confirmed={privacyConfirmed} 
                    onConfirmChange={setPrivacyConfirmed} 
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handleStepBack}
          disabled={currentStep === 1 || loading}
          className="border-primary/20 hover:bg-surface text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={handleStepNext}
            className="bg-primary hover:bg-primary/95 text-primary-foreground ml-auto"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!privacyConfirmed || loading}
            className="bg-primary hover:bg-primary/95 text-primary-foreground ml-auto flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Log My Protest
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
