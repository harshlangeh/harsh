import 'dotenv/config';

import OpenAI from 'openai';


const PROMPT = "Summary of rise of AI in India"
const ROLE = "You are helpful assistant."

 


// GEMINI SDK
const gemini = new OpenAI({
    apiKey : process.env.GEMINI_API_KEY,
    baseURL : "https://generativelanguage.googleapis.com/v1beta/openai/"
})


async function main(){
    //gemini
    async function rungemini() {
        const result = await gemini.chat.completions.create({
             model : "gemini-2.0-flash",
            messages : [
            {role : "system", content : ROLE},
            {role : "user", content : PROMPT},
        ]})

        console.log("GEMINI RESULT = ", result.choices[0].message.content)
        console.log("Typeof = ", typeof(result.choices[0].message.content))

        return result.choices[0].message.content
    }

    rungemini()

}


main()
