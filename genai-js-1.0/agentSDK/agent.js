
import 'dotenv/config';
import { Agent, run } from "@openai/agents";

const agent = new Agent({
    name : "harsh_langeh",
    instructions : "your are a coder"
})

async function get(prompt){
    const result = await run(agent, prompt)
    console.log(result.finalOutput)
}

await get(" what is your name")