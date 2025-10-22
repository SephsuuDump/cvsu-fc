// id int pk ai
// email varchar unique
// password varchar min | 8, max | 32, encrypted
// role enum | (ADMIN, COORDINATOR, MEMBER, JOB OFFER)
// first_name varchar 
// middle_name varchar nullable
// last_name varchar
// campus_id int fk campus.id
// contact varchar min | 10, max | 11
// highest_educational_attainment varchar nullable
// created_at datetime default | now
// updated_at datetime dafault | now
// is_deleted boolean

type LoginCredential = {
    email: string;
    password: string;
}

export type User = {
    id: number;
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName:string
    campusId: number;
    contact: string;
    highestEducationalAttainment: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: string;

    college: {
        id: number,
        name: string;
    };

    department: {
        id: number,
        name: string;
    }

    confirmPassword?: string;
}