import { LabeledText } from './LabeledText';

export const DailyComponent = ({ dailyWeather, getBRLNumbers }) => (<div>
  <p className="daily-temp">{getBRLNumbers(dailyWeather.temp.day)}º</p>

  <p className="date">
    <LabeledText label={
      dailyWeather.weather[0].description
    }>
    </LabeledText>

    {(new Date(dailyWeather.dt * 1000).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
    }))}
  </p>
</div>)
