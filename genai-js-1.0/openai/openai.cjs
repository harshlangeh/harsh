require("dotenv").config();
const OpenAI = require("openai");


const PROMPT = "Capital of India in one word"
const ROLE = "You are helpful assistant."


const gemini = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
})


async function main(){

    const result = await gemini.chat.completions.create({
            model : "gpt-4.1",
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
