import React, { useEffect, useState } from 'react';
import '../App.css';
import logo from '../images/weather_logo.png';

const Navbar = (props) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (props.data && props.data.location) {
      const updateLocalTime = () => {
        const localTimeString = props.data.location.localtime;
        const localTime = new Date(localTimeString); 


        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = localTime.toLocaleDateString('en-GB', options);

        const formattedTime = localTime.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true 
        });

        
        setCurrentTime(`${formattedDate} ${formattedTime}`);
      };

    
      updateLocalTime();
    }
  }, [props.data]);

  return (
    <div className="nav">
      <img className="logo" src={logo} alt="Weather Logo" />
      {props.data && props.data.location ? (
        <div className='nav-info'>
          <p>{props.data.location.name}, {props.data.location.country}</p>
           
          <p>{currentTime}</p> 
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Navbar;
