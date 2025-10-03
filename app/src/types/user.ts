
// id int pk ai
// email varchar unique
// password varchar min | 8, max | 32, encrypted
// created_at datetime default | now
// is_deleted boolean

type LoginCredential = {
    email: string;
    password: string;
}