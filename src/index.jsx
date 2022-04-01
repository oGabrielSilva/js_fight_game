import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from './screens/Game';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<Game />);

// ReactDOM.render(
//   <React.StrictMode>
//     <Game />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
