export interface NotificationEntity {
    id: number;
    user_id: number; // Foreign key to users table
    item_id: number; // Foreign key to items table
    type: 'expiration' | 'reminder'; // Type of notification
    status: 'pending' | 'sent' | 'failed'; // Status of the notification
    scheduled_at: string; // Timestamp when the notification is scheduled
    sent_at?: string; // Timestamp when the notification was sent, if applicable
    created_at: string; // Timestamp when the notification was created
}