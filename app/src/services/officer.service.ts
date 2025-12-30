import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";
import { Allocation } from "@/types/allocation";
import { Officer } from "@/types/officer";

const positionUrl = `${BASE_URL}/position`;
const officerUrl = `${BASE_URL}/position-assignment`;

export class OfficerService {
    static async getOfficersByCampus(campusId: number) {
        return await requestData(
            `${officerUrl}/get-by-campus?campus_id=${campusId}`,
            'GET',
            { "Accept": "application/json" }
        )
    }

    static async createOfficer(officer: Partial<Officer>) {
        return await requestData(
            `${officerUrl}/create`,
            'POST',
            { "Accept": "application/json" },
            officer
        )
    }

    static async deactivateOfficer(id: number) {
        return await requestData(
            `${officerUrl}/deactivate?id=${id}`,
            'POST',
            { "Accept": "application/json" },
        )
    }
}

export class PositionService {
    static async getAllPositions() {
        return await requestData(
            `${positionUrl}/get-members`,
            'GET',
            { "Accept": "application/json" }
        )
    }
}