document.addEventListener('DOMContentLoaded', function() {
    const getWeatherButton = document.getElementById('get-weather');
    const celsiusToggle = document.getElementById('celsius');
    const fahrenheitToggle = document.getElementById('fahrenheit');
    let isCelsius = true; // Flag to track the current temperature unit
    let city = "null";

    // inatialize the fuction to set the landingPage to the info to user location
    getUserLocation();

    // Function to toggle between Celsius and Fahrenheit
    function toggleTemperatureUnit() {
        if ((isCelsius && this === celsiusToggle) || (!isCelsius && this === fahrenheitToggle)) {
            return; // Return if the current temperature unit matches the clicked toggle
        }
        isCelsius = !isCelsius; // Toggle the temperature unit flag
        getWeatherButton.click(); // Refresh weather data with updated temperature unit
    }

    celsiusToggle.addEventListener('click', toggleTemperatureUnit);
    fahrenheitToggle.addEventListener('click', toggleTemperatureUnit);

    getWeatherButton.addEventListener('click', handleGetWeather);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleGetWeather();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            city = document.getElementById('city').value;
            handleGetWeather(city);
        }
    });

    function getUserLocation() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                city = data.city;
                const country = data.country_name;
                const latitude = data.latitude;
                const longitude = data.longitude;
                
                console.log('City:', city);
                console.log('Country:', country);
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);
    
                // Call handleGetWeather with the location name
                handleGetWeather(city);
            })
            .catch(error => {
                console.error('Error fetching location data:', error);
            });
    } 

    function handleGetWeather(city) {
        const apiKey = '9d25421f1b894a7abb8225858240204'; // Replace with your WeatherAPI.com API key
        const url = ;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Update current weather information
                const todayWeatherInfo = document.querySelector('.today-weather-info');
                const currentWeather = data.current;
                const todayDate = new Date().toDateString();
                const temperature = isCelsius ? currentWeather.temp_c : currentWeather.temp_f;
                const temperatureUnit = isCelsius ? "°C" : "°F";

                todayWeatherInfo.querySelector('.hour-temperature').textContent = `${temperature}${temperatureUnit}`;
                todayWeatherInfo.querySelector('.hour-icon').src = currentWeather.condition.icon;
                todayWeatherInfo.querySelector('.location-name').textContent = data.location.name + ',';
                todayWeatherInfo.querySelector('.location-region');
                // Assuming data is your object containing location information
                if (data.location.region && countOccurrence(data.location.region, data.location.name) <= 0) {
                    todayWeatherInfo.querySelector('.location-region').textContent = data.location.region + ',';
                } else {
                    todayWeatherInfo.querySelector('.location-region').hidden = true;
                    console.log('Region name',data.location.region, 'same as location name hidden!');
                }      
                todayWeatherInfo.querySelector('.location-country').textContent = data.location.country;
                todayWeatherInfo.querySelector('.date').textContent = todayDate;


                // Display current time based on the location timezone
                const timezone = data.location.tz_id;
                const currentTime = new Date().toLocaleTimeString('en-US', {timeZone: timezone});
                todayWeatherInfo.querySelector('.current-time').textContent = `Current Time: ${currentTime}`;

                setBackground(data.current.condition.text);

                // Function to calculate the hour offset for the forecast
                function calculateHourOffset(currentHour) {
                    const offset = (currentHour + 1) % 24; // Ensure it wraps around the 24-hour clock
                    return offset;
                }

                // Update forecast information for the next 7 hours starting from the hour immediately following the current time
                const forecastContainer = document.querySelector('.nownext12hoursinfo');
                forecastContainer.innerHTML = ''; // Clear existing forecast data

                // Add the current hour data (Now)
                const currentHourEpoch = data.location.localtime_epoch;
                const currentHourData = data.forecast.forecastday[0].hour.find(hourData => {
                    const hourEpoch = hourData.time_epoch;
                    return Math.abs(hourEpoch - currentHourEpoch) < 3600; // Check if the difference is within 1 hour (3600 seconds)
                });

                if (currentHourData) {
                    const currentHourTime = new Date(currentHourData.time_epoch * 1000).toLocaleTimeString('en-US', {timeZone: timezone});
                    const currentTemperature = isCelsius ? currentHourData.temp_c : currentHourData.temp_f;
                    const currentTemperatureUnit = isCelsius ? "°C" : "°F";
                    
                    const currentHourElement = document.createElement('div');
                    currentHourElement.classList.add('hour-info');
                    currentHourElement.innerHTML = `
                        <p class="placeHourDateTime">Now</p>
                        <div class="timeInformation">
                            <!-- <p class="placeHourDateTime">${currentHourTime}</p>  Display current time here -->
                            <img class="hour-icon" src="${currentHourData.condition.icon}" alt="Weather Icon">
                            <h5 class="hour-temperature">${currentTemperature}${currentTemperatureUnit}</h5>
                        </div>
                    `;
                    forecastContainer.appendChild(currentHourElement);
                }

                // Add forecast for the next 12 hours
                const currentTimeEpoch = data.location.localtime_epoch; // Local time provided by the API
                for (let i = 1; i <= 12; i++) {
                    const nextHourEpoch = currentTimeEpoch + i * 3600; // Increment by 3600 seconds (1 hour)

                    const nextHourTime = new Date(nextHourEpoch * 1000).toLocaleTimeString('en-US', {timeZone: timezone});
                    const nextHourData = data.forecast.forecastday[0].hour.find(hourData => {
                        const hourEpoch = hourData.time_epoch;
                        return Math.abs(hourEpoch - nextHourEpoch) < 3600; // Check if the difference is within 1 hour (3600 seconds)
                    });

                    if (nextHourData) {
                        const hourElement = document.createElement('div');
                        hourElement.classList.add('hour-info');
                        hourElement.innerHTML = `
                            <p class="placeHourDateTime">${nextHourTime}</p>
                            <div class="timeInformation">
                                <img class="hour-icon" src="${nextHourData.condition.icon}" alt="Weather Icon">
                                <h5 class="hour-temperature">${isCelsius ? nextHourData.temp_c : nextHourData.temp_f}${temperatureUnit}</h5>
                            </div>
                        `;
                        forecastContainer.appendChild(hourElement);
                    }
                }

            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }

    // Update weather every 12 hours
    setInterval(() => {
        getWeatherButton.click();
    }, 1000 * 60 * 60 * 12); // 12 hours in milliseconds
});
