export const WeatherService = (tkid) => ({
  getLatLongFromPage: (Event) => {
    const event = Event.filter((script) => script["@type"] === "BroadcastEvent").pop();
    const loc = event.broadcastOfEvent.location.filter(location => location['@type'] === 'Place').pop();
    return loc.geo;
  },
  getWeather: ({ latitude, longitude }) => fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${tkid}&units=metric&lang=pt_br`, {
    cache: 'default'
  }).then(async (response) => {
    const res = await response.json();
    console.log(res);
    return res;
  })
})

export const ExtractEvents = () => Array.from(document.scripts)
  .filter(script => script.type === "application/ld+json")
  .map(script => JSON.parse(script.textContent))
  .filter(json => json["@type"] === "BroadcastEvent");


export const timestampForhumans = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2592000000,
}
