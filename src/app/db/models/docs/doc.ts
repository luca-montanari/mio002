import { Timestamp } from "firebase/firestore";

export interface Doc {
    code: string;
    description: string;
    category?: string;
    timestampClientAddDoc: Timestamp;
    timestampServerAddDoc: Timestamp;
}
