import { Announcement } from "@/types/announcement";

export class AnnouncementService {
    static async createAnnouncement(userId: number, announcement: Partial<Announcement>, images: File[]) {
        const formData = new FormData();
        formData.append('userId', userId.toString());
        images.forEach(file => {
            formData.append('images', file); 
        });
        formData.append('content', announcement.content!);
        formData.append('createdAt', announcement.createdAt!);

        console.log(formData);
        return formData
        
    }
}