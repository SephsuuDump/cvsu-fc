export type Contribution = {
    userId: number;

    contributions: {
        month: string;
        year: number;
        contributed: boolean;
    }[];
    
    user?: {
        firstName: string;
        lastName: string;
        collegeName: string
    },
}