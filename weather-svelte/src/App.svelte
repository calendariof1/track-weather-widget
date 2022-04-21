<script>
  import "./index.css";

  import ContentCollumn from "./components/ContentCollumn.svelte";
  import DailyComponent from "./components/DailyComponent.svelte";
  import LabeledText from "./components/LabeledText.svelte";
import { loop_guard } from "svelte/internal";

  const tkid = import.meta.env.VITE_TKID;

  const getBRLNumbers = (num) =>
    Intl.NumberFormat("pt-BR", {
      maximumSignificantDigits: 1,
    }).format(num);

  const convertMsToKmh = (ms = 0) => ms * 3.6;

  const extractEvent = () => Array.from(document.scripts)
    .filter((script) => script.type === "application/ld+json")
    .map((script) => JSON.parse(script.textContent));

  const getEventDates = () => extractEvent().map((event) => ({
      startDateTimestamp: +new Date(event.startDate),
      endDateTimestamp: +new Date(`${event.endDate}T18:59:59`),
    })).pop();

  const getLatLongFromPage = () => {
    const Event = extractEvent().filter((script) => script["@type"] === "BroadcastEvent").pop();
 
    const loc = Event.broadcastOfEvent.location.filter(location => location['@type'] === 'Place').pop();
    
    return loc.geo;
  }

  const fetchWeather = () => {
    const {latitude, longitude} = getLatLongFromPage();

    return fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${tkid}&units=metric&lang=pt_br`
    ).then((response) => response.json());
  }

  const {startDateTimestamp, endDateTimestamp} = getEventDates();
</script>

<div class="track-weather">
  {#await fetchWeather()}
    Carregando...
  {:then weather}
    {#if weather.current}
      <div class="row display-flex">
        <ContentCollumn num="1">
          <p class="temp">
            {getBRLNumbers(weather.current.temp)}º <br />
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
            {getBRLNumbers(convertMsToKmh(weather.current.wind_speed))}km/h
          </LabeledText>
          <LabeledText label="Rajadas de Vento">
            {getBRLNumbers(convertMsToKmh(weather.current.wind_gust))}km/h
          </LabeledText>
          <LabeledText label="Direção do Vento">
            {weather.current.wind_deg}º
          </LabeledText>
        </ContentCollumn>
      </div>
      <h4>Previsão para os próximos dias</h4>
      <div class="display-flex row daily-temps">
        {#each weather.daily.filter(({dt}, i) =>
          (dt * 1000 >= startDateTimestamp && dt * 1000 <= endDateTimestamp && i < 4)) as daily}
          <DailyComponent dailyWeather={daily} {getBRLNumbers} />
        {/each}
      </div>
    {/if}
  {/await}
</div>
