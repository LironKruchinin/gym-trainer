export interface ItemTagsEntity {
    item_id: number; // Foreign key referencing the item
    tag_id: number; // Foreign key referencing the tag
}