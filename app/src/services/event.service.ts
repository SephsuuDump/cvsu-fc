import { Announcement } from "@/types/announcement";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/events`

export class EventService {
    static async getAllEvents(page: number, limit: number) {
        return await requestData(
            `${url}/get-all?page=${page}&limit=${limit}`,
            'GET',
            { "Accept": "application/json" },
        )
    }

    static async getAnnouncementsByBranch(id: number) {
        return await requestData(
            `${url}/get-all?id=${id}`,
            'GET'
        )
    }
    static async createAnnouncement(userId: number, announcement: Partial<Announcement>, images: File[]) {
        const formData = new FormData();
        formData.append('userId', userId.toString());
        images.forEach(file => {
            formData.append('images', file); 
        });
        formData.append('content', announcement.content!);
        formData.append('createdAt', announcement.createdAt!);
        return formData        
    }

}