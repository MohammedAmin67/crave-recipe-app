import React from "react"
import IngredientsList from "./components/IngredientsList"
import { getRecipeFromMistral } from "./ai"  
import HuggingFaceRecipe from "./components/HuggingFaceRecipe"

export default function App() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    async function getRecipe() {
        setIsLoading(true)
        setError(null)
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients)
            setRecipe(recipeMarkdown)
        } catch (err) {
            console.error("Error in getRecipe:", err)
            setError("Failed to get recipe. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        if (newIngredient && newIngredient.trim()) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient.trim()])
        }
        // Reset the form
        document.querySelector(".add-ingredient-form").reset()
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="Add your ingredients here..."
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    isLoading={isLoading}
                />
            }

            {isLoading && <p className="loading">Generating your recipe</p>}
            {error && <p className="error">{error}</p>}
            {recipe && !isLoading && <HuggingFaceRecipe recipe={recipe} />}
        </main>
    )
}