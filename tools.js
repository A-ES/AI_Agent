export async function getLocation() {
    return "Bangalore, India";
}

export async function getCurrentWeather(location) {
    return `Sunny, 28°C in ${location}`;
}

export const tools = [{
    functionDeclarations: [
        {
            name: "getLocation",
            description: "Get the user's current location"
        },
        {
            name: "getCurrentWeather",
            description: "Get the weather for a location",
            parameters: {
                type: "OBJECT",
                properties: {
                    location: {
                        type: "STRING"
                    }
                },
                required: ["location"]
            }
        }
    ]
}];