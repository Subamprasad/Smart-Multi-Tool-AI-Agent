import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
import fetch from 'node-fetch'; // Required for API requests

const History = [];
const ai = new GoogleGenAI({ apiKey: "AIzaSyC7OqFwaMbU-Ip0XLFtUHI4NDR2_k-MNNo" });

// ========== Core Tools ==========
function sum({ num1, num2 }) {
    return num1 + num2;
}

function prime({ num }) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++)
        if (num % i === 0) return false;
    return true;
}

async function getCryptoPrice({ coin }) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
    const data = await response.json();
    return data[0]?.current_price || "Price not found";
}

// ========== Extensions (Different Categories) ==========

// 1. News & Weather Extension
async function getWeather({ city }) {
    const response = await fetch(`https://wttr.in/${city}?format=3`);
    const text = await response.text();
    return text;
}

// 2. Security & Privacy Extension
function checkPasswordStrength({ password }) {
    const strong = password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    return strong ? "Strong Password" : "Weak Password";
}

// 3. Shopping & Deals Extension
async function getFakeDeals() {
    return ["50% off on shoes", "Buy 1 Get 1 Free T-shirt", "Smartphone under ₹10,000"];
}

// 4. Productivity & Study Tool
function pomodoroTimer({ session }) {
    return `Start your ${session}-minute Pomodoro session now!`;
}

// 5. Language & Translation
async function translateToHindi({ text }) {
    return `Translated to Hindi: "यह एक डेमो अनुवाद है" (Demo purpose only)`;
}

// 6. Chat & Communication
function generateGreeting({ name }) {
    return `Hello ${name}, how can I assist you today?`;
}

// 7. AI & Assistant Tools
function summarizeText({ paragraph }) {
    return "This is a brief summary of the paragraph. (demo summary)";
}

// 8. Video & Entertainment
function recommendMovie({ genre }) {
    return `Try watching 'Inception' if you like ${genre}`;
}

// 9. Developer Tools
function generateUUID() {
    return crypto.randomUUID();
}

// ========== Tool Declarations ==========
const sumDeclaration = {
    name: 'sum',
    description: "Get the sum of 2 numbers",
    parameters: {
        type: 'OBJECT',
        properties: {
            num1: { type: 'NUMBER', description: 'First number' },
            num2: { type: 'NUMBER', description: 'Second number' }
        },
        required: ['num1', 'num2']
    }
};

const primeDeclaration = {
    name: 'prime',
    description: "Check if a number is prime",
    parameters: {
        type: 'OBJECT',
        properties: {
            num: { type: 'NUMBER', description: 'Number to check' }
        },
        required: ['num']
    }
};

const cryptoDeclaration = {
    name: 'getCryptoPrice',
    description: "Get the current price of a cryptocurrency",
    parameters: {
        type: 'OBJECT',
        properties: {
            coin: { type: 'STRING', description: 'Name of the crypto (e.g. bitcoin)' }
        },
        required: ['coin']
    }
};

const weatherDeclaration = {
    name: 'getWeather',
    description: "Get the current weather of a city",
    parameters: {
        type: 'OBJECT',
        properties: {
            city: { type: 'STRING', description: 'City name like Delhi' }
        },
        required: ['city']
    }
};

const passwordDeclaration = {
    name: 'checkPasswordStrength',
    description: "Check the strength of a password",
    parameters: {
        type: 'OBJECT',
        properties: {
            password: { type: 'STRING', description: 'Password to check' }
        },
        required: ['password']
    }
};

const dealDeclaration = {
    name: 'getFakeDeals',
    description: "Get top trending online deals (simulated)",
    parameters: { type: 'OBJECT', properties: {}, required: [] }
};

const pomodoroDeclaration = {
    name: 'pomodoroTimer',
    description: "Start a Pomodoro timer session",
    parameters: {
        type: 'OBJECT',
        properties: {
            session: { type: 'NUMBER', description: 'Session time in minutes' }
        },
        required: ['session']
    }
};

const translateDeclaration = {
    name: 'translateToHindi',
    description: "Translate English text to Hindi",
    parameters: {
        type: 'OBJECT',
        properties: {
            text: { type: 'STRING', description: 'English text to translate' }
        },
        required: ['text']
    }
};

const greetingDeclaration = {
    name: 'generateGreeting',
    description: "Generate a greeting for a user",
    parameters: {
        type: 'OBJECT',
        properties: {
            name: { type: 'STRING', description: 'User name' }
        },
        required: ['name']
    }
};

const summarizeDeclaration = {
    name: 'summarizeText',
    description: "Summarize a paragraph",
    parameters: {
        type: 'OBJECT',
        properties: {
            paragraph: { type: 'STRING', description: 'Text to summarize' }
        },
        required: ['paragraph']
    }
};

const movieDeclaration = {
    name: 'recommendMovie',
    description: "Recommend a movie by genre",
    parameters: {
        type: 'OBJECT',
        properties: {
            genre: { type: 'STRING', description: 'Genre like action, comedy' }
        },
        required: ['genre']
    }
};

const uuidDeclaration = {
    name: 'generateUUID',
    description: "Generate a UUID for development use",
    parameters: { type: 'OBJECT', properties: {}, required: [] }
};

// ========== Tool Registry ==========
const availableTools = {
    sum,
    prime,
    getCryptoPrice,
    getWeather,
    checkPasswordStrength,
    getFakeDeals,
    pomodoroTimer,
    translateToHindi,
    generateGreeting,
    summarizeText,
    recommendMovie,
    generateUUID
};

// ========== AI Agent ==========
async function runAgent(userProblem) {
    History.push({ role: 'user', parts: [{ text: userProblem }] });

    while (true) {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: History,
            config: {
                systemInstruction: `You are a Smart AI Agent with access to multiple tools including Math, Crypto, Weather, Security, Deals, Productivity, Language Translation, Chat, Entertainment, and Developer tools.`,
                tools: [{
                    functionDeclarations: [
                        sumDeclaration,
                        primeDeclaration,
                        cryptoDeclaration,
                        weatherDeclaration,
                        passwordDeclaration,
                        dealDeclaration,
                        pomodoroDeclaration,
                        translateDeclaration,
                        greetingDeclaration,
                        summarizeDeclaration,
                        movieDeclaration,
                        uuidDeclaration
                    ]
                }],
            },
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            const { name, args } = response.functionCalls[0];
            const funCall = availableTools[name];
            const result = await funCall(args);

            const functionResponsePart = {
                name,
                response: { result },
            };

            History.push({
                role: "model",
                parts: [{ functionCall: response.functionCalls[0] }],
            });

            History.push({
                role: "user",
                parts: [{ functionResponse: functionResponsePart }],
            });
        } else {
            History.push({ role: 'model', parts: [{ text: response.text }] });
            console.log(response.text);
            break;
        }
    }
}

async function main() {
    const userProblem = readlineSync.question("Ask me anything--> ");
    await runAgent(userProblem);
    main();
}

main();
