export type Contribution = {
    userId: number;

    contributions: {
        date: string;
        contributed: boolean;
    }[];
    
    user?: {
        firstName: string;
        lastName: string;
        collegeName: string
    },
}