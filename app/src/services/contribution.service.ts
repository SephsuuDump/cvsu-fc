import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/contributions`;

export class ContributionService {
    static async getByCampusCollege(campusId: number, collegeId: number, year: string) {
        return await requestData(
            `${url}/sephsu?campus_id=${campusId}&college_id=${collegeId}&year=${year}`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async updateContribution(id: number, updatedContribution: boolean) {
        return await requestData(
            `${url}/update?id=${id}`,
            'GET',
            { "Accept": "application/json" },
            { contribution: updatedContribution }
        )
    }
}