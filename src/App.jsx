import './App.css';
import Mapp from './components/Mapp'
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TempAndDetails from './components/TempAndDetails';
import Forcaste from './components/Forcaste';
import getFormatedWeatherData from './services/weatherService';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {
  const [query, setQuery] = useState({q: 'delhi'})
  const [units, setUnits]= useState('metric')
  const [weather, setWeather] = useState(null)


 
function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

  const getweather = async()=>{
    const cityName = query.q ?query.q :'currnet location'
    toast.info(`Fetching weather data for ${capitalizeFirstLetter(cityName)}`)
 await getFormatedWeatherData({...query,units}).then((data)=>{
  toast.success(`Fetched data for ${data.name}, ${data.country}`)
  setWeather(data)});
  // console.log(data)
  }
 
  useEffect(()=>{
    getweather()
  //  console.log({...query, units})
  },[query,units])

  const formatedColor =()=>{
    if(!weather) return " from-cyan-600 to-blue-700";

    const threshold = units ==='metric'?25:65;

    if(weather.temp <= threshold ) return' from-cyan-600 to-blue-700';

    return "from-yellow-600 to-orange-700"
  }
  return (
 <div className='sm:flex sm:flex-col lg:flex-row '>
 <div className={`lg:w-1/2 px-4 bg-gradient-to-br shadow-xl shadow-gray-400 lg:h-[100vh] lg:overflow-x-hidden  ${formatedColor()}`}>
     <TopButtons setQuery={setQuery}/>
     <Inputs setQuery={setQuery} setUnits={setUnits}/>
     {weather &&(
      <>
     <TimeAndLocation weather={weather}/>
     <TempAndDetails weather={weather} units={units}/>
     <Forcaste title='3 hours step forcast' data={weather.hourly}/>
     <Forcaste title='daily forcast' data={weather.daily}/>
     </>
     )}
 </div>
 <div className='lg:w-1/2 '>
 <Mapp setQuery={setQuery} weather={weather}/>
 </div>
 <ToastContainer autoClose={2500} hideProgressBar={true} theme='colored'/>
      </div>

  );
}

export default App;
