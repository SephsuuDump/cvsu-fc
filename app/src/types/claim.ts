type Claim = {
    id: number;
    firstName: string;
    lastName: string;
    campus: {
        id: number;
        name: string;
    };
    college: {
        id: number;
        name: string;
    }
    role: string;
    iat: number;
    exp: number;
}

