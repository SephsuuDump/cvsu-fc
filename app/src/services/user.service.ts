import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/users`;

export class UserService {
    static async getAllUsers() {
        return await requestData(
            `${url}/get-all`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async updateUser(user: Partial<User>) {
        return await requestData(
            `${url}/update`,
            'POST',
            undefined,
            user,
        )
    }

    static async deleteUser(id: number) {
        return await requestData(
            `${url}/delete`,
            'POST'
        )
    }
}