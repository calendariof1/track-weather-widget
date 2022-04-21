import { useState, useEffect } from 'react';
import './App.css';

import {DailyComponent} from './DailyComponent';

import {LabeledText} from './LabeledText';

const tkid = '0e302008d450a0efe734fc51ba7292c3'// process.env.OPENWEATHER_API_KEY;

const getBRLNumbers = num => 
  Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 1 }).format(num);

const convertMsToKmh = (ms = 0) => ms * 3.6;

const ContentCollumn = ({num, children}) => (
  <div className={`col-${num}`}>
    {children}
  </div>
);

function App({coords}) {

  const [weather, setWeather] = useState({});

  async function getWeekWeather(coords) {
    const {lat, long} = coords;

    const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=${tkid}&units=metric&lang=pt_br`);
    const wheaterResult = await result.json();

    setWeather(wheaterResult);
  }

  useEffect(() => {
    getWeekWeather(coords);
  }, [coords]);

  return (
    <div className="track-weather">
      {
        weather.current && 
          <div className="row display-flex">
            <ContentCollumn num="1">
              <p className="temp">
                {getBRLNumbers(weather.current.temp)}º <br/>
              </p>
              <p class="temp-description">
                {weather.current.weather[0].description}
              </p>
            </ContentCollumn>

            <ContentCollumn num="2">
              <LabeledText label="Sensação térmica">
                {getBRLNumbers(weather.current.feels_like)}º
              </LabeledText>
              <LabeledText label="Humidade do Ar">
                {weather.current.humidity}%
              </LabeledText>
              <LabeledText label="Pressão Atmosférica">
                {weather.current.pressure}hPa
              </LabeledText>
            </ContentCollumn>

            <ContentCollumn num="3">
              <LabeledText label="Velocidade do Vento">
                {
                  getBRLNumbers(
                    convertMsToKmh(weather.current.wind_speed))  
                }km/h
              </LabeledText>
              <LabeledText label="Rajadas de Vento">
                {
                  getBRLNumbers(
                    convertMsToKmh(weather.current.wind_gust))
                }km/h
              </LabeledText>
              <LabeledText label="Direção do Vento">
                {weather.current.wind_deg}º
              </LabeledText>
            </ContentCollumn>
          </div>
      }

      <div className="display-flex row daily-temps">
        {
          weather.daily && weather.daily.filter((_, i) => i < 3).map(daily => 
            <DailyComponent dailyWeather={daily} getBRLNumbers={getBRLNumbers}>
            </DailyComponent>)
        }
      </div>
    </div>
  );
}

export default App;
