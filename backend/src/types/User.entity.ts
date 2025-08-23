export interface UserEntity {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string; // Optional, as it may not be returned in some contexts
    auth_provider: 'email' | 'google' | 'facebook' | 'apple'; // Extend as needed
    provider_id?: string; // Google/Facebook ID, optional if using email auth
    profile_image?: string; // URL to profile image, optional
    subscription_status: 'free' | 'premium' | 'trial'; // Extend as needed
    created_at: Date;
    updated_at: Date;
}