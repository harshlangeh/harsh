import 'dotenv/config';

import OpenAI from 'openai';


const PROMPT = "Summary of rise of AI in India"
const ROLE = "You are helpful assistant."

//GROK SDK
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

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
        return result.choices[0].message.content
    }

       

    // GROK
    async function runGroq() {
        const result = await groq.chat.completions.create({
             model : "openai/gpt-oss-20b",
            messages : [
            {role : "system", content : ROLE},
            {role : "user", content : PROMPT},
        ]})

        console.log("GROQ RESULT = ", result.choices[0].message.content)
        return result.choices[0].message.content
        
    }

    // COMBINED GEMINI AND GROK
    async function createSummary() {
    const result = await gemini.chat.completions.create({
            model : "gemini-2.0-flash",
        messages : [
        {role : "system", content : "You are assistant"},
        {role : "user", content : `Summarize in 100 words: ${await rungemini()} and ${await runGroq()}`},
    ]})

    // console.log("COMBINED RESULT = ", result.choices[0].message)
    return result.choices[0].message.content
    
    }

    console.log("summary = ", await createSummary())

}


main()
