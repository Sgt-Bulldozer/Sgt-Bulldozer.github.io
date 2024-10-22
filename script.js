document.getElementById('submitButton').addEventListener('click', function () 
{
	const userInput = document.getElementById('inputField').value;
	const proxyUrl = 'https://api.allorigins.win/get?url=http://store.steampowered.com/api/appdetails?appids=' + userInput;
	
    fetch(proxyUrl)
    .then(response => 
	{
		if (!response.ok)
		{
			throw new Error('HTTP error! Status: ${response.status}');
        }
                return response.json();
            })
            .then(data => 
			{
				// Prepare json
                const finalJson = JSON.stringify(data, null, 2).replaceAll('\\', '');
				console.log( finalJson );
				
				// Get name via regex
				const nameRegex = /"name"\s*:\s*"([^"]+)"/;
				const gameName = finalJson.match(nameRegex);
				console.log( 'Game Name: ' + gameName );
				
				// Get appID via regex
				const appIdRegex = /"steam_appid"\s*:\s*(\d+)/;
				const appID = finalJson.match(appIdRegex);
				console.log( 'App ID: ' + appID );
				
				// Get icon via regex
				const iconRegex = /"header_image"\s*:\s*"([^"]+)"/;
				console.log( finalJson.match(iconRegex) );
				
				// Get Age rating via regex (germany)
				const steamGermanyRegex = /"steam_germany":{"rating_generated"\s*:\s*"([^"]+)"/;
				const steamGermanyRating = finalJson.match(steamGermanyRegex);
				console.log( 'Steam Germany: ' + steamGermanyRating );
				
				// Get Age rating via regex (pegi)
				const pegiRegex = /"pegi":{"rating"\s*:\s*"([^"]+)"/;
				const pegiRating = finalJson.match(pegiRegex);
				console.log( 'PEGI: ' + pegiRating );
				
				// Get Age rating via regex (usk)
				const uskRegex = /"usk":{"rating"\s*:\s*"([^"]+)"/;
				const uskRating = finalJson.match(uskRegex);
				console.log( 'USK: ' + uskRating );
				
				// Get Age rating via regex (esrb)
				const esrbRegex = /"esrb":{"rating"\s*:\s*"([^"]+)"/;
				const esrbRating = finalJson.match( esrbRegex );
				console.log( 'ESRB: ' + esrbRating );
				
				// Get Age rating via regex (brazil)
				const dejusRegex = /"dejus":{"rating_generated"\s*:\s*"([^"]+)"/;
				const dejusRating = finalJson.match( dejusRegex );
				console.log( 'DEJUS: ' + dejusRating );
				
				ratingFound = "No valid age rating found!";
				
				if( steamGermanyRating != null || pegiRating != null || uskRating != null || esrbRating != null || dejusRating != null )
				{
					ratingFound = "Found valid age rating";
				}
				
				document.getElementById('result').textContent = "AppID: " + appID[1] + " Name: " + gameName[1] + " Result: " + ratingFound;
            })
            .catch(error => 
			{
                document.getElementById('result').textContent = `Error: ${error.message}`;
            });
});

