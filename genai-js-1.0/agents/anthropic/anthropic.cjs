require("dotenv").config();
const OpenAI = require("openai");


const PROMPT = "Capital of India in one word"
const ROLE = "You are helpful assistant."


const anthropic = new OpenAI({
    apiKey: "ANTHROPIC_API_KEY",   // Your Anthropic API key
    baseURL: "https://api.anthropic.com/v1/",  // Anthropic API endpoint
});

async function main(){

    const result = await anthropic.chat.completions.create({
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
