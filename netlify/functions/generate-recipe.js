/* eslint-disable no-undef */

import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. 

Format your response in markdown with the following rules:
1. DO NOT start with phrases like "Sure, I'd be happy to help!" or any similar introductory phrases
2. Start directly with the recipe title formatted as an H2 heading (# Recipe Title)
3. Then include an ingredients list and instructions section
`;

// Access your token directly here for local development
// In production, Netlify will use the environment variable
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: "Method Not Allowed" }) 
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const { ingredients } = body;
    
    if (!ingredients) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing ingredients parameter" })
      };
    }

    // Initialize the Hugging Face client
    const hf = new HfInference(HUGGINGFACE_TOKEN);

    // Call the Hugging Face API
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024,
    });

    // Return the generated recipe
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        recipe: response.choices[0].message.content 
      })
    };
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Failed to generate recipe", 
        error: error.message || "Unknown error" 
      })
    };
  }
};