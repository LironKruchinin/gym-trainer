import About from '../pages/About';
import Home from '../pages/Home';
import type { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
];

export default routes;
