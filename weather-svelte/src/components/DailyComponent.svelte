<script> 
  export let dailyWeather; 
  export let getBRLNumbers;
</script>

<div class="daily-section">
  <p class="date">
    {
      new Date(dailyWeather.dt * 1000).toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
      })
    }
  </p>
  
  <p class="daily-temp">{getBRLNumbers(dailyWeather.temp.day)}º</p>

  <p class="text-label">
    {dailyWeather.weather[0].description}
  </p>
</div>
