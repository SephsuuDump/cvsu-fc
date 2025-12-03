import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/contributions`;

export class ContributionService {
    static async getByCampusCollege(campusId: number, collegeId: number, year: string) {
        const campusParam = Number.isNaN(Number(campusId)) ? "" : campusId;
        const collegeParam = Number.isNaN(Number(collegeId)) ? "" : collegeId;
        
        
        return await requestData(
            `${url}/get-contributions?campus_id=${campusParam}&college_id=${collegeParam}&year=${year}`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async updateContribution(id: number, updatedContribution: number) {
        return await requestData(
            `${url}/update?id=${id}&contributed=${updatedContribution}`,
            'POST',
            { "Accept": "application/json" },
        )
    }
}