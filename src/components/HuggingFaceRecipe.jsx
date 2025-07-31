import ReactMarkdown from "react-markdown"

export default function HuggingFaceRecipe(props) {
    return (
        <section className="suggested-recipe-container">
            <h1>CraveCraft Has Suggested:</h1>
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </section>
    )
}