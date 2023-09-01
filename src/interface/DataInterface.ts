import { DataFormat } from "../entity/Data";

export interface DataCreateInterface {

    format: DataFormat;
    name: string;
    value: string;
}
