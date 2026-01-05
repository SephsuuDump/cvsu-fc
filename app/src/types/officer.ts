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
    }[],

    user_id: number;
    position_id: number;
    campus_id: number;
    assigned_date: string;
}

export type Position = {
    id: number;
    position: string;
    is_unique: number;
    parent_position_id: number;
    users: {
        name: string;
        campus: string;
        date_assigned: string;
    }[]
}

export type CreatePositionType = {
    name: string;
    parent_position_id: number | null;
    is_unique: boolean;
}
