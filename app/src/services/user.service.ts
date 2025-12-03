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

    static async getUsersByCampus(id: number) {
        return await requestData(
            `${url}/get-by-campus?campus_id=${id}`,
            'GET',
            { "Accept": "application/json" }
        )
        
    } 

    static async updateUser(user: Partial<User>) {
        return await requestData(
            `${url}/update?id=${user.id}`,
            'POST',
            { "Accept": "application/json" },
            user,
        )
    }

    static async deleteUser(id: number) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'POST',
            { "Accept": "application/json" }
        )
    }
}