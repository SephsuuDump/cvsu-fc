export type Contribution = {
    id: number;
    user_id: number;
    contributed: number;
    year: string;
    month: string;

    contributions: {
        month: string;
        year: number;
        contributed: number;
    }[];
    

    first_name: string;
    last_name: string;
    college_name: string

}