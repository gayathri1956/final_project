exports.getWeather = async (req, res) => {
  try {
    const { location } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    // If API key is available, use OpenWeatherMap
    if (apiKey && location) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
        );
        if (response.ok) {
          const data = await response.json();
          return res.json({
            success: true,
            isLive: true,
            weather: {
              location: data.name,
              temperature: data.main.temp,
              humidity: data.main.humidity,
              description: data.weather[0]?.description || 'N/A',
              icon: data.weather[0]?.icon || '',
              windSpeed: data.wind.speed,
              rainfall: data.rain?.['1h'] || 0,
              feelsLike: data.main.feels_like,
              pressure: data.main.pressure,
            },
          });
        }
      } catch (apiError) {
        // Fall through to simulated data
      }
    }

    // Simulated weather data (fallback)
    const simulated = {
      location: location || 'Sample Location',
      temperature: Math.round(25 + Math.random() * 10),
      humidity: Math.round(50 + Math.random() * 30),
      description: ['Clear sky', 'Partly cloudy', 'Light rain', 'Sunny'][Math.floor(Math.random() * 4)],
      icon: '02d',
      windSpeed: Math.round(5 + Math.random() * 10),
      rainfall: Math.round(Math.random() * 20),
      feelsLike: Math.round(26 + Math.random() * 8),
      pressure: 1013,
    };

    // Generate farming alerts
    const alerts = [];
    if (simulated.temperature > 38) alerts.push({ type: 'warning', message: 'Extreme heat — ensure adequate crop watering' });
    if (simulated.humidity > 85) alerts.push({ type: 'warning', message: 'High humidity — monitor for fungal diseases' });
    if (simulated.rainfall > 50) alerts.push({ type: 'warning', message: 'Heavy rainfall expected — check drainage' });
    if (simulated.temperature < 10) alerts.push({ type: 'warning', message: 'Low temperature — frost risk for sensitive crops' });
    if (alerts.length === 0) alerts.push({ type: 'info', message: 'Weather conditions are normal for farming activities' });

    res.json({
      success: true,
      isLive: false,
      weather: simulated,
      alerts,
      note: 'Simulated data. Add WEATHER_API_KEY in .env for live weather from OpenWeatherMap.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Weather fetch failed.' });
  }
};
