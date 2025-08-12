import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from 'js-tiktoken/ranks/o200k_base';


const enc = new Tiktoken(o200k_base);

const userQuery = "My Name is Harsh Langeh";
const tokens = enc.encode(userQuery);

console.log({tokens});


const inputTokens = [5444, 7317, 382, 7591, 1116, 100260, 71]
const decoded = enc.decode(inputTokens)
console.log({decoded})

const inputToken2 = [6355, 3535, 35345, 5335]
const result2 = enc.decode(inputToken2)
console.log("result2 :", {result2})


const inputToken3 = [1, 2, 3, 5, 6, 7, 8, 9, 10, 100, 1000, 2000, 5000, 10000]
const result3 = enc.decode(inputToken3)
console.log({result3})

const inputToken4 = [71, 5444]
const result4 = enc.decode(inputToken4)
console.log({result4})