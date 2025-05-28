// // import logo from './logo.svg';
// import './App.css';
// import WeatherDisplay from './components/weatherDisplay';

// function App() {
//   return (
//     <div className="App">
//       {/* <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header> */}
//       <h1>Weather App</h1>
//       <p>input your city name to get the weather information </p><input name="cityName" />
//       <br/><button>Get Weather</button>
//       <WeatherDisplay city="surat" />
//     </div>
//   );
// }

// export default App;

import './App.css';
import WeatherDisplay from './components/weatherDisplay';
import { useState } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };
  
  const handleGetWeather = () => {
    if (city.trim()) {
      setSearchedCity(city);
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <input 
        name="cityName" 
        value={city} 
        onChange={handleInputChange} 
        placeholder="Enter city name"
      />
      <button onClick={handleGetWeather}>Get Weather</button>
      
      {searchedCity && <WeatherDisplay city={searchedCity} />}
    </div>
  );
}

export default App;
