'use client';

import { MessageSquare, Sparkles, FileSearch, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AICoachPage() {
  return (
    <div className="container mx-auto py-12 px-4 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Hero Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">AI Coach</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal AI assistant for university admissions
          </p>
        </div>

        {/* Description */}
        <Card className="text-left">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">
              Ask questions about admissions and I'll search your Library to provide
              answers with citations from relevant guides and resources.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <FileSearch className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Smart Search</p>
                  <p className="text-xs text-muted-foreground">
                    Searches your entire library
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Cited Sources</p>
                  <p className="text-xs text-muted-foreground">
                    References specific PDFs
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Personalized</p>
                  <p className="text-xs text-muted-foreground">
                    Tailored to your profile
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <Button size="lg" disabled className="gap-2">
            <MessageSquare className="h-5 w-5" />
            Start Conversation
          </Button>
          <p className="text-sm text-muted-foreground">
            Coming soon • We're building something special
          </p>
        </div>
      </div>
    </div>
  );
}

