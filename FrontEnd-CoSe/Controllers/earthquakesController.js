const pageSize = 4
var curPage = 1

var earthquakesData = []
var earthquakesDataLocal = []

async function onInitialized() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("earthquakesComponent").style.display = "block";
    
    //Initialize NavBar
    initializeNavbar(userData);

    //Get earthquakes from API
    earthquakesData = await getEarthquakesApi();
    console.log(earthquakesData);

    //Get earthquakes from DB
    earthquakesDataLocal = await getEvents();
    console.log(earthquakesDataLocal);
    earthquakesData = earthquakesData.concat(earthquakesDataLocal);

    //Sort events desc by date of occurence
    earthquakesData = earthquakesData.sort((e1, e2) => (new Date(e2.date) - new Date(e1.date)));

    document.getElementById("loader").style.display = "none";
    initMap()
    renderEventTable(1)
    renderCounts()
}

async function getEarthquakesApi() {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=10');
    console.log('Response: ', response);
    
    const data = await response.json();

    const earthquakes = data.features.map(event => {
        return {
            name: event.properties.title,
            date: new Date(event.properties.time),
            dateOfOccurence: new Date(event.properties.time).toLocaleDateString('en-UK'),
            timeOfOccurence: new Date(event.properties.time).toLocaleTimeString('en-UK'),
            location: event.properties.place,
            mag: event.properties.mag,
            lat: event.geometry.coordinates[1],
            long: event.geometry.coordinates[0],
            source: 'USGS Earthquake Catalog'
        }
    })

    return earthquakes;
}

async function getEvents() {
    const response = await fetch('http://localhost:5003/api/events', {
        method: 'GET', 
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.jwt
        }), 
    });
    console.log('Get Events Response: ', response);
    
    if (response.status == 200) {
        const data = await response.json();

        let earthquakes = data.filter(x => x.category === "earthquake");
        earthquakes = earthquakes.map(event => {
            if (event.code == "yellow") {
                var mag = "< 2";
            } else if (event.code == "orange") {
                var mag = "< 4";
            } else if (event.code == "red") {
                var mag = "> 4";
            }

            const utcDate = new Date(event.date); // Get the UTC date
            const eventDate = new Date(utcDate.getTime() - new Date().getTimezoneOffset() * 60000); // Convert it to local date

            return {
                name: event.name,
                date: eventDate,
                dateOfOccurence: event.dateOfOccurence,
                timeOfOccurence: event.timeOfOccurence,
                location: event.location,
                mag: mag,
                source: 'Local Authorities'
            }
        })

        return earthquakes;
    }

    return [];
}

function previousPage() {
    if (curPage > 1) {
        curPage--
        renderEventTable(curPage)
    }
}
  
function nextPage() {
    if ((curPage * pageSize) < earthquakesData.length) {
        curPage++
        renderEventTable(curPage)
    }
}

function numPages() {
    return Math.ceil(earthquakesData.length / pageSize)
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function renderEventTable(page) {
    const prevButton = document.getElementById('prevButton')
    const nextButton = document.getElementById('nextButton')
    prevButton.style.visibility = "visible"
    nextButton.style.visibility = "visible"

    if (page == 1) {
        prevButton.disabled = true
    } else {
        prevButton.disabled = false
    }
    
    if (page == numPages()) {
        nextButton.disabled = true
    } else {
        nextButton.disabled = false
    }

    const events = JSON.parse(JSON.stringify(earthquakesData)).filter((row, index) => {
        let start = (curPage - 1) * pageSize
        let end = curPage * pageSize
        if (index >= start && index < end) return true
    });

    const eventsList = document.getElementById('eventsList')

    if (document.querySelector('#eventsList').firstChild) {
        removeAllChildNodes(document.querySelector('#eventsList'))
    }

    for (let i = 0; i < events.length; i++) {
        const eventRow = document.createElement('div')
        eventRow.innerHTML =
        `
        <div class="first-section--elements">
            <div class="elements--container">
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Name</div>
                <div class="elements--data__value">${events[i].name}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Date</div>
                <div class="elements--data__value">${events[i].dateOfOccurence}</div>
                <div class="elements--data__value">${events[i].timeOfOccurence}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Location</div>
                <div class="elements--data__value">${events[i].location}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Magnitude</div>
                <div class="elements--data__value">${events[i].mag}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Source</div>
                <div class="elements--data__value">${events[i].source}</div>
                </div>
            </div>
            </div>
        </div>
        `

        eventsList.append(eventRow)
    }
}

function renderCounts() {
    const completedEvents = document.getElementById('completedEvents')
    completedEvents.innerHTML = earthquakesData.length

    const pendingEvents = document.getElementById('pendingEvents')
    pendingEvents.innerHTML = 0

    const newEvents = document.getElementById('newEvents')
    newEvents.innerHTML = 0
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('eventsMap'), {
        center: {lat: 36.7771, lng: -10.24965},
        zoom: 2
    });

    var input = document.getElementById('searchInput')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

    //Autocomplete Input
    var autocomplete = new google.maps.places.Autocomplete(input)
    autocomplete.bindTo('bounds', map)

    //Zoom to searched place
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace()

        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry")
            return
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport)
        } else {
            map.setCenter(place.geometry.location)
            map.setZoom(17)
        }
    })

    //Set markers on map
    for (let i = 0; i < earthquakesData.length; i++) {
        if (earthquakesData[i].source === 'USGS Earthquake Catalog') {
            const latlng = new google.maps.LatLng(earthquakesData[i].lat, earthquakesData[i].long)

            const marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: 'Click Me ' + i
            })

            google.maps.event.addListener(marker, 'click', function() {
                infowindow = new google.maps.InfoWindow({
                    content: 
                    `<div>Name: ${earthquakesData[i].name}</div>` +
                    `<div>Location: ${earthquakesData[i].location}</div>` +
                    `<div>Date of occurence: ${earthquakesData[i].dateOfOccurence}</div>` +
                    `<div>Time of occurence: ${earthquakesData[i].timeOfOccurence}</div>` +
                    `<div>Magnitude: ${earthquakesData[i].mag}</div>` +
                    `<div>Source: ${earthquakesData[i].source}</div>`
                })
                infowindow.open(map, marker)
            })
        }
        else {
            var geocoder = new google.maps.Geocoder()
            var address = earthquakesData[i].location

            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                }

                var latlng = new google.maps.LatLng(latitude, longitude);
                
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: 'Click Me ' + i
                })

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow = new google.maps.InfoWindow({
                        content: 
                        `<div>Name: ${earthquakesData[i].name}</div>` +
                        `<div>Location: ${earthquakesData[i].location}</div>` +
                        `<div>Date of occurence: ${earthquakesData[i].dateOfOccurence}</div>` +
                        `<div>Time of occurence: ${earthquakesData[i].timeOfOccurence}</div>` +
                        `<div>Magnitude: ${earthquakesData[i].mag}</div>` +
                        `<div>Source: ${earthquakesData[i].source}</div>`
                    })
                    infowindow.open(map, marker)
                })
            })
        }
    }
}