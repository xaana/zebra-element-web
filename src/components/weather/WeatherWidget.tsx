import React, { useState } from 'react';

import { WeatherData } from './types';
import { styled } from 'styled-components';
import { Separator } from '../ui/separator';

const WeatherIcon = styled.img`
  width: 60px;
  display: initial;
`;

const WeatherWidget = ({weatherData}:{weatherData:WeatherData}) => {
    const { location, current, forecast } = weatherData;
    const [isFahrenheit, setIsFahrenheit] = useState(true);

    // Handlers to toggle between Fahrenheit and Celsius
    const showFahrenheit = () => setIsFahrenheit(true);
    const showCelsius = () => setIsFahrenheit(false);

    return (
        <div className="bg-gray-700 text-white p-4 rounded-lg w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-row">
                    <WeatherIcon src={current.condition.icon} />
                    {/* <h2 className="text-2xl font-semibold">{`${current.temp_c}°C`}</h2> */}
                    <h2 className="text-2xl font-semibold text-white">
                        {isFahrenheit ? `${current.temp_f}°F` : `${current.temp_c}°C`}
                        <span className={` ml-2 cursor-pointer ${isFahrenheit?'text-sm text-gray-300' : 'text-xs'}`} onClick={showFahrenheit}>F</span>
                        <span className={` ml-2 cursor-pointer ${isFahrenheit?'text-xs' : 'text-sm text-gray-300'}`} onClick={showCelsius}>C</span>
                    </h2>
                    <p className='flex items-center ml-5'>{current.condition.text}</p>
                </div>
                <div>
                    <p>{`${location.name}, ${location.country}`}</p>
                    <p>{new Date(current.last_updated).toLocaleString()}</p>
                </div>
            </div>
            <Separator />
            <div className={`mt-4 grid grid-cols-${forecast.forecastday.length}`}>
                {forecast.forecastday.map((day, index) => (
                    <>
                    <div key={index} className={`text-center border-r-2 border-slate-300${index === forecast.forecastday.length - 1 ? ' border-none' : ''}`}>
                        {/* <i className={`wi wi-day-${day.day.condition.icon.split('/').pop().split('.')[0]}`} /> */}
                        <WeatherIcon src={day.day.condition.icon} />
                        <h3 className="text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                        {/* <p className="text-xs">{`${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C`}</p> */}
                        <p className="text-xs">
                            {isFahrenheit
                                ? `${day.day.maxtemp_f}°F / ${day.day.mintemp_f}°F`
                                : `${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C`}
                        </p>
                    </div>
                    </>
                ))}
            </div>
        </div>
    );
};


export default WeatherWidget;
