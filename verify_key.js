import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

// Manually fetch because SDK doesn't have easy listModels
async function checkKey() {
    const key = process.env.VITE_API_KEY;
    console.log("Checking key:", key ? key.substring(0, 5) + "..." : "No key found");

    if (!key) return;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("Success! Available models:");
            if (data.models) {
                console.log(data.models.map(m => m.name).filter(n => n.includes('gemini')));
            } else {
                console.log("No models returned?", data);
            }
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

checkKey();
