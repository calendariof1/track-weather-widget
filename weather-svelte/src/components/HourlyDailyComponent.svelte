<script>
  export let weatherItem;
  export let getBRLNumbers;
  export let temp;
  export let showHour = false;

  let dateHour;

  $: if (showHour) {
    dateHour =  new Date(weatherItem.dt * 1000).toLocaleTimeString('pt-BR', {
      hour: 'numeric',
      minute: 'numeric',
    });
  } else {
    dateHour = new Date(weatherItem.dt * 1000).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
    });
  }
</script>

<div class="hourly-daily-section">
  <p class="date">
    {dateHour}
  </p>

  <p class="daily-temp align-center">{getBRLNumbers(temp)}º</p>

  <p class="text-label">
    {weatherItem.weather[0].description}
    <img
      src={`https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`}
      alt={`icone ${weatherItem.weather[0].description}`}
      height="32"
    />
  </p>
</div>

