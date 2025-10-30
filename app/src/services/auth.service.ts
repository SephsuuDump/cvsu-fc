import { BASE_URL } from "@/lib/urls";
import { requestData } from "./_config";
import { User } from "@/types/user";

const url = `${BASE_URL}/auth`

export class AuthService {
    static async login(credentials: Partial<User>) {
        return await requestData(
            `${url}/login`,
            'POST',
            { "Accept": "application/json" },
            credentials
        )
    } 

    static async register(user: Partial<User>) {
        return await requestData(
            `${url}/register`,
            'POST',
            { "Accept": "application/json" },
            user
        ) 
    }

    static async getCookie() {
        return await requestData(
            `/api/get-token`,
            'GET',
        )
    }

    static async setCookie(token: string) {
        return await requestData(
            `/api/set-token`,
            'POST',
            undefined,
            { token }
        )
    }

    static async deleteCookie() {
        return await requestData(
            `/api/delete-token`,
            'POST'
        )
    }
}