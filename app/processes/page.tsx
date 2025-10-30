'use client';

import { FolderKanban, FolderPlus, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ProcessesPage() {
  return (
    <div className="container mx-auto py-12 px-4 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Hero Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <FolderKanban className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Processes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Organize your university applications in one place
          </p>
        </div>

        {/* Description */}
        <Card className="text-left">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">
              Create folders for each school or topic and save relevant PDFs. Track
              deadlines, requirements, and your progress through each application.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <FolderPlus className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Organize PDFs</p>
                  <p className="text-xs text-muted-foreground">
                    Group by school or topic
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Track Deadlines</p>
                  <p className="text-xs text-muted-foreground">
                    Never miss important dates
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Monitor Progress</p>
                  <p className="text-xs text-muted-foreground">
                    See what's left to do
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <Button size="lg" disabled className="gap-2">
            <FolderPlus className="h-5 w-5" />
            Create New Process
          </Button>
          <p className="text-sm text-muted-foreground">
            Coming soon • We're building something special
          </p>
        </div>
      </div>
    </div>
  );
}

