import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/users`;

export class UserService {
    static async updateUser(user: Partial<User>) {
        // updating a user instance (personal info only) and returning the updated object
        // sample body 
        // {   
        //     'firstName': '',
        //     'middleName': '',
        //     'lastName': '',
        //     'contact', '',
        //     'highestEducationalAttainment': '',
        // }
        return await requestData(
            `${url}/update`,
            'POST',
            undefined,
            user,
        )
    }

    static async deleteUser(id: number) {
        // deleting a user instance and returning the deleted user
        return await requestData(
            `${url}/delete`,
            'POST'
        )
    }
}