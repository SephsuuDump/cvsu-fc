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

    static async getAnnouncementsByBranch(id: number) {
        return await requestData(
            `${url}/get-all?id=${id}`,
            'GET'
        )
    }
    static async createAnnouncement(userId: number, announcement: Partial<Announcement>, files: File[]) {
        console.log(userId);
        console.log(files);
        console.log(announcement);
        
        
        
        const formData = new FormData();
        formData.append('user_id', userId.toString());
        files.forEach(file => {
            formData.append('files[]', file); 
        });
        formData.append('content', announcement.content!);
        formData.append('label', announcement.label!)
        
        return await requestData(
            `${url}/create`,
            'POST',
            { "Accept": "application/json" },
            formData
        )
    }

}