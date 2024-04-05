document.addEventListener('DOMContentLoaded', function() {
    const getWeatherButton = document.getElementById('get-weather');
    const celsiusToggle = document.getElementById('celsius');
    const fahrenheitToggle = document.getElementById('fahrenheit');
    let isCelsius = true; // Flag to track the current temperature unit

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

    function handleGetWeather() {
        const city = document.getElementById('city').value;
        const apiKey = 'your api key'; // Replace with your WeatherAPI.com API key
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;

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
                if (data.location.region && countOccurrence(data.location.name, data.location.region) <= 0) {
                    todayWeatherInfo.querySelector('.location-region').textContent = data.location.region + ',';
                } else {
                    todayWeatherInfo.querySelector('.location-region').hidden = true;
                }          
                todayWeatherInfo.querySelector('.location-country').textContent = data.location.country;
                todayWeatherInfo.querySelector('.date').textContent = todayDate;

                // Display current time based on the location timezone
                const timezone = data.location.tz_id;
                const currentTime = new Date().toLocaleTimeString('en-US', {timeZone: timezone});
                todayWeatherInfo.querySelector('.current-time').textContent = `Current Time: ${currentTime}`;

                // Function to calculate the hour offset for the forecast
                function calculateHourOffset(currentHour) {
                    const offset = (currentHour + 1) % 24; // Ensure it wraps around the 24-hour clock
                    return offset;
                }

                // Update forecast information for the next 7 hours starting from the hour immediately following the current time
                const forecastContainer = document.querySelector('.nownext7hoursinfo');
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

                // Add forecast for the next 7 hours
                const currentTimeEpoch = data.location.localtime_epoch; // Local time provided by the API
                for (let i = 1; i <= 6; i++) {
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

    // Update weather every 7 hours
    setInterval(() => {
        getWeatherButton.click();
    }, 1000 * 60 * 60 * 7); // 7 hours in milliseconds
});
