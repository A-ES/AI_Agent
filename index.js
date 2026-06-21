import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
    getLocation,
    getCurrentWeather,
    tools
} from "./tools.js";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY
});

const availableFunctions = {
    getLocation,
    getCurrentWeather
};

async function agent(query) {

    let response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
      You are a helpful assistant.

        When a tool can provide information needed to answer the user's question,
        call the tool.

        After receiving tool results, use them to answer the user.

        Do not ask permission before calling available tools.

      
      User: ${query}
      `,
        config: {
          tools
        }
      });
    console.log(JSON.stringify(response, null, 2));

    while (true) {

        const functionCalls = response.functionCalls;
    
        if (!functionCalls || functionCalls.length === 0) {
    
            const parts =
                response.candidates?.[0]?.content?.parts ?? [];
    
            for (const part of parts) {
                if (part.text) {
                    console.log(part.text);
                }
            }
    
            return;
        }
    
        for (const call of functionCalls) {
    
            const functionName = call.name;
            const args = call.args;
    
            console.log("Calling:", functionName, args);
    
            const result =
                await availableFunctions[functionName](
                    args?.location
                );
    
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: "user",
                        parts: [{ text: query }]
                    },
                    {
                        role: "model",
                        parts: [{
                            functionCall: {
                                name: functionName,
                                args
                            }
                        }]
                    },
                    {
                        role: "user",
                        parts: [{
                            functionResponse: {
                                name: functionName,
                                response: {
                                    result
                                }
                            }
                        }]
                    }
                ],
                config: {
                    tools
                }
            });
        }
    }
    
    
    console.log(JSON.stringify(response, null, 2));
    const parts =
    response.candidates?.[0]?.content?.parts ?? [];
  
  for (const part of parts) {
    if (part.text) {
      console.log(part.text);
    }
  
    if (part.functionCall) {
      console.log("Function Call:", part.functionCall);
    }
  }
}

await agent(
    "What are some activity ideas that I can do this afternoon based on my location and weather?"
);