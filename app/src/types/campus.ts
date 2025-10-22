// id int pk ai
// name varchar
// created_at datetime default | now
// updated_at datetime dafault | now
// is_deleted boolean

export type Campus = {
    id: number;
    name: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}