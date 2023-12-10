import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import App2 from './App-v2'
// import StarRating from './StarRating';

// function Test() {
//   const [ movieRating, setMovieRating ] = useState(0);
//   return (<div>
//     <StarRating color='blue' maxRating={10} onSetRating={setMovieRating}/>
//     <p>This movie was rated {movieRating} stars</p>
//   </div>)
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    // <App />
    <App2 />
    // <StarRating maxRating={5} message={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}/>
    // <StarRating size={24} maxRating={10} color="red" className="test" defaultRating={3}/>
    // <Test/>
  // </React.StrictMode>
);
