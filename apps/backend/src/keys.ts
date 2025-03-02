import {config} from "dotenv";
import path, {resolve} from "path";

const EnvFilePath = resolve(process.cwd(), ".env");

config({path: EnvFilePath});

function getEnvVar(name: string, fallback?: string): string 
{
    const value = process.env[name] || fallback;
    
    if(value === undefined)
    {
        throw new Error(`Environment variable ${name} is not defined`);
    }
    return value;
}

export const Keys = {
    Port: getEnvVar("PORT")
}