import 'dotenv/config';

import OpenAI from 'openai';

import axios from 'axios';


async function getWeatherDetailsByCity(cityname =""){
    const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`;
    const {data} = axios.get(url, {responseType: 'text'});
    return `the current weather of ${city} is ${data}`
}


// const USER_PROMPT = "what is the weather in Noida today"
const USER_PROMPT = "hi"
const ROLE = "You are helpful assistant."


const toolMap = {
    getWeatherDetailsByCity: getWeatherDetailsByCity,
}



// GEMINI SDK
const gemini = new OpenAI({
    apiKey : process.env.GEMINI_API_KEY,
    baseURL : "https://generativelanguage.googleapis.com/v1beta/openai/"
})



async function main(){

    const SYSTEM_PROMPT =  `
    You are an AI assistant who work on Start, think and output format.
    For a given user query first think the problem and breakdown the problem into subproblem.
    You should always be thinking and thinking before giving the actual output

    Before outputing the final result to the use you must check once if every thing is correct.

    You have list of tools that you can call based on the user query.
    For every tool call you make wait for the obervations from the tool, which is response from the tool you called.

    Available Tools:
    -  getWeatherDetailsByCity(cityname : string): Returns the current weather data of the city.


    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from tool.

    Output JSON Format:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL" , "content": "string", "tool_name": "string", "input": "STRING" }

    Example:
    User: Hey, can you tell me weather of Patiala?
    ASSISTANT: { "step": "START", "content": "The user is intertested in the current weather details about Patiala" } 
    ASSISTANT: { "step": "THINK", "content": "Let me see if there is any available tool for this query" } 
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available getWeatherDetailsByCity which returns current weather data" } 
    ASSISTANT: { "step": "THINK", "content": "I need to call getWeatherDetailsByCity for city patiala to get weather details" }
    ASSISTANT: { "step": "TOOL", "input": "patiala", "tool_name": "getWeatherDetailsByCity" }
    DEVELOPER: { "step": "OBSERVE", "content": "The weather of patiala is cloudy with 27 Cel" }
    ASSISTANT: { "step": "THINK", "content": "Great, I got the weather details of Patiala" }
    ASSISTANT: { "step": "OUTPUT", "content": "The weather in Patiala is 27 C with little cloud. Please make sure to carry an umbrella with you. ☔️" }
    `
   
    // const messages = [
    //     {
    //         role : "system",
    //         content : "SYSTEM_PROMPT"
    //     },
    //     {
    //         ROLE : "user",
    //         content : USER_PROMPT
    //     }
    // ];


    
    const messagesArray = [
        {
            role : "system",
            content : "you are helper"
        },
        {
            role : "user",
            content : "latest AI news in market, tell me in 10 words"
        }
    ]

    while (true) {
        // if messageAaary is kept inside the loop loop it will recreate the array and only latest message get pushed
        // console.log("=>",messagesArray)


        const response = await gemini.chat.completions.create({
        model : "gemini-2.0-flash",
        messages : messagesArray
    })

        const rawContent = response.choices[0].message.content
        console.log(rawContent)
        // const rawContentString = JSON.stringify(rawContent)
        // console.log((rawContentString))

        messagesArray.push({
            role : "assistant",
            content : JSON.stringify(rawContent),
        })

        console.log("==>",messagesArray)

        console.log(`===============NEW==================`)
    
        // break;

    }
   



    
    
    
    // while(true) {
    //     const result = await gemini.chat.completions.create({
    //         model : "gemini-2.0-flash",
    //         messages : messages
    //     })

    //     const rawContent = result.choices[0].message.content
    //     // const parsedContent = JSON.parse(rawContent)
    //     const parsedContent = rawContent

    //     messages.push({
    //         role : "asstant",
    //         content : JSON.stringify(parsedContent)
    //     });

    //     if (parsedContent.step === 'start') {
    //         console.log(`🔥`, parsedContent.content);
    //         continue;
    //     }

    //     if (parsedContent.step === "think") {
    //         console.log(`\t🧠`, parsedContent.content);
    //         continue;
    //     }
    //     if (parsedContent.step === "tool") {
    //         const toolTOCall = parsedContent.tool_name ;
    //         if(!toolMap[toolTOCall]) {
    //             messages.push({
    //                 role : 'developer',
    //                 content : `there is no such tool as ${toolTOCall}`,
    //             })
    //             continue;
    //         }

            
    //         const responseFromTool =  await toolMap[toolTOCall](parsedContent.input)

    //         console.log(` 🛠️: ${toolTOCall}(${parsedContent.input}) =`, responseFromTool)

    //         messages.push({
    //             role : "developer",
    //             content : JSON.stringify({ step : 'OBSERVE', content : responseFromTool}),
    //         });

    //         continue;
    //     }


    //     if (parsedContent.step === 'output') {
    //         console.log(`🤖`, parsedContent.content);
    //         break;
    //     }

    // }

    
  console.log('Done...');

}


main()
