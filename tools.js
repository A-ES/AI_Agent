export async function getCurrentWeather(){
const Weather ={
    temperature:"20",
    unit:"C",}
    return JSON.stringify(Weather);
}
export async function getLocation(){
    return "bangalore, India"
}