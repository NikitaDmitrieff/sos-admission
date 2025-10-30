'use client';

import { ProfileCard } from '@/components/profile/ProfileCard';
import { PreferencesCard } from '@/components/profile/PreferencesCard';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 px-4 lg:px-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        <ProfileCard />
        <PreferencesCard />
      </div>
    </div>
  );
}

