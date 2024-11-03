function readLocalJson(event)
{
	document.getElementById("multi-list").innerHTML = "";

	var file = event.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file, 'UTF-8');

	var totalGames = 0;
	var unlistedGames = 0;
	var unratedGame = 0;

	reader.onload = readerEvent => 
	{
		const appIdRegex = /"(\d+)":{/g;
		var appID;
		var content = readerEvent.target.result;

		while (appID = appIdRegex.exec(content))
		{
			totalGames++;
			// Search json

			const query = appID[1].toString();

			var results = jsonData
				.filter(item => item.id.toString().toLowerCase().includes(query))
				.slice(0, 1);

			if (results.length > 0)
			{
				results.forEach(result =>
				{
					if (!result.rated)
					{
						unratedGame++;
					}

					generateListElement(result, "multi-list");

				});
			}
			else
			{
				var result = Object.create(null);
				result.name = appID[1].toString() + " - Not in database";
				result.type = "Steam App ID " + appID[1].toString() + " not found";
				generateListElement(result, "multi-list");
				unlistedGames++;
			}

		}

		var contentHeader = document.getElementById("wishlistSummary");
		contentHeader.innerText = "AppIDs with age rating " + (totalGames - unratedGame) + "/" + totalGames;
		contentHeader.style.display = "block";
	}


}

function openTab(evt, tabName) 
{
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++)
	{
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++)
	{
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}

function showSearchResults()
{
	const searchInput = document.getElementById("searchInput");
	const suggestionsList = document.getElementById("suggestions");
	const query = searchInput.value.toLowerCase();

	if (query)
	{
		// Filter data based on query and limit to 4 results
		const results = jsonData
			.filter(item => item.name.toLowerCase().includes(query))
			.filter(item => item.type == 'game' || item.type == "dlc" || item.type == 'demo')
			.slice(0, 100);

		// Show suggestions if there are results
		if (results.length > 0)
		{
			var searchWrapper = document.getElementById("search-section");

			searchWrapper.style["border-bottom-left-radius"] = "0px";
			searchWrapper.style["border-bottom-right-radius"] = "0px";

			document.getElementById("single-list").innerHTML = "";

			results.forEach(result =>
			{
				generateListElement(result, "single-list");
			});
			suggestionsList.style.display = "block";
		} else
		{
			var searchWrapper = document.getElementById("search-section");
			searchWrapper.style["border-bottom-left-radius"] = "5px";
			searchWrapper.style["border-bottom-right-radius"] = "5px";

			suggestionsList.style.display = "none";
		}
	} else
	{
		suggestionsList.style.display = "none"; // Hide suggestions if query is empty
	}


}

function searchJson()
{
	const searchInput = document.getElementById("searchInput");
	const suggestionsList = document.getElementById("suggestions");
	const query = searchInput.value.toLowerCase();

	// Clear previous suggestions
	suggestionsList.innerHTML = "";

	if (query)
	{
		// Filter data based on query and limit to 4 results
		const results = jsonData
			.filter(item => item.name.toLowerCase().includes(query))
			.filter(item => item.type == 'game' || item.type == "dlc" || item.type == 'demo')
			.slice(0, 4);

		// Show suggestions if there are results
		if (results.length > 0)
		{
			var searchWrapper = document.getElementById("search-section");

			searchWrapper.style["border-bottom-left-radius"] = "0px";
			searchWrapper.style["border-bottom-right-radius"] = "0px";

			results.forEach(result =>
			{
				const listItem = document.createElement("li");

				listItem.textContent = result.name;
				listItem.addEventListener("click", () =>
				{
					document.getElementById("single-list").innerHTML = "";
					generateListElement(result, "single-list");
					searchInput.value = result.name;
					suggestionsList.innerHTML = ""; // Clear suggestions
				});
				suggestionsList.appendChild(listItem);
			});
			suggestionsList.style.display = "block";
		} else
		{
			var searchWrapper = document.getElementById("search-section");
			searchWrapper.style["border-bottom-left-radius"] = "5px";
			searchWrapper.style["border-bottom-right-radius"] = "5px";

			suggestionsList.style.display = "none";
		}
	} else
	{
		suggestionsList.style.display = "none"; // Hide suggestions if query is empty
	}
}

