export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    
    try {
        const response = await fetch('/.netlify/functions/generate-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients: ingredientsString }),
        })
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to generate recipe')
        }
        
        const data = await response.json()
        return data.recipe
    } catch (err) {
        console.error("Error calling recipe API:", err)
        return "Sorry, I couldn't generate a recipe at this time. Error: " + err.message
    }
}