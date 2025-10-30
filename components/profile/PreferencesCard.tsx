'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/providers/theme-provider';

interface PreferencesData {
  schoolYear: string;
  interests: string[];
  emailNotifications: boolean;
}

const AVAILABLE_INTERESTS = [
  'Business',
  'Economics',
  'Engineering',
  'Medicine',
  'Law',
  'Computer Science',
  'Arts',
  'Political Science',
  'Architecture',
  'Mathematics',
];

const SCHOOL_YEARS = [
  'Year 10',
  'Year 11',
  'Year 12',
  'Year 13',
  'Gap Year',
  'University',
  'Other',
];

export function PreferencesCard() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState<PreferencesData>({
    schoolYear: '',
    interests: [],
    emailNotifications: true,
  });
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('sos-preferences');
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const toggleInterest = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    setIsEdited(true);
  };

  const handleSave = () => {
    localStorage.setItem('sos-preferences', JSON.stringify(preferences));
    setIsEdited(false);
    toast({
      title: 'Preferences saved',
      description: 'Your preferences have been updated.',
    });
  };

  return (
    <div 
      className="border bg-background shadow-lg transition-all duration-300"
      style={{ borderRadius: 0 }}
    >
      {/* Header */}
      <div 
        className="border-b px-6 py-4 transition-all duration-300"
        style={{ borderRadius: 0 }}
      >
        <h2 className="text-base font-medium">Preferences</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize your experience and interests
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* School Year */}
        <div className="space-y-1.5">
          <label 
            htmlFor="schoolYear" 
            className="text-xs font-medium"
          >
            School Year
          </label>
          <Select
            value={preferences.schoolYear}
            onValueChange={(value) => {
              setPreferences((prev) => ({ ...prev, schoolYear: value }));
              setIsEdited(true);
            }}
          >
            <SelectTrigger id="schoolYear">
              <SelectValue placeholder="Select your year" />
            </SelectTrigger>
            <SelectContent>
              {SCHOOL_YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interests */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium">
            Areas of Interest
          </label>
          <p className="text-xs text-muted-foreground">
            Select topics that interest you
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {AVAILABLE_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`
                  h-7 px-3 text-xs border transition-all
                  ${preferences.interests.includes(interest)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border hover:border-foreground'
                  }
                `}
                style={{ borderRadius: 0 }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-1.5">
          <label 
            htmlFor="theme" 
            className="text-xs font-medium"
          >
            Theme
          </label>
          <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <label 
              htmlFor="notifications" 
              className="text-xs font-medium"
            >
              Email Notifications
            </label>
            <p className="text-xs text-muted-foreground">
              Receive updates about new PDFs
            </p>
          </div>
          <Switch
            id="notifications"
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) => {
              setPreferences((prev) => ({
                ...prev,
                emailNotifications: checked,
              }));
              setIsEdited(true);
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div 
        className="border-t px-6 py-3 transition-all duration-300"
        style={{ borderRadius: 0 }}
      >
        <button
          onClick={handleSave}
          disabled={!isEdited}
          className="w-full h-9 text-sm bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all border border-foreground"
          style={{ borderRadius: 0 }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

