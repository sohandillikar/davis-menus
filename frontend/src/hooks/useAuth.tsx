import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session && session.user ? session.user : null);
		});

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(e, session) => {
				setUser(session && session.user ? session.user : null);
			}
		);

		return () => subscription.unsubscribe();
	}, []);

	const signIn = async () => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
					provider: 'google',
					options: {
						redirectTo: `${window.location.origin}/auth/callback`,
						queryParams: {
							access_type: 'offline',
							prompt: 'select_account'
						}
					}
			});
			if (error) {
				console.error('Google sign-in error:', error);
				// Handle error (show toast, etc.)
			}
		} catch (err) {
			console.error('Sign-in error:', err);
		}
	}

	const signOut = async () => {
		await supabase.auth.signOut();
	}

	return {
		user,
		isSignedIn: user !== null,
		signIn,
		signOut
	};
}
