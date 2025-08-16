import 'dotenv/config';

import OpenAI from 'openai';


const PROMPT = "Capital of India"
const ROLE = "You are helpful assistant."


const gemini = new OpenAI({
    apiKey : process.env.GEMINI_API_KEY,
    baseURL : "https://generativelanguage.googleapis.com/v1beta/openai/"
})


async function main(){

    const result = await gemini.chat.completions.create({
            model : "gemini-2.0-flash",
        messages : [
        {role : "system", content : "You are assistant"},
        {role : "user", content : "What is the other name of india"},
    ]})

    console.log(result)
    console.log(result.choices[0].message)
    console.log(result.usage.total_tokens)

       
}

main()
