import React, { useEffect, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, {Marker} from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';




const token = String(import.meta.env.VITE_APP_TOKEN )
// console.log(token)


const Mapp = ({setQuery, weather}) => {
    const [newPlace, setNewPlace] = useState(null)
    const [viewPort, setViewPort] = useState({
        latitude:28.66448,
        longitude:77.216,
        zoom:8
    })

    function handleClick (e){
      //  console.log(e.lngLat)
        const {lng, lat} = e.lngLat;
        setNewPlace({
            long: lng,
            lat: lat
        })
        setQuery({lat:lat, lon:lng})
    }
  useEffect(()=>{
    weather && setViewPort({
      latitude:weather?.lat,
      longitude:weather?.lon,
      zoom:8
     })
    //  console.log(weather)
  },[weather])
  
  

  return (
    <div className=' lg:h-[100vh] h-[50vh] w-full z-50'>
     <Map
     {...viewPort}
     mapboxAccessToken={token}
     width='100%'
     height='100%'
     transitionDuration='200'
     mapStyle='mapbox://styles/mapbox/streets-v12'
     onMove={evt=>setViewPort(evt.viewState)}
     onDblClick={handleClick}
     >
       {newPlace ? 
        <Marker
        latitude={newPlace?.lat}
        longitude={newPlace?.long}
        offsetLeft ={-3 * viewPort.zoom}
        offsetTop = {7 * viewPort.zoom}
        >
          
         <LocationOnIcon style={{
          fontSize:7 * viewPort.zoom,
          cursor:'pointer',
          color:'tomato'}}/>
        </Marker>
       :null}

     </Map>
    </div>
  )
}

export default Mapp
