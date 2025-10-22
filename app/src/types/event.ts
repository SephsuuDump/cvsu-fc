type FCEvent = {
    id: number;
    title: string; // varchar | not null
    description: string; // text | nullable
    visibility: string; // role e.g. COORDINATOR, MEMBER
    userId: number; // refrenced on users | not null
    eventStart: string; //datetime
    eventEnd: string; // datetime
    createdAt: string;
    updatedAt: string;
    isDeleted: string;

    user?: {
        firstName: string;
        lastName: string;
    }
}