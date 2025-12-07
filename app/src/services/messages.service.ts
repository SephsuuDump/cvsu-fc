import { User } from "@/types/user";
import { requestData } from "./_config";
import { BASE_URL } from "@/lib/urls";

const url = `${BASE_URL}/messages`;

export class MessagesService {

    static async getConversationsByUser(id: number) {
        const token = localStorage.getItem("token")
        console.log(token);
        
        
        return await requestData(
            `${BASE_URL}/conversation`,
            'GET',
            { Authorization: `Bearer ${token}`},
        )
    }

    static async getMessagesByUser(convoId: number) {
        return await requestData(
            `${BASE_URL}/conversations/${convoId}/messages`,
            'GET',
            { Authorization: `Bearer ${localStorage.getItem("token")}`},
        )
    }
}