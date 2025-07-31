import chefLogo from "./assets/Chef.png"

export default function Header() {
    return (
        <header>
            <img src={chefLogo} alt="CraveCraft Logo"/>
            <h1>CraveCraft</h1>
        </header>
    )
}