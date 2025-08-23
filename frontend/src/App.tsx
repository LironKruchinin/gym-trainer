// src/App.tsx
import { useRoutes } from 'react-router-dom';

// Use your @routes alias
import routes from '@routes/routes';

// Use your @components alias pointing at the layout folder
import { Footer } from '@components/layout/Footer';
import { Header } from '@components/layout/Header';


export const API_URL = import.meta.env.VITE_API_URL

export default function App() {
	const element = useRoutes(routes);

	return (
		<>
			<Header />
			<main style={{ flex: 1 }}>
				{element}
			</main>
			<Footer />
		</>
	);
}
