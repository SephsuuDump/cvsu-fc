import { formatDateToLocal } from "@/lib/helper";
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

    static async getByCampus(campusId: number, month: string) {
        return await requestData(
            `${url}/get-by-campus?campus_id=${campusId}&month=${month}`,
            'GET',
            { "Accept": "application/json" },
        )
    }

    static async getEventsByCampus(id: number) {
        return await requestData(
            `${url}/get-all?id=${id}`,
            'GET'
        )
    }

    static async createEvent(userId: number, event: Partial<FCEvent>, files: File[]) {
        console.log(userId);
        console.log({
            ...event,
            event_start: formatDateToLocal(event.event_start!),
            event_end: formatDateToLocal(event.event_end!),
        });
        console.log(files);
        
        const formData = new FormData();
        formData.append('title', event.title!);
        formData.append('description', event.description!);
        formData.append('user_id', String(userId));
        formData.append('event_start', formatDateToLocal(event.event_start!));
        formData.append('event_end', formatDateToLocal(event.event_end!));
        formData.append('visibility', event.visibility!);
        formData.append('campus_id', String(event.campus_id!));
        files.forEach(file => {
            formData.append('files[]', file); 
        });
        
        return await requestData(
            `${url}/create`,
            'POST',
            { "Accept": "application/json" },
            formData
        )
    }

}