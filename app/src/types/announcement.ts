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
    files: {
        id: number;
        file_name: string;
        file_path: string;
    }[]; // list of file path
    created_at: string; // datetime
    updated_at: string; // datetime
    is_deleted: string; // boolean
    user_id: number; // fk referenced to user.id

    user?: {
        id: number;
        last_name: string;
        first_name: string;
        middle_name?: string; 
    }
}

export const announcementInit: Partial<Announcement> = {
    user_id: 0,
    content: '',
    label: 'GENERAL'
};
