// announcements
// id pk ai
// user_id fk -> user not null
// label enum | (urgent, general)
// content text
// created_at datetime default | now
// updated_at datetime default | now
// is_deleted boolean

// announcement_images
// id pk ai
// announcement_id fk -> announcements
// image_url text

export type Announcement = {
    id: number;
    label: string;
    content: string;
    images: string[];
    createdAt: string;

    user: {
        id: number;
        lastName: string;
        firstName: string;
        middleName?: string; 
    }

    userId?: number;
    announcementImages?: []

}

export const announcementInit: Partial<Announcement> = {
    userId: 0,
    content: '',
    announcementImages: [],
    createdAt: '',
};
