import React, { useState, useEffect } from 'react';
import '../App.css'; 
import Navbar from './nav';

const Weather = () => {
  const [location, setLocation] = useState('Dhaka');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [hourlyOpen, setHourlyOpen] = useState(Array(5).fill(false)); 
  const [currentLocation, setCurrentLocation] = useState('');

  useEffect(() => {
    fetchWeatherData(location);
  }, [location]);

  const fetchWeatherData = async (location) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=e344eed6e79d4ffdbdc120717241510&q=${location}&days=5`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateWeatherLocation = () => {

    if(currentLocation)
    {
        let updatedLocation = currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1);
        setLocation(updatedLocation);
        fetchWeatherData(updatedLocation);
    }

  }

  const toggleHourlyForecast = (index) => {
    const updatedHourlyOpen = [...hourlyOpen];
    updatedHourlyOpen[index] = !updatedHourlyOpen[index];
    setHourlyOpen(updatedHourlyOpen);
  };

  return (
    <>
    <Navbar data = {weatherData} />
    <div className='search-button'>

    <input  type='text'
     placeholder='Enter your city for a weather update'
     onChange={(e) => setCurrentLocation(e.target.value)}
     />
     <button onClick={updateWeatherLocation}>Check Weather</button>
     </div>
    <div className="weather-container">
        
      {error && <p>Error: {error}</p>}
      {weatherData ? (
      <>
          <div className="current-weather">
            <h2>Current Weather in {location}</h2>
            <div className="weather-info">
              <img
                src={weatherData.current.condition.icon}
                alt={weatherData.current.condition.text}
                />
              <p>{weatherData.current.temp_c}°C</p>
              <p>{weatherData.current.condition.text}</p>
              <p>Humidity: {weatherData.current.humidity}%</p>
              <p>Wind: {weatherData.current.wind_kph} kph</p>
            </div>
          </div>

          <div className="forecast-container">
            <h3>5-Day Forecast</h3>
            <div className="forecast-cards">
              {weatherData.forecast.forecastday.map((day, index) => (
                <div className="forecast-card" key={index}>
                  <h4>
                    {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                    })}
                  </h4>
                  <img src={day.day.condition.icon} alt={day.day.condition.text} />
                  <p>
                    {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C
                  </p>
                  <p>{day.day.condition.text}</p>
                  <button onClick={() => toggleHourlyForecast(index)}>
                    {hourlyOpen[index] ? 'Hide Hourly' : 'Show Hourly'}
                  </button>

                  {hourlyOpen[index] && (
                      <div className="hourly-forecast">
                      {day.hour.map((hour, hourIndex) => (
                          <div key={hourIndex} className="hourly-data">
                          <p>
                            {new Date(hour.time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p>{hour.temp_c}°C</p>
                          <img src={hour.condition.icon} alt={hour.condition.text} />
                          <p>{hour.wind_kph} kph</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
    )}
    </div>
    </>
  );
};

export default Weather;
