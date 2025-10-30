'use client';

import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth/actions';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = isSignUp ? await signUp(formData) : await signIn(formData);
      
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center">
      <div 
        className="w-full max-w-[380px] border bg-background shadow-lg transition-all duration-300 ease-in-out"
        style={{ borderRadius: 0 }}
      >
        {/* Header */}
        <div 
          className="border-b px-6 py-4 transition-all duration-300"
          style={{ borderRadius: 0 }}
        >
          <h2 className="text-base font-medium transition-opacity duration-300">
            {isSignUp ? 'Create account' : 'Sign in'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label 
              htmlFor="email" 
              className="text-xs font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
              className="w-full h-9 px-3 text-sm bg-background border focus:outline-none focus:border-foreground disabled:opacity-50 transition-all"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="space-y-1.5">
            <label 
              htmlFor="password" 
              className="text-xs font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={6}
              className="w-full h-9 px-3 text-sm bg-background border focus:outline-none focus:border-foreground disabled:opacity-50 transition-all"
              style={{ borderRadius: 0 }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 text-sm bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all border border-foreground"
            style={{ borderRadius: 0 }}
          >
            {isLoading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <div 
          className="border-t px-6 py-3 transition-all duration-300"
          style={{ borderRadius: 0 }}
        >
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
