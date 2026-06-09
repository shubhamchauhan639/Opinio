import {Message} from "@/model/User";
export interface ApiResponse {
    success: boolean;
    message: string;
  isAcceptingMessage?: string;
    messages?: Array<Message>;

}