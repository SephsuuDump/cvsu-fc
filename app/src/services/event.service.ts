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

    static async getEventsByCampus(campusId: number, month: string, year: string) {
        return await requestData(
            `${url}/get-by-campus?campus_id=${campusId}&month=${month}&year=${year}`,
            'GET',
            { "Accept": "application/json" },
        )
    }

    // static async getEventsByCampus(id: number) {
    //     return await requestData(
    //         `${url}/get-all?id=${id}`,
    //         'GET'
    //     )
    // }

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

    static async updateEvent(claims: Claim, event: Partial<FCEvent>, files: File[], filesToRemove: FormData) {  
        const formData = new FormData();
        formData.append('title', event.title!);
        formData.append('description', event.description!);
        formData.append('user_id', String(claims.id));
        formData.append('event_start', formatDateToLocal(event.event_start!));
        formData.append('event_end', formatDateToLocal(event.event_end!));
        formData.append('visibility', event.visibility!);
        formData.append('campus_id', String(event.campus_id!));
        files.forEach(file => {
            formData.append('files[]', file); 
        });

        for (const [key, value] of filesToRemove.entries()) {
            formData.append(key, value);
        }

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
            
        }
        
        return await requestData(
            `${url}/create`,
            'POST',
            { "Accept": "application/json" },
            formData
        )
    }

    static async deleteEvent(id: number) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'POST',
        )
    }

}