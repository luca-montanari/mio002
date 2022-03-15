import { Timestamp } from "firebase/firestore";

export interface Doc {
    id: string;
    code: string;
    description: string;
    category?: string;
    timestampClientAddDoc: Timestamp;
    timestampServerAddDoc: Timestamp;
    timestampClientUpdateDoc: Timestamp;
    timestampServerUpdateDoc: Timestamp;
}
