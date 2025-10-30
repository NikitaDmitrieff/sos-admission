'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';
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
    <div 
      className="border bg-background shadow-lg transition-all duration-300"
      style={{ borderRadius: 0 }}
    >
      {/* Header */}
      <div 
        className="border-b px-6 py-4 transition-all duration-300"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="h-12 w-12 bg-foreground/5 flex items-center justify-center"
            style={{ borderRadius: 0 }}
          >
            <UserIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-medium">Profile Information</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your personal details here
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-1.5">
          <label 
            htmlFor="name" 
            className="text-xs font-medium"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full h-9 px-3 text-sm bg-background border focus:outline-none focus:border-foreground transition-all"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div className="space-y-1.5">
          <label 
            htmlFor="email" 
            className="text-xs font-medium"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full h-9 px-3 text-sm bg-background border focus:outline-none focus:border-foreground transition-all"
            style={{ borderRadius: 0 }}
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
          Save Changes
        </button>
      </div>
    </div>
  );
}

