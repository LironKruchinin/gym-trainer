import { Link } from 'react-router-dom';

export function Header() {
    return (
        <header className="header">
            <div className="container header__content">
                <div className="header__brand">
                    <Link to="/">Gym Trainer</Link>
                </div>
                <nav className="header__nav">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </nav>
            </div>
        </header>
    );
}
