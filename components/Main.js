import React, { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
// import clear from "../public/clear.png"
// import night from "../public/night.png"
// import cloudy from "../public/cloudy.png"
// import drizzle from "../public/drizzle.png"
// import rain from "../public/rain.png"
// import thunder from "../public/thunder.png"
// import snow from "../public/snow.png"

const Main = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  const allIcons = {
    "01d": "/clear.png",
    "01n": "/night.png",
    "02d": "/cloudy.png",
    "02n": "/night.png",
    "03d": "/cloudy.png",
    "03n": "/night.png",
    "04d": "/cloudy.png",
    "04n": "/night.png",
    "09d": "/drizzle.png",
    "09n": "/drizzle.png",
    "10d": "/rain.png",
    "10n": "/rain.png",
    "11d": "/thunder.png",
    "11n": "/thunder.png",
    "13d": "/snow.png",
    "13n": "/snow.png",
    "50d": "/mist.png",
    "50n": "/mist.png",
  };

  const convertTemperature = (temp) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter city");
      return;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_APP_ID;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Weather Data:", data);

      const { lon, lat } = data.coord;
      const icon = allIcons[data.weather[0].icon] || "/clear.png";

      // Fetch 5-day forecast data
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      const forecastData = await forecastResponse.json();

      const lastFiveDays = forecastData.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map((day) => ({
          date: new Date(day.dt * 1000).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          temperature: Math.floor(day.main.temp),
          desc: day.weather[0].main,
          icon: allIcons[day.weather[0].icon] || "/clear.png",
        }));

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: Math.floor(data.wind.speed),
        temperature: Math.floor(data.main.temp),
        high: Math.floor(data.main.temp_max),
        low: Math.floor(data.main.temp_min),
        location: data.name,
        desc: data.weather[0].main,
        icon: icon,
        time: new Date(data.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: new Date(data.dt * 1000).toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        lastFiveDays: lastFiveDays,
      });
    } catch (error) {
      console.error("Error fetching the weather data:", error);
      alert("Invalid city name. Please try again.");
    }
  };

  useEffect(() => {
    search("");
  }, []);

  return (
    <div className="bg-gradient-to-r from-customDark to-customLight h-screen">
      <div className="relative w-full flex justify-center items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="px-1 py-2 mt-4 rounded-3xl w-4/12 bg-black bg-opacity-55 text-white pl-5"
        />
        <FaSearch
          className="absolute top-1/2 left-2/3 transform -translate-x-10 text-white cursor-pointer"
          onClick={() => search(inputRef.current.value)}
        />
        <button
          onClick={() => setIsCelsius(!isCelsius)}
          className="absolute top-4 left-3/4 transform -translate-x-20 bg-black bg-opacity-55 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
        >
          {isCelsius ? "°F" : "°C"}
        </button>
      </div>

      <div className="flex justify-center items-center mt-11 ">
        <div className="w-96 h-52 p-4 bg-black bg-opacity-55 rounded-2xl text-white text-center">
          <h2 className="text-3xl font-semibold mt-6">
            {weatherData.location || "Loading..."}
          </h2>
          <p className="text-4xl mt-6">{weatherData.time || ""}</p>
          <p className="text-lg">{weatherData.date || ""}</p>
        </div>

        {weatherData ? (
          <>
            <div className="w-[450px] h-52 ml-9 p-2 bg-black bg-opacity-55 rounded-2xl text-white text-left">
              <h2 className="text-3xl font-semibold ml-2">
              {convertTemperature(weatherData.temperature)}°{isCelsius ? "C" : "F"}
              </h2>
              <div className="flex">
                <img
                  src="high.png"
                  alt="Weather icon"
                  className="w-12 h-12 mt-4"
                />
                <p className="mt-4"> Max: {convertTemperature(weatherData.high)}°{isCelsius ? "C" : "F"}</p>
                <img
                  src={weatherData.icon}
                  alt="Weather icon"
                  className="w-24 h-24 ml-14 "
                />
                <img
                  src="humidity.png"
                  alt="Weather icon"
                  className="w-12 h-12 mt-4 ml-16"
                />
                <p className="mt-4 ml-2">{weatherData.humidity}% Humidity</p>
              </div>
              <div className="flex">
                <img src="low.png" alt="Weather icon" className="w-12 h-12 " />
                <p className="mt-0">Min: {convertTemperature(weatherData.low)}°{isCelsius ? "C" : "F"}</p>
                <h3 className="text-center mt-2 ml-16 text-2xl">
                  {weatherData.desc}
                </h3>
                <img
                  src="wind.png"
                  alt="Weather icon"
                  className="w-12 h-12 ml-20"
                />
                <p className=" ml-2">{weatherData.windSpeed} km/h Wind </p>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="flex justify-center items-center">
        <div className="w-7/12 mt-8 h-auto p-4 bg-black bg-opacity-55 rounded-2xl text-white text-center">
          <h2 className="text-3xl font-semibold">5 Days Weather :</h2>

          {weatherData.lastFiveDays &&
            weatherData.lastFiveDays.map((day, index) => (
              <div
                key={index}
                className="flex justify-between items-center mt-2"
              >
                <img
                  src={day.icon}
                  alt="Weather icon"
                  className="w-10 h-10 ml-10 "
                />
                <h3 className="text-center mt-2 text-2xl ">{day.desc}</h3>
                <h2 className="text-xl font-semibold"> {convertTemperature(day.temperature)}°{isCelsius ? "C" : "F"}</h2>
                <p className="text-lg mr-10">{day.date}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
