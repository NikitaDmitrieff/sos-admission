'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ProfileData {
  name: string;
  email: string;
}

export function ProfileCard() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
  });
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('sos-profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const handleSave = () => {
    localStorage.setItem('sos-profile', JSON.stringify(profile));
    setIsEdited(false);
    toast({
      title: 'Profile saved',
      description: 'Your profile information has been updated.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal details here
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={!isEdited}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}

