import 'dotenv/config';
import OpenAI from 'openai';
import axios from 'axios';
import {exec} from 'child_process'


const client = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
})


const toolMap = {
    executeCommand : executeCommand
}


async function executeCommand(cmd="") {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, data) => {
            if (error) {
                resolve(`error command run ${error}`)
            } else {
                resolve(data)
            }
        })
    })
}


const SYSTEM_PROMPT = `
You are an ai assistant
Your job is to find the solution of the problem
You work in following steps - START, THINK, OBSERVE, OUTPUT
You always repond in JSON Format
{
    step : START | THINK | OBSERVE | OUTPUT | TOOL , "content" : "string", "toolName" : "string", "input" : "string"
}

You have some tools provided in toolMap, use this tool if you think i am unable to do it on yourself.

Avaliable tools : find all the avaliable tools in toolMap
- executeCommand(cmd="string") = Takes the linus/unix command and execute it on the user machine 


Make sure after start using the tool you should wait for the tool to finish his job and then proceed to next step
Make sure to execute the commands one by one not at once


Example:
user : create an html sample page
ASSISTANT : {"step" : START, "content" : user need an html page }
ASSISTANT : {"step" : THINK, "content" : Find the avaliable tool to do the job }
ASSISTANT : {"step" : THINK, "content" : executeCommand(cmd="string") is avaliable for this job }
ASSISTANT : {"step" : THINK, "content" : command need to run tool executeCommand(cmd="string") for this job }
ASSISTANT : {"step" : THINK, "content" : executing the tool name executeCommand(cmd="string") with required command }
ASSISTANT : {"step" : OBSERVE, "content" : executing the commands (command name) on user PC and creating the index.html file }
ASSISTANT : {"step" : OBSERVE, "content" : writing the code as per user requirements in index.html file }
ASSISTANT : {"step" : OBSERVE, "content" : waiting for tool to execute the index.html file }
ASSISTANT : {"step" : Output, "content" : i have create index.html file as per the requirements of the user}
`;

 

const messages = [
                {
                    role : "system",
                    content : SYSTEM_PROMPT
                },
                {
                    role : "user",
                    // content : "tell me in 20 words why is sky blue"
                    content : "create a folder name myapp and inside it create a simple timer clock in html css and js"
                }
            ];

async function main(){
    while(true){
        const result = await client.chat.completions.create({
            model : "gpt-4.1-mini",
            messages : messages
        });

        const rawContent = result.choices[0].message.content  // string
        const parsedContent = JSON.parse(rawContent) // Object

        messages.push({
        role: 'assistant',
        content: JSON.stringify(parsedContent),
        });

       
        if (parsedContent.step === "START") {
            console.log(`🔥`,parsedContent.content);
            continue;
        };

        if (parsedContent.step === "THINK") {
            console.log(`\t🧠`, parsedContent.content);
            continue;
        };

        if (parsedContent.step === 'TOOL') {
            const toolToCall = parsedContent.toolName;
            if(!toolMap[toolToCall]){
                messages.push ({
                    role : "developer",
                    content : `ther is no tool as ${toolToCall}`,
                })

                continue;
            } 

            const responseFromTool = await toolMap[toolToCall](parsedContent.input);

                messages.push({
                    role : "developer",
                    content : JSON.stringify({step : "OBSERVE" , content : responseFromTool})
                });

                continue;
        }

        if (parsedContent.step === 'OUTPUT') {
        console.log(`🤖`, parsedContent.content);
        break;
        }
           
    }



} 

main()