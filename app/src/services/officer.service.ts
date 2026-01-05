import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";
import { Allocation } from "@/types/allocation";
import { CreatePositionType, Officer } from "@/types/officer";

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

    static async createPosition(position: CreatePositionType | Omit<CreatePositionType, "parent_position_id">) {
        return await requestData(
            `${positionUrl}/create`,
            'POST',
            { "Accept": "application/json" },
            position
        )
    }

    static async updatePosition(position: CreatePositionType | Omit<CreatePositionType, "parent_position_id">, positionId: number) {
        return await requestData(
            `${positionUrl}/update?id=${positionId}`,
            'POST',
            { "Accept": "application/json" },
            position
        )
    }

    static async deletePosition(positionId: number) {
        return await requestData(
            `${positionUrl}/delete?id=${positionId}`,
            'POST',
            { "Accept": "application/json" },
        )
    }
}