import About from '../pages/About';
import Home from '../pages/Home';
import ProgramManagement from '../pages/ProgramManagement';
import TraineeScreens from '../pages/TraineeScreens';
import AutoMode from '../pages/AutoMode';
import TrainingWindow from '../pages/TrainingWindow';
import type { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/programs', element: <ProgramManagement /> },
    { path: '/trainees', element: <TraineeScreens /> },
    { path: '/auto-mode', element: <AutoMode /> },
    { path: '/training', element: <TrainingWindow /> },
];

export default routes;
