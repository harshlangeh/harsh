import 'dotenv/config';
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function init() {
    const result = await client.embeddings.create({
        model: "text-embedding-3-large",
        input: "My name is Harsh Langeh",
        encoding_format: "float"
    })
    console.log(result.data[0].embedding.length);
}

init()