import {useContext, createContext} from "react";

interface ApiProvider {
    baseURL: string;
    token: string;
}

export const ApiContext = createContext<ApiProvider | null>(null);

export const useApi = (): ApiProvider => {
    const context = useContext(ApiContext);;

    if(!context){
        throw new Error("useApi must be used within ApiProvider");
    }

    return context;

}