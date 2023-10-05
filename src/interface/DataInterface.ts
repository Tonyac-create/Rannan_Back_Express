import { DataFormat } from "../entity/Data";

export interface DataCreateInterface {
    type: DataFormat;
    name: string;
    value: string;
    user_id: number;
}
