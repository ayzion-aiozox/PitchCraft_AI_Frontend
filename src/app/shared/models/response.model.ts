import { ResponseStatus } from "./response-status.model";

export interface Response {
    data: any;
    status: ResponseStatus;
}
