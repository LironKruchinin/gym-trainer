import { Link } from 'react-router-dom';

export function Header() {
    return (
        <header className="container">
            <nav>
                <Link to="/">Home</Link> | <Link to="/about">About</Link>
            </nav>
        </header>
    );
}
