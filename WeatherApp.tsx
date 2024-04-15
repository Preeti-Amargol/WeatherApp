import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface City {
  name: string;
  country: string;
  population: number;
}

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
}

const App: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=10&facet=country'
        );
        setCities(response.data.records.map((record: any) => ({
          name: record.fields.name,
          country: record.fields.country,
          population: record.fields.population,
        })));
      } catch (error) {
        setError('Error fetching data');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCityClick = async (cityName: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=92e9249ae646fe8c1b77a28eb04dbf1c&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      setError('Error fetching weather data');
    }
  };

  return (
    <div>
      <h1>Weather Forecast App</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        <h2>Cities</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Country</th>
              <th>Population</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city.name} onClick={() => handleCityClick(city.name)}>
                <td>{city.name}</td>
                <td>{city.country}</td>
                <td>{city.population}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {weatherData && (
        <div>
          <h2>Weather Details for {selectedCity}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>Pressure: {weatherData.main.pressure} hPa</p>
        </div>
      )}
    </div>
  );
};

export default App;
