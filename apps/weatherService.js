export async function fetchWeather() {
  const lat = 51.41;
  const lon = 19.70;

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Europe/Warsaw`
  );

  const data = await res.json();

  return {
    temp: data.current_weather.temperature,
    wind: data.current_weather.windspeed,
    time: data.current_weather.time
  };
}
