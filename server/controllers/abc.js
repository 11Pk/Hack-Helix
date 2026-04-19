// load environment variables
require('dotenv').config();

async function getWeather(lat, lon) {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing. Check your .env file.");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      location: data.name,
      temperature: data.main.temp,
      weather: data.weather[0].description,
      humidity: data.main.humidity
    };

  } catch (error) {
    console.error("Error fetching weather:", error.message);
    return null;
  }
}
// example usage
getWeather(30.3398, 76.3869).then(console.log);