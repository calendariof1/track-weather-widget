import { mount } from 'svelte'

import App from './App.svelte'
import AppMinute from './minute-minute.svelte';

const app = mount(App, {
  target: document.getElementById('weather-widget')
});

const app2 = mount(AppMinute, {
  target: document.getElementById('minute-a-minute')
});
