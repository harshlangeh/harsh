import 'dotenv/config';

import OpenAI from 'openai';


const PROMPT = "explain in 20 words do engineering degree have value today in india"
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
        {role : "user", content : PROMPT},
    ]})

    return result

}

const output = await main()


console.log(output.choices[0].message.content)

export {main, output}