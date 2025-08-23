// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import '@styles/index.scss';


// Use your @store alias
import { store } from '@store/index';

import App from './App';  // you can leave this relative since App.tsx sits alongside

const isStrictMode = false;

const root = createRoot(document.getElementById('root')!);
const appTree = (
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);

if (isStrictMode) {
	root.render(<StrictMode>{appTree}</StrictMode>);
} else {
	root.render(appTree);
}
