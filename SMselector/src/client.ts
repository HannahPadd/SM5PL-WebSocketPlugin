import { v4 as uuidv4 } from 'uuid'

type RequestEntry = {
    request: any,
    response: any,
    callback: (message: any) => void,
    reject: (message: any) => void
};

let requests: { [id: string]: RequestEntry } = {};
export const client = new WebSocket("ws://192.168.2.2:8081");

client.onmessage = (e) => {
    const message = JSON.parse(e.data);
    console.log("Received: ", message);
    
    if(message.id && requests[message.id]) {
        const req = requests[message.id]
        if(message.success) {
            req.callback(message)
        }
        else {
            req.reject(message)
        }
    }
};

interface RequestData {
    id?: string;
    action?: string;
    [key: string]: any;
}

interface SendRequestResponse {
    id: string;
    action: string;
    success?: boolean;
    [key: string]: any;
}

export function sendRequest(action: string, data: RequestData): Promise<SendRequestResponse> {
    return new Promise<SendRequestResponse>((resolve, reject) => {
        data.id = uuidv4();
        data.action = action;

        requests[data.id] = {
            request: data,
            response: null,
            callback: resolve,
            reject
        };

        client.send(JSON.stringify(data));
    });
}
