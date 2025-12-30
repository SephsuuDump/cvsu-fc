import { Campus } from "./campus";

export type Officer = {
    campus: {
        id: number;
        name: string;
    }
    organization: {
        assignments: {
            id: number,
            name: string,
            assigned_date: string;
        }[],
        is_unique: boolean;
        position_id: number;
        position_name: string;
    }[]

    user_id: number;
    position_id: number;
    campus_id: number;
    assigned_date: string;
}

export type Position = {
    id: number;
    position: string;
    users: {
        name: string;
        campus: string;
        date_assigned: string;
    }[]
}
