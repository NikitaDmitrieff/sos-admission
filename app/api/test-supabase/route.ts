import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({
            success: false,
            error: 'Missing environment variables',
            debug: {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseKey
            }
        }, { status: 500 });
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        // Mock setting cookies
                        console.log('Setting cookies:', cookiesToSet);
                    },
                },
            }
        );

        const start = Date.now();

        // 1. Google Test (DNS)
        try {
            console.log('Attempting fetch to Google');
            await fetch('https://google.com', { method: 'HEAD' });
            console.log('Google fetch SUCCESS');
        } catch (e: any) {
            console.log('Google fetch FAILED', e.message);
            return NextResponse.json({
                success: false,
                source: 'Google DNS Check',
                error: e.message,
                cause: e.cause,
                code: e.code
            }, { status: 502 });
        }

        // 2. IP Test (No DNS)
        try {
            console.log('Attempting fetch to 1.1.1.1');
            await fetch('https://1.1.1.1', { method: 'HEAD' });
            console.log('IP fetch SUCCESS');
        } catch (e: any) {
            console.log('IP fetch FAILED', e.message);
            return NextResponse.json({
                success: false,
                source: 'IP Check',
                error: e.message,
                cause: e.cause
            }, { status: 502 });
        }

        // 3. Raw Fetch Test (Supabase)
        try {
            console.log('Attempting raw fetch to:', supabaseUrl);
            const rawRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
                method: 'GET',
                headers: {
                    'apikey': supabaseKey
                }
            });
            console.log('Raw fetch status:', rawRes.status);
            if (!rawRes.ok) {
                return NextResponse.json({
                    success: false,
                    source: 'Raw Fetch',
                    status: rawRes.status,
                    statusText: rawRes.statusText,
                    env: { url: supabaseUrl.replace(/./g, '*') }
                }, { status: 502 });
            }
        } catch (rawErr: any) {
            return NextResponse.json({
                success: false,
                source: 'Raw Fetch Exception',
                error: rawErr.message,
                cause: rawErr.cause ? JSON.stringify(rawErr.cause) : undefined,
                env: { url: supabaseUrl.replace(/./g, '*') }
            }, { status: 502 });
        }

        // 2. Supabase Client Test
        // Force a network request by attempting to sign in with fake credentials
        // This ensures we actually hit the Supabase Auth API
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'wrongpassword'
        });

        const duration = Date.now() - start;

        // We expect a 400 error (Invalid login credentials)
        // If we get "fetch failed", that's the bug.
        if (error && error.message !== 'Invalid login credentials') {
            return NextResponse.json({
                success: false,
                source: 'Supabase Auth (Forced Request)',
                error: error.message,
                details: error,
                duration,
                env: {
                    url: supabaseUrl.replace(/./g, '*')
                }
            }, { status: 502 });
        }

        return NextResponse.json({
            success: true,
            result: 'Connection Successful (Got expected invalid login response)',
            duration
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            source: 'Exception',
            message: err.message,
            cause: err.cause ? JSON.stringify(err.cause, Object.getOwnPropertyNames(err.cause)) : undefined,
            stack: err.stack,
        }, { status: 500 });
    }
}
