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

    static async getUserById(id: number) {
        return await requestData(
            `${url}/get-by-id?id=${id}`,
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

    static async getUserByCampusCollege(campusId: number, collegeId: number) {
        return await requestData(
            `${url}/get-by-college?campus_id=${campusId}&college_id=${collegeId}`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async getGenderCount(campusId: number) {
        return await requestData(
            `${url}/gender-count?campus_id=${campusId}`,
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

    static async updateProfileImage(id: number, file: File) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('id', String(id));
        
        return await requestData(
            `${url}/upload`,
            'POST',
            { "Accept": "application/json" },
            formData
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