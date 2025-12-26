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

    static async getAnnouncementById(id: number) {
        return await requestData(
            `${url}/get-by-id?id=${id}`,
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
        console.log(announcement.label);
        
        console.log("user_id:", userId);
        
        const formData = new FormData();
        formData.append('user_id', userId.toString());
        files.forEach(file => {
            formData.append('files[]', file); 
        });
        formData.append('content', announcement.content!);
        formData.append('label', announcement.label!);
        formData.append('campus_id', String(announcement.campus_id!))

        console.log("===== FormData contents =====");
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(key, "=> FILE:", value.name, "(", value.type, ")");
            } else {
                console.log(key, "=>", value);
            }
        }
        
        return await requestData(
            `${url}/create`,
            'POST',
            { "Accept": "application/json" },
            formData
        )
    }

    static async likeAnnouncement(announcementId: number, token: string | null) {
        return await requestData(
            `${url}/${announcementId}/like`,
            'POST',
            { "Authorization": `Bearer ${token}`  }
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