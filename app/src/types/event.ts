type FCEvent = {
    id: number;
    title: string; 
    description: string; 
    visibility: string;
    user_id: number;
    event_start: string; 
    event_end: string; 
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
    },

    accomplishment_report: {
        id: number;
        title: string;
        introduction: string;
        objectives: string;
        accomplishments: string;
        images: {
            id: number;
            image_path: string;
        } []
    }
}

type AccomplishmentReport = {
    id: number;
    title: string;
    introduction: string;
    objectives: string;
    accomplishments: string;
    images: {
        id: number;
        image_path: string;
    } []
}