<script>
  import "./index.css";

  import {WeatherService, ExtractEvents} from './services';

  import ContentCollumn from "./components/ContentCollumn.svelte";
  import HourlyDailyComponent from "./components/HourlyDailyComponent.svelte";
  import LabeledText from "./components/LabeledText.svelte";

  const tkid = import.meta.env.VITE_TKID;

  const weatherService = WeatherService(tkid);

  const getBRLNumbers = (num) =>
    Intl.NumberFormat("pt-BR", {
      maximumSignificantDigits: 1,
    }).format(num);

  const convertMsToKmh = (ms = 0) => ms * 3.6;

  const extractEvent = ExtractEvents();

  const getEventDates = () => extractEvent.map((event) => ({
      startDateTimestamp: +new Date(`${event.startDate}T00:00:00`),
      endDateTimestamp: +new Date(`${event.endDate}T18:59:59`),
    })).pop();

  const fetchWeather = () => weatherService.getWeather(
    weatherService.getLatLongFromPage(extractEvent)
  );

  const {startDateTimestamp, endDateTimestamp} = getEventDates();

  const filterDates = ({dt}, i) =>
    (dt * 1000 >= startDateTimestamp && dt * 1000 <= endDateTimestamp && i < 8);

  const checkForZeroValues = (val) => typeof val === 'number' && val === 0 ? '0' : val;

  const emptyText = (text, cb) => !text ? '' : cb(text);

</script>

<div class="track-weather">
  {#await fetchWeather()}
    <div class="row display-flex">
      <ContentCollumn num="1">
        <p class="temp" class:shimmer={true} ></p>
        <p class="temp-description" class:shimmer={true} ></p>
      </ContentCollumn>

      <ContentCollumn num="2">
        <LabeledText label="Sensação térmica" text={""} ></LabeledText>
        <LabeledText label="Humidade do Ar" text="" ></LabeledText>
        <LabeledText label="Pressão Atmosférica" text="" ></LabeledText>
      </ContentCollumn>

      <ContentCollumn num="3">
        <LabeledText label="Velocidade do Vento" text=""></LabeledText>
        <LabeledText label="Rajadas de Vento" text="" ></LabeledText>
        <LabeledText label="Direção do Vento" text="" ></LabeledText>
      </ContentCollumn>
    </div>
  {:then weather}

    <div class="row display-flex">
      <ContentCollumn num="1">
        <p class="temp" class:shimme={!weather.current.temp}>
          {getBRLNumbers(weather.current?.temp)}º <br />
        </p>
        <p class="temp-description">
          {weather.current.weather[0]?.description}
        </p>
      </ContentCollumn>

      <ContentCollumn num="2">
        <LabeledText label="Sensação térmica" text={
          `${emptyText(weather.current?.feels_like, getBRLNumbers)}º`
        }/>
        <LabeledText label="Humidade do Ar" text={emptyText(weather.current?.humidity, (t) => `${t}%`)}/>
        <LabeledText label="Pressão Atmosférica" text={
          emptyText(weather.current?.pressure, (t) => `${t}hPa`)
        } />
        <LabeledText label="Nuvens" text={
          emptyText(weather.current?.clouds, (t) => `${t}%`)
        }/>
      </ContentCollumn>

      <ContentCollumn num="3">
        <LabeledText label="Velocidade do Vento" text={
          emptyText(weather.current?.wind_speed, (t) => `${getBRLNumbers(convertMsToKmh(t))}km/h`)
        }/>
        {#if weather.current?.wind_gust}
          <LabeledText label="Rajadas de Vento" text={
            emptyText(weather.current?.wind_gust, (t) => `${getBRLNumbers(convertMsToKmh(t))}km/h`)
          }/>
        {/if}

        <LabeledText label="Direção do Vento" text={
          emptyText(checkForZeroValues(weather.current?.wind_deg),
            (t) => `${t}º`
          )
        }/>
      </ContentCollumn>
    </div>
    {#if weather?.daily.filter(filterDates).length}
      <h4>Previsão para os próximos dias</h4>
      <div class="display-flex row daily-temps">
        {#each weather.daily.filter(filterDates) as daily}
          <HourlyDailyComponent temp={daily.temp.day} weatherItem={daily} {getBRLNumbers}></HourlyDailyComponent>
        {/each}
      </div>
    {/if}
  {/await}
</div>
