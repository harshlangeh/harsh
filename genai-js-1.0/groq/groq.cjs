require("dotenv").config();
const OpenAI = require("openai");


const PROMPT = "Capital of India in one word"
const ROLE = "You are helpful assistant."


const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});


async function main(){

    const result = await client.chat.completions.create({
            model : "openai/gpt-oss-20b",
        messages : [
        {role : "system", content : "You are assistant"},
        {role : "user", content : "What is the other name of india"},
    ]})

    console.log(result)
    console.log(result.choices[0].message)
    console.log(result.usage.total_tokens)
    console.log(client.models.list)

       
}

main()
