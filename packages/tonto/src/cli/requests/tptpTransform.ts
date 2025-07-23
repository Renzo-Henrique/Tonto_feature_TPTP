/*import fetch from "node-fetch-native";
import { Project } from "ontouml-js";

//TODO:: verificar corretude do arquivo
//TODO:: É necessário? Percebi que é request de api

export interface TptpResultResponse {
    result: string
}

export interface ErrorTptpResultResponse {
    id?: string
    message?: string
    status?: number
    info: ErrorInfo[]
}

interface ErrorInfo {
    code?: string
    description?: string
    severity?: string
    title?: string
}


export async function TransformTontoToTptp(project: Project): Promise<TptpResultResponse | ErrorTptpResultResponse> {
    const body = {
        project,
        options: undefined,
    };
    
    try {
        const response = await fetch("http://api.ontouml.org/v1/transform/gufo", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
        const json = await response.json();
        const resultResponse = json as TptpResultResponse;
        if (resultResponse) {
            return resultResponse;
        } else {
            return json as ErrorTptpResultResponse;
        }
    } catch (error) {
        console.log(error);
    }
    return {
        status: 500,
        message: "error while transforming model to Gufo",
    } as ErrorTptpResultResponse;
}

*/