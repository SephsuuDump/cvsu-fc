import { BASE_URL } from "@/lib/urls";
import { requestData } from "./_config";
import { Campus } from "@/types/campus";

const url = `${BASE_URL}/campus`

export class CampusService {
    static async getAllCampus() {
        // returns all campuses
        return await requestData(
            `${url}/get-all`,
            'GET'
        )
    }

    static async createCampus(campus: Partial<Campus>) {
        // creation of campus instace and returning the creaeted object
        // sample body 
        // {
        //     'name': ''
        // }
        return await requestData(
            `${url}/create`,
            'POST',
            undefined,
            campus,
        )
    }

    static async updateCampus(campus: Partial<Campus>) {
        // updating a campus instace and returning the updated object
        // sample body 
        // {
        //     'id': 0,
        //     'name': ''
        // }
        return await requestData(
            `${url}/update`,
            'POST',
            undefined,
            campus,
        )
    }

    static async deleteCampus(id: number) {
        // deleting a campus instance and returning the deleted campus
        return await requestData(
            `${url}/delete`,
            'POST'
        )
    }
}