type FCEvent = {
    id: number;
    title: string; // varchar | not null
    description: string; // text | nullable
    visibility: string; // role e.g. COORDINATOR, MEMBER
    user_id: number; // refrenced on users | not null
    event_start: string; //datetime
    event_end: string; // datetime
    campus_id: number;
    created_at: string;
    updated_at: string;
    is_deleted: string;
    files: {
        id: number;
        file_name: string;
        file_path: string;
    }[]; 

    user?: {
        id: number;
        first_name: string;
        last_name: string;
    }

    campus?: {
        id: number;
        name: string;
    }
}