import { Link } from "react-router-dom";

function Header() {
    return(
        <>
        <div className="page">
        <h2 className="logo">React App</h2>
            <ul className="nav-links">
                <Link to={'/signup'}>SignUp</Link>
                <Link to={'/signin'}>SignIn</Link>
            </ul>
        </div>
        </>
    )    
}

export default Header;