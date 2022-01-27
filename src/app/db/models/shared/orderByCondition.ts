import { OrderByDirection } from "firebase/firestore";

export interface OrderByCondition {
    fieldName: string;
    orderByDirection: OrderByDirection;
}