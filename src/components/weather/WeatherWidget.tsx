import React, { useState } from 'react';

import { WeatherData } from './types';
import { styled } from 'styled-components';
import { Separator } from '../ui/separator';

const WeatherIcon = styled.img`
  width: 30px;
  height:30px;
  display: initial;
`;

const WeatherCurrentIcon = styled.img`
  width: 64px;
  display: initial;
`;

const WeatherWidget = ({weatherData}:{weatherData:WeatherData}) => {
    const { location, current, forecast } = weatherData;
    const [isFahrenheit, setIsFahrenheit] = useState(false);

    // Handlers to toggle between Fahrenheit and Celsius
    const showFahrenheit = () => setIsFahrenheit(true);
    const showCelsius = () => setIsFahrenheit(false);

    return (
        <div className="bg-gray-700 text-white px-4 rounded-lg w-[450px]">
            <div className="flex items-center justify-between flex-row">
                <div className="flex gap-x-2">
                    <WeatherCurrentIcon src={current.condition.icon} />
                    {/* <h2 className="text-2xl font-semibold">{`${current.temp_c}°C`}</h2> */}
                    <h2 className="text-2xl font-semibold text-white">
                        {isFahrenheit ? `${current.temp_f}°F` : `${current.temp_c}°C`}
                        <span className={` ml-2 cursor-pointer ${isFahrenheit?'text-sm text-gray-300' : 'text-xs'}`} onClick={showFahrenheit}>F</span>
                        <span className={` ml-2 cursor-pointer ${isFahrenheit?'text-xs' : 'text-sm text-gray-300'}`} onClick={showCelsius}>C</span>
                    </h2>
                    <p className='flex items-center'>{current.condition.text}</p>
                </div>
                <div>
                    <p>{`${location.name}, ${location.country}`}</p>
                    <p>{new Date(location.localtime).toLocaleString("en-AU")}</p>
                </div>
            </div>
            <Separator />
            <div className='mt-4 flex flex-row justify-center'>
                {forecast.forecastday.map((day, index) => (
                    
                    <div key={index} className={`text-center px-2 border-r-2 border-slate-300${index === forecast.forecastday.length - 1 ? ' border-none' : ''}`}>
                        {/* <i className={`wi wi-day-${day.day.condition.icon.split('/').pop().split('.')[0]}`} /> */}
                        <WeatherIcon src={day.day.condition.icon} />
                        <h4 className="text-xs">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                        {/* <p className="text-xs">{`${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C`}</p> */}
                        <p className="text-xs">
                            {isFahrenheit
                                ? `${day.day.maxtemp_f}°F / ${day.day.mintemp_f}°F`
                                : `${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C`}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default WeatherWidget;
