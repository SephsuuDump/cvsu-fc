import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/contributions`;

export class ContributionService {
    static async getByCampusCollege(page: number, size: number, campusId: number, collegeId: number) {
        return await requestData(
            `${url}/get-all?page=${page}&size=${size}&campus_id=${campusId}&college_id=${collegeId}`,
            'GET',
            { "Accept": "application/json" }
        )
    }
}