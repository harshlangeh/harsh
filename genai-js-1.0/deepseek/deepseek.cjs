require("dotenv").config();
const OpenAI = require('openai');


const PROMPT = "Capital of India"
const ROLE = "You are helpful assistant."


const deepseek = new OpenAI({
    apiKey : process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
})


async function main(){

    const result = await deepseek.chat.completions.create({
            model : "deepseek-chat",
        messages : [
        {role : "system", content : "You are assistant"},
        {role : "user", content : "What is the other name of india"},
    ]})

    console.log(result)
    console.log(result.choices[0].message)
    console.log(result.usage.total_tokens)

       
}

main()
