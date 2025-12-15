export type Allocation = {
    id: number;
    title: string;
    description: string;
    amount: number;
    level: string;
    campus_id: number;
    college_id: number | null;

    campus: {
        id: number;
        name: string;
    };
    college: {
        id: number;
        name: string;
        abbreviations: string;
    };
}