// Hide suggestions when clicking outside the input
document.addEventListener("click", (event) =>
{
	if (!document.getElementById("searchInput").contains(event.target))
	{
		var searchWrapper = document.getElementById("search-section");
		searchWrapper.style["border-bottom-left-radius"] = "5px";
		searchWrapper.style["border-bottom-right-radius"] = "5px";

		document.getElementById("suggestions").style.display = "none";
	}
});

const imgPart1 = "https:\\/\\/shared.akamai.steamstatic.com\\/store_item_assets\\/steam\\/apps\\/";
const imgPart2 = "\\/header.jpg?t="

function generateListElement(jsonObject, element)
{
	var styledList = document.getElementById(element);

	var listElement = document.createElement("li");
	listElement.className = "list-item";

	var headerImg = document.createElement("img");
	headerImg.src = imgPart1 + jsonObject.id + imgPart2 + jsonObject.image;
	headerImg.alt = "Preview Image";
	headerImg.className = "preview-image";

	var contentDiv = document.createElement("div");
	contentDiv.className = "content";

	var contentHeader = document.createElement("h3");
	contentHeader.className = "name";
	contentHeader.innerText = jsonObject.name;

	var contentDescr = document.createElement("p");
	contentDescr.className = "description";
	contentDescr.innerText = "Type: " + jsonObject.type;

	var availabilityDiv = document.createElement("div");
	availabilityDiv.className = "availability";

	var avIcon = document.createElement("span");

	var avText = document.createElement("span");
	avText.className = "availability-text";

	if (jsonObject.type == 'game' || jsonObject.type == 'dlc' || jsonObject.type == 'demo')
	{
		if (jsonObject.rated)
		{
			avIcon.className = "availability-icon available";
			avText.innerText = "Available";
		}
		else
		{
			avIcon.className = "availability-icon unavailable";
			avText.innerText = "Not Available"
		}
	}
	else
	{
		avIcon.className = "availability-icon unrelevant";
		avText.innerText = "Excluded";
	}


	styledList.appendChild(listElement);
	listElement.appendChild(headerImg);
	listElement.appendChild(contentDiv);
	contentDiv.appendChild(contentHeader);
	contentDiv.appendChild(contentDescr);
	listElement.appendChild(availabilityDiv);
	availabilityDiv.appendChild(avIcon);
	availabilityDiv.appendChild(avText);


}

function fillPieChart()
{

	var ratedGames = 0;
	var unratedGame = 0;
	var ratedDemos = 0;
	var unratedDemos = 0;
	var ratedDlcs = 0;
	var unratedDlcs = 0;

	jsonData.forEach(element => 
	{
		switch (element.type)
		{
			case 'game':
				element.rated ? ratedGames++ : unratedGame++;
				break;
			case 'demo':
				element.rated ? ratedDemos++ : unratedDemos++;
				break;
			case 'dlc':
				element.rated ? ratedDlcs++ : unratedDlcs++;
				break;
		}
	});

	const ctx = document.getElementById('myChart');

	if (Chart.getChart(myChart) != undefined)
	{
		Chart.getChart(myChart).destroy();
	}

	new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ['Rated Games', 'Unrated Games', "Rated Demos", "Unrated Demos", "Rated Dlcs", "Unrated Dlcs"],
			datasets: [{
				label: '# of Votes',
				data: [ratedGames, unratedGame, ratedDemos, unratedDemos, ratedDlcs, unratedDlcs],
				borderWidth: 1
			}]
		},


	});
}

function showMissingList()
{
	totalUnrated = 0;
	totalRated = 0;

	document.getElementById("resultMissing").innerHTML = "";

	jsonData.forEach(element => 
	{
		switch (element.type)
		{
			case 'game':
			case 'demo':
			case 'dlc':
				if (element.isRated)
				{
					totalRated++;
				}
				else
				{
					totalUnrated++;

					let p = document.createElement('p');
					p.innerText = "AppID: " + element.id + " Name: " + element.name;

					document.getElementById("resultMissing").appendChild(p);

					let resImage = document.createElement('img');
					resImage.src = element.image;
					resImage.innerHTML = "Image";
					p.appendChild(resImage);
				}
				break;
		}

	});
	document.getElementById("summaryMissing").innerText = "Total Games Missing age rating: " + totalUnrated + "/" + (totalUnrated + totalRated);
}
