import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/colleges`;

export class CollegeService {
    static async getAllColleges() {
        return await requestData(
            `${url}/get-all`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async createCollege(college: Partial<User>) {
        return await requestData(
            `${url}/create`,
            'POST',
            { "Accept": "application/json" },
            college,
        )
    }

    static async updateUser(user: Partial<User>) {
        return await requestData(
            `${url}/update`,
            'POST',
            { "Accept": "application/json" },
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