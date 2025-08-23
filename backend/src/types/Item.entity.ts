export interface ItemEntity {
    id: number;
    user_id: number;
    item_type_id: number;
    title: string;
    store_name: string | null;
    price: number | null;
    purchase_date: Date; // or Date if cast
    warranty_months: number | null;
    expiration_date: Date; // or Date
    notes: string | null;
    file_url: string | null;
    created_at: string;
    updated_at: string;
    description: string;
}
