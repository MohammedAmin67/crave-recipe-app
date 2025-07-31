import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page. 

IMPORTANT: Do not include any introductory text like "Here's a recipe" or "I'd be happy to help". Start directly with the recipe title as a markdown heading.
`

// Creating the HuggingFace inference instance API token
const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN)

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Give me a recipe I could make.` },
            ],
            max_tokens: 1024,
        })
        
        let content = response.choices[0].message.content
        
        // Removing common introductory phrases
        content = content.replace(/^(Sure!|Sure,|Of course!|Of course,|I'd be happy to help!|I'd be happy to help,|Here's|Here is|Based on your ingredients)[^]*?recipe[^]*?(that you could try:|you could make:|you might enjoy:|for you:)/i, '')
        
        // Trimming any leading whitespaces
        content = content.trim()
        
        return content
    } catch (err) {
        console.error("Error calling HuggingFace API:", err)
        return "Sorry, I couldn't generate a recipe at this time. Error: " + err.message
    }
}