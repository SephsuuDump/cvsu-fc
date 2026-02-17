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

    static async markPaidOnMonth(campusId: number, month: string) {
        return await requestData(
            `${url}/mark-paid?campus_id=${campusId}&month=${month}`,
            'POST',
            { "Accept": "application/json" },
        )
    }

    static async exportContributions(startDate: string, endDate: string, year: string, campusId: number, collegeId: number) {
        return await requestData(
            `${url}/export?start_date=${startDate}&year=${year}&college_id=${collegeId}&campus_id=${campusId}&end_date=${endDate}`,
            'GET',
            { "Accept": "application/json" },
        )
    }
}