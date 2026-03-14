import { startTransition, useCallback, useEffect, useState } from 'react'
import './App.css'
import {Constants} from "../constants";
import {WebsiteParse} from "../data/website-parse";
import "../typedef";
import CurrentMinMaxContainer from './components/CurrentMinMaxContainer';
import { DateTime } from 'luxon';
import InstallPWA from './components/InstallPWA';

function App() {
  const [loading, setLoading] = useState(false);
  const [isWhiteTheme, setIsWhiteTheme] = useState(
    localStorage.getItem('is-white-theme') === 'true' || !window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [/** @type {WeatherData} */ weather, setWeather] = useState(null);

  const updateData = useCallback(() => {
    startTransition(() => setLoading(true));
    fetch(Constants.amsUrl)
      .then(response => response.arrayBuffer())
      .then(data => setWeather(WebsiteParse.parse(data)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [updateData]);
  
  useEffect(() => {
    const listener = () => {
      if (!document.hidden && (!weather || Date.now() - weather?.updateDate >= 1000 * 60 * 30)) {
        updateData();
      }
    };
    
    document.addEventListener("visibilitychange", listener);

    return () => {
      document.removeEventListener("visibilitychange", listener);
    }
  }, [weather, updateData]);

  function updateTheme() {
      setIsWhiteTheme(prev => {
        const newValue = !prev;
        localStorage.setItem('is-white-theme', newValue ? "true" : "false");
        return newValue;
      });
  }

  function renderTemp(dataPoint) {
    return `${dataPoint}${Constants.metadata.units.temperature.displayText}`
  }

  function renderHumidity(dataPoint) {
    return `${dataPoint}${Constants.metadata.units.humidity.displayText}`
  }

  function renderPressure(dataPoint) {
    return `${dataPoint}${Constants.metadata.units.pressure.displayText}`
  }

  function renderWind(dataPoint) {
    return `${dataPoint} ${Constants.metadata.units.windSpeed.displayText}`
  }

  const dataAvailable = weather !== null;
  const isDataFresh = Date.now() - weather?.updateDate < 1000 * 60 * 30;

  return (
    <div className={`app-container ${isWhiteTheme ? 'white-theme' : ''}`}>
      <div className='theme-switcher' onClick={updateTheme}>{isWhiteTheme ? '⚫' : '⚪'}</div>
      <div className='center-container'>
        {dataAvailable && <>
            <p style={{marginTop: "1.5em", marginBottom: "1.5em", color: isDataFresh ? '' : 'red'}}>
              {loading ? "Зареждане..." : `измервания от ${DateTime.fromMillis(weather.updateDate).toFormat('yyyy-MM-dd HH:mm:ss')}`}
            </p>

            <div className={`data-points center-container ${!isDataFresh || loading ? 'old' : ''}`}>
            <CurrentMinMaxContainer
              emoji={"🌡️"}
              current={renderTemp(weather.current.temperature)}
              minValue={renderTemp(weather.dailyMinimums.temperature.value)}
              minDate={weather.dailyMinimums.temperature.date}
              maxValue={renderTemp(weather.dailyMaximums.temperature.value)}
              maxDate={weather.dailyMaximums.temperature.date}
            />

            <CurrentMinMaxContainer
              emoji={"💧"}
              current={renderHumidity(weather.current.humidity)}
              minValue={renderHumidity(weather.dailyMinimums.humidity.value)}
              minDate={weather.dailyMinimums.humidity.date}
              maxValue={renderHumidity(weather.dailyMaximums.humidity.value)}
              maxDate={weather.dailyMaximums.humidity.date}
            />

            <CurrentMinMaxContainer
              emoji="🌬️"
              small
              current={renderWind(weather.current.wind.speed)}
              maxValue={renderWind(weather.dailyMaximums.wind.value)}
              maxDate={0}
              minDate={0}
            />

            <CurrentMinMaxContainer
              emoji={weather.current.pressure.trend === 'falling' ? "📉" : "📈"}
              small
              current={renderPressure(weather.current.pressure.value)}
              minValue={renderPressure(weather.dailyMinimums.pressure.value)}
              minDate={weather.dailyMinimums.pressure.date}
              maxValue={renderPressure(weather.dailyMaximums.pressure.value)}
              maxDate={weather.dailyMaximums.pressure.date}
            />
            </div>
        </>}

        <p>данни от <a href="http://46.35.176.12">АМС Велико Търново</a></p>
        <InstallPWA />
      </div>
    </div>
  )
}

export default App
