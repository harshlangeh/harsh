import { output } from "./script";
async function getData (){
    const button = document.getElementById('button');
    const input = document.getElementById('input');
    button.addEventListener("click", function(){
    console.log(input.value)
    })


    const outputData = document.getElementById('output')
    outputData.textContent = output.choices[0].message.content

    console.log(input)
    return input

}


getData()