<script>
  import "./index.css";

  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";

  import { WeatherService, ExtractEvents, timestampForhumans } from "./services";

  import LabeledText from "./components/LabeledText.svelte";
  import ContentCollumn from "./components/ContentCollumn.svelte";
  import HourlyDailyComponent from './components/HourlyDailyComponent.svelte';

  const tkid = import.meta.env.VITE_TKID;
  const weather = writable(null);
  const minutely = writable([]);

  const weatherService = WeatherService(tkid);

  const locale =  navigator.language || 'pt-BR';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const convertMsToKmh = (ms = 0) => ms * 3.6;

  const getBRLNumbers = (num) =>
    Intl.NumberFormat(locale, {
      maximumSignificantDigits: 3,
    }).format(num);

  const formatMinutes = (minutes) =>
    Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).format(new Date(minutes * 1000));

  const extractEvent = ExtractEvents();

  const fetchWeather = () =>
    weatherService.getWeather(
      weatherService.getLatLongFromPage(extractEvent)
  );

  const filterTz = (evt) => evt.scheduleTimezone === timezone;

  const getEventDates = () =>
    extractEvent
      .map((event) => {
        const StartEndEventstimestamps =
          event.broadcastOfEvent.eventSchedule.filter(filterTz).map((evt) => ({
            startDateTimestamp: +new Date(`${evt.startDate}T${evt.startTime}`),
            endDateTimestamp: +new Date(`${evt.endDate}T${evt.endTime}`),
          }));

        const filteredEventsByStart = StartEndEventstimestamps.filter(
          ({ startDateTimestamp, endDateTimestamp }) => {
            const now = Date.now() + (timestampForhumans.minute * 30);
            return now >= startDateTimestamp &&
              now <= (endDateTimestamp * timestampForhumans.second) + (2 * timestampForhumans.hour);
          }
        );


        return filteredEventsByStart.pop();
      }).pop();

  const eventDates = getEventDates();

  const filterDates = ({ dt }) => {
    const { startDateTimestamp, endDateTimestamp } = eventDates;

    const wheaterTimestamp = dt * timestampForhumans.second;
    const plusSecondTime = wheaterTimestamp + (timestampForhumans.second * 10);
    const result =
      wheaterTimestamp >= startDateTimestamp && plusSecondTime <= endDateTimestamp;
    return result;
  };

  const getWeather = async () => {
    $weather = await fetchWeather();
    if ($weather.minutely) {
      $minutely = $weather.minutely.filter(filterDates);
    }
  };

  eventDates && getWeather();

  setInterval(() => {
    const leftMinutes = !$weather.minutely ? [] : $weather.minutely.filter(
        (min) => filterDates(min) && min.dt * timestampForhumans.second >= Date.now()
      );

    $minutely = [
      ...leftMinutes,
    ];
  }, 40000);
</script>

{#if eventDates}
  <div class="minute-minute-widget">
    {#if !$weather}
      Carregando...
    {:else}
      <div class="hour">
        {#each $weather.hourly.filter(filterDates) as hour}
          <div class="track-weather display-flex row align-center">
            <HourlyDailyComponent showHour={true} temp={hour.temp} weatherItem={hour} getBRLNumbers={getBRLNumbers} />
          </div>
        {/each}
      </div>

      {#if $minutely}
        <div class="minutes">
          {#each $minutely.filter((_, i) => i < 5) as minute}
            <p transition:fade class="align-center">
              <span class="time">{formatMinutes(minute.dt)}</span>
              <br />
              <span class="precipitation"
                >{getBRLNumbers(minute.precipitation)}mm</span
              >
            </p>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
{:else}
  <div class="minute-minute-widget">
    <p>Não há eventos no momento</p>
  </div>
{/if}
