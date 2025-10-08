import { BASE_URL } from "@/lib/urls";
import { requestData } from "./_config";
import { User } from "@/types/user";

const url = `${BASE_URL}/auth`

export class AuthService {
    static async login(credentials: Partial<User>) {
        // takes a partial User and returns a token whuch carries the claim of user
        // sample body
        // {
        //     'email': '',
        //     'password': ''
        // }
        return await requestData(
            `${url}/login`,
            'POST',
            undefined,
            credentials
        )
    } 

    static async register(user: Partial<User>) {
        // creation of user and returns the user created
        // sample body
        // {   
        //     'email': '',
        //     'password': '',
        //     'firstName': '',
        //     'middleName': '',
        //     'lastName': '',
        //     'campusId': 0,
        //     'contact', '',
        //     'highestEducationalAttainment': '',
        // }
        return await requestData(
            `${url}/register`,
            'POST',
            undefined,
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