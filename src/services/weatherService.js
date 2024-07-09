import { DateTime } from 'luxon'
const  API_KEY =String(import.meta.env.VITE_APP_API)
// console.log(String(import.meta.env.VITE_APP_API))

const BASE_URL = 'https://api.openweathermap.org/data/2.5/'

const getWeatherData = (infotype, searchParams) => {
  const url = new URL(BASE_URL + infotype)
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY })

  // console.log(url)

  return fetch(url).then((res) => res.json()).catch((error)=>{
    alert('citiy not found please reload')
         console.log(error)
  })
}

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs + offset, { zone: 'utc' }).toFormat(format)


const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_max, temp_min, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0]
  const formatedLocalTime = formatToLocalTime(dt, timezone)

  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
    sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
    details,
    speed,
    icon: iconUrl(icon),
    formatedLocalTime,
    lat,
    lon,
    dt,
    timezone

  }
}

const formatForcastWeather = (secs, offset, data) => {
  //hourly
  const hourly = data.filter((f) => f.dt > secs)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrl(f.weather[0].icon),
      date: f.dt_txt
    }))
    .slice(0,5)
    
    //daily
    const daily = data.filter((f)=> f.dt_txt.slice(-8)==='00:00:00').map((f)=>({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "cccc"),
      icon: iconUrl(f.weather[0].icon),
      date: f.dt_txt
    }))

    return{daily, hourly}
}


const getFormatedWeatherData = async (searchParams) => {
 try {
   // console.log(searchParams)
   const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then((data) => formatCurrent(data))
   .catch((err)=>{
      console.log(err)});
     
   const { lat, lon, dt, timezone } = formattedCurrentWeather;

  const formattedForcastWeather = await getWeatherData(
    "forecast",
    {
      lat,
      lon,
      units: searchParams.units
    }).then((d) => formatForcastWeather(dt, timezone, d.list))
      .catch((err)=> console.log(err))

  return { ...formattedCurrentWeather, ...formattedForcastWeather }
 } catch (error) {
  console.error("Error fetching weather data:", error);
  throw new Error("Failed to fetch weather data city not found");
}
}

export default getFormatedWeatherData;
