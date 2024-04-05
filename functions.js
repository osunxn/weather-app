function countOccurrence(mainPhrase, ...searchPhrases) {
    // Initialize a variable to store the count
    let count = 0;

    // Loop through each search phrase
    searchPhrases.forEach(phrase => {
        // Use a regular expression to find all occurrences of the search phrase in the main phrase
        const regex = new RegExp(phrase, 'gi');
        const matches = mainPhrase.match(regex);
        
        // If matches are found, increment the count by the number of matches
        if (matches) {
            count += matches.length;
        }
    });

    // Return the total count
    return count;
}

// Function to set background color based on weather condition
function setBackground(weatherCondition) {
    const body = document.body;

    // Define color mappings based on weather conditions using linear gradients
    const colorMappings = {
        'clear': 'linear-gradient(180deg, hsl(200, 100%, 50%), hsl(200, 100%, 74%))', // Start with darker blue and transition to lighter blue for clear weather
        'partly cloudy': 'linear-gradient(180deg, hsl(0, 2%, 63%), hsl(0, 4%, 84%))', // Start with darker gray and transition to lighter gray for partly cloudy weather
        'overcast': 'linear-gradient(180deg, hsl(0, 0%, 50%), hsl(0, 0%, 70%))', // Start with darker gray and transition to lighter gray for overcast weather
        'cloudy': 'linear-gradient(180deg, hsl(0, 0%, 30%), hsl(0, 0%, 70%))', // Start with darker gray and transition to lighter gray for cloudy weather
        'rain': 'linear-gradient(180deg, hsl(207, 75%, 42%), hsl(211, 28%, 42%))', // Start with darker blue and transition to lighter blue for rainy weather
        'snow': 'linear-gradient(180deg, hsl(200, 30%, 50%), hsl(200, 20%, 85%))', // Start with darker white and transition to lighter white for snowy weather
        'sunny': 'linear-gradient(180deg, hsl(59, 29%, 53%), hsl(200, 60%, 76%))', // Start with darker yellow and transition to lighter yellow for sunny weather
        'fog': 'linear-gradient(180deg, hsl(0, 0%, 50%), hsl(0, 0%, 65%))', // Start with darker gray and transition to lighter gray for foggy weather
        'thunderstorm': 'linear-gradient(180deg, hsl(240, 100%, 20%), hsl(240, 100%, 40%))', // Start with darker purple and transition to lighter purple for thunderstorm
        'windy': 'linear-gradient(180deg, hsl(120, 70%, 50%), hsl(120, 50%, 60%))', // Start with darker green and transition to lighter green for windy weather
        'haze': 'linear-gradient(180deg, hsl(60, 70%, 60%), hsl(60, 50%, 70%))', // Start with darker brown and transition to lighter brown for hazy weather
        'smoke': 'linear-gradient(180deg, hsl(0, 0%, 10%), hsl(0, 0%, 20%))', // Start with darker gray and transition to lighter gray for smokey weather
        'dust': 'linear-gradient(180deg, hsl(30, 90%, 60%), hsl(30, 70%, 65%))', // Start with darker orange and transition to lighter orange for dusty weather
        'tornado': 'linear-gradient(180deg, hsl(0, 100%, 10%), hsl(0, 100%, 20%))', // Start with darker black and transition to lighter black for tornado weather
        'sandstorm': 'linear-gradient(180deg, hsl(40, 90%, 60%), hsl(40, 90%, 70%))', // Start with darker sand color and transition to lighter sand color for sandstorm
        'hail': 'linear-gradient(180deg, hsl(240, 50%, 30%), hsl(240, 30%, 45%))', // Start with darker cyan and transition to lighter cyan for hail weather
        'blizzard': 'linear-gradient(180deg, hsl(200, 30%, 70%), hsl(200, 10%, 85%))', // Start with darker blue and transition to lighter blue for blizzard weather
        'drizzle': 'linear-gradient(180deg, hsl(210, 50%, 50%), hsl(210, 40%, 65%))', // Start with darker blue and transition to lighter blue for drizzle weather
        'sleet': 'linear-gradient(180deg, hsl(210, 30%, 40%), hsl(210, 20%, 50%))', // Start with darker blue and transition to lighter blue for sleet weather
        'freezing rain': 'linear-gradient(180deg, hsl(210, 40%, 50%), hsl(210, 30%, 60%))', // Start with darker blue and transition to lighter blue for freezing rain weather
        'icy': 'linear-gradient(180deg, hsl(240, 10%, 85%), hsl(240, 5%, 95%))', // Start with darker blue and transition to lighter blue for icy weather
        'squall': 'linear-gradient(180deg, hsl(240, 70%, 40%), hsl(240, 50%, 65%))', // Start with darker blue and transition to lighter blue for squall weather
        'tropical storm': 'linear-gradient(180deg, hsl(240, 70%, 40%), hsl(240, 50%, 65%))', // Start with darker blue and transition to lighter blue for tropical storm weather
        'ash': 'linear-gradient(180deg, hsl(0, 0%, 10%), hsl(0, 0%, 25%))', // Start with darker gray and transition to lighter gray for ash weather
        'volcanic eruption': 'linear-gradient(180deg, hsl(0, 0%, 10%), hsl(0, 0%, 25%))', // Start with darker gray and transition to lighter gray for volcanic eruption weather
        'rainbow': 'linear-gradient(180deg, hsl(0, 100%, 30%), hsl(360, 100%, 70%))', // Start with darker rainbow colors and transition to lighter rainbow colors for rainbow weather
        'meteor shower': 'linear-gradient(180deg, hsl(240, 60%, 40%), hsl(240, 30%, 70%))', // Start with darker blue and transition to lighter blue for meteor shower weather
        'patchy light rain with thunder': 'linear-gradient(180deg, hsl(210, 70%, 60%), hsl(0, 0%, 70%), hsl(50, 100%, 70%))', // Blue to gray to yellow for patchy light rain with thunder
        // Add more weather conditions and their corresponding colors as needed
    };

    let maxKeywordsCount = 0;
    let matchingColor = '';

    // Loop through color mappings and find the one with the most matched keywords
    for (const condition in colorMappings) {
        const keywordsCount = countOccurrence(weatherCondition.toLowerCase(), condition.toLowerCase());
        if (keywordsCount > maxKeywordsCount) {
            maxKeywordsCount = keywordsCount;
            matchingColor = colorMappings[condition];
        }
    }

    // Set background color based on weather condition or default to light blue if no specific condition is found
    if (maxKeywordsCount > 0) {
        // If any weather condition keyword is found, set background color based on the most matched keywords
        body.style.backgroundImage = matchingColor;
    } else {
        // If no specific condition is found, default to light blue
        body.style.backgroundColor = '#80d4ff';
    }
}