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

// announcement_files table
// announcement_id | referenced to announcement.id
// file_path string

export type Announcement = {
    id: number; // pk
    label: string; // enum GENERAL | URGENT not null 
    content: string; // text not null
    files: string[]; // list of file path
    createdAt: string; // datetime
    updatedAt: string; // datetime
    isDeleted: string; // boolean
    userId: number; // fk referenced to user.id

    user?: {
        id: number;
        lastName: string;
        firstName: string;
        middleName?: string; 
    }
}

export const announcementInit: Partial<Announcement> = {
    userId: 0,
    content: '',
    files: [],
    createdAt: '',
};
