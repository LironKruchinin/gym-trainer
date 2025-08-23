export interface ItemTypeEntity {
    id: number;
    name: string; // e.g., "Electronics", "Furniture", etc.
    description?: string; // Optional, can provide more details about the item type
    icon?: string; // Optional, URL or identifier for an icon representing the item type
    created_at: Date;
    updated_at: Date;
}