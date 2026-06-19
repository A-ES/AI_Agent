import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.GEMINI_API_KEY);


const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY,
});

const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents:"give me list of activity based on my curent loc"
});
console.log(response.text);