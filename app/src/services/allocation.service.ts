import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";
import { Allocation } from "@/types/allocation";

const url = `${BASE_URL}/allocations`;

export class AllocationService {
    static async getAllocations(campusId: number, collegeId: number, year: string, month: string) {
        return await requestData(
            `${url}/get-by-campus?campus_id=${campusId}&college_id=${collegeId}&year=${year}&month=${month}`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async getCollegeBudget(campusId: number, collegeId: number, year: string, month: string) {
        return await requestData(
            `${BASE_URL}/budget/college-active?campus_id=${campusId}&college_id=${collegeId}&year=${year}&month=${month}`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async createAllocation(allocation: Partial<Allocation>) {
        return await requestData(
            `${url}/create`,
            'POST',
            { "Accept": "application/json" },
            allocation
        )
    }
}