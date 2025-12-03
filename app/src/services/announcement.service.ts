import { Announcement } from "@/types/announcement";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/announcements`

export class AnnouncementService {
    static async getAllAnnouncements() {
        return await requestData(
            `${url}/get-all`,
            'GET',
            { "Accept": "application/json" },
        )
    }

    static async getAnnouncementsByCampus(id: number) {
        return await requestData(
            `${url}/get-by-campus?campus_id=${id}`,
            'GET'
        )
    }
    
    static async createAnnouncement(userId: number, announcement: Partial<Announcement>, files: File[]) {
        const formData = new FormData();
        formData.append('user_id', userId.toString());
        files.forEach(file => {
            formData.append('files[]', file); 
        });
        formData.append('content', announcement.content!);
        formData.append('label', announcement.label!);
        formData.append('campus_id', String(announcement.campus_id!))
        
        return await requestData(
            `${url}/create`,
            'POST',
            { "Accept": "application/json" },
            formData
        )
    }

    static async updateAnnouncement(userId: number, announcement: Partial<Announcement>, files: File[], filesToRemove: FormData) {
        const formData = new FormData();
        formData.append('user_id', userId.toString());
        files.forEach(file => {
            formData.append('files[]', file); 
        });
        formData.append('content', announcement.content!);
        formData.append('label', announcement.label!)

        for (const [key, value] of filesToRemove.entries()) {
            formData.append(key, value);
        }
        
        return await requestData(
            `${url}/update?id=${announcement.id}`,
            'POST',
            { "Accept": "application/json" },
            formData
        )
    }

    static async deleteAnnouncement(id: number) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'POST',
            { "Accept": "application/json" }
        )
    }

}