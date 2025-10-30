import { BASE_URL } from "@/lib/urls";
import { requestData } from "./_config";
import { Campus } from "@/types/campus";

const url = `${BASE_URL}/campuses`

export class CampusService {
    static async getAllCampus() {
        return await requestData(
            `${url}/get-all`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async createCampus(campus: Partial<Campus>) {
        return await requestData(
            `${url}/create`,
            'POST',
            undefined,
            campus,
        )
    }

    static async updateCampus(campus: Partial<Campus>) {
        return await requestData(
            `${url}/update`,
            'POST',
            undefined,
            campus,
        )
    }

    static async deleteCampus(id: number) {
        return await requestData(
            `${url}/delete`,
            'POST'
        )
    }
}