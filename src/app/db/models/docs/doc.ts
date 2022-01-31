import { DateTime } from "luxon";

export interface Doc {
    code: string;
    description: string;
    category?: string;
    timestampServerCreated: DateTime;
}
