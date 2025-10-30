'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize your experience and interests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* School Year */}
        <div className="space-y-2">
          <Label htmlFor="schoolYear">School Year</Label>
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
        <div className="space-y-3">
          <Label>Areas of Interest</Label>
          <p className="text-sm text-muted-foreground">
            Select topics that interest you
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map((interest) => (
              <Badge
                key={interest}
                variant={
                  preferences.interests.includes(interest)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
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
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
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
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={!isEdited}>
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}

