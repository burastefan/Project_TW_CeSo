const pageSize = 4
var curPage = 1

var floodsData = []
var floodsDataLocal = []

async function onInitialized() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("floodsComponent").style.display = "block";
    
    //Initialize NavBar
    initializeNavbar(userData);

    //Get earthquakes from API
    floodsData = await getFloodsApi();
    console.log(floodsData);

    //Get earthquakes from DB
    floodsDataLocal = await getEvents();
    console.log(floodsDataLocal);
    floodsData = floodsData.concat(floodsDataLocal);

    //Sort events desc by date of occurence
    floodsData = floodsData.sort((e1, e2) => (new Date(e2.date) - new Date(e1.date)));

    document.getElementById("loader").style.display = "none";
    initMap()
    renderEventTable(1)
    renderCounts()
}

async function getFloodsApi() {
    const response = await fetch('http://environment.data.gov.uk/flood-monitoring/id/floodAreas?_limit=10')
    console.log('Response: ', response)
    
    const data = await response.json();

    const floods = data.items.map(event => {
        const utcDate = new Date().setUTCHours(0,0,0,0);
        
        return {
            name: event.label,
            date: new Date(utcDate),
            location: event.county,
            riverOrSea: event.riverOrSea,
            source: 'Environment Agency Real Time Flood-Monitoring',
            lat: event.lat,
            long: event.long,
        }
    })

    return floods;
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

        let floods = data.filter(x => x.category === "flood");
        floods = floods.map(event => {
            const utcDate = new Date(event.date); // Get the UTC date
            const eventDate = new Date(utcDate.getTime() - new Date().getTimezoneOffset() * 60000); // Convert it to local date

            return {
                name: event.name,
                date: eventDate,
                location: event.location,
                riverOrSea: "Rivers/seas near " + event.location,
                source: 'Local Authorities'
            }
        })

        return floods;
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
    if ((curPage * pageSize) < floodsData.length) {
        curPage++
        renderEventTable(curPage)
    }
}

function numPages() {
    return Math.ceil(floodsData.length / pageSize)
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

    const events = JSON.parse(JSON.stringify(floodsData)).filter((row, index) => {
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
                <div class="elements--data__title">Location</div>
                <div class="elements--data__value">${events[i].location}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Rivers/Seas</div>
                <div class="elements--data__value">${events[i].riverOrSea}</div>
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
    completedEvents.innerHTML = 0

    const pendingEvents = document.getElementById('pendingEvents')
    pendingEvents.innerHTML = floodsData.length

    const newEvents = document.getElementById('newEvents')
    newEvents.innerHTML = 0
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('eventsMap'), {
        center: {lat: 52.520008, lng: 13.404954},
        zoom: 4
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
    for (let i = 0; i < floodsData.length; i++) {
        if (floodsData[i].source === 'Environment Agency Real Time Flood-Monitoring') {
            const latlng = new google.maps.LatLng(floodsData[i].lat, floodsData[i].long)

            const marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: 'Click Me ' + i
            })

            google.maps.event.addListener(marker, 'click', function() {
                infowindow = new google.maps.InfoWindow({
                    content: 
                    `<div>Name: ${floodsData[i].name}</div>` +
                    `<div>Location: ${floodsData[i].location}</div>` +
                    `<div>Rivers/Seas: ${floodsData[i].riverOrSea}</div>` +
                    `<div>Source: ${floodsData[i].source}</div>`
                })
                infowindow.open(map, marker)
            })
        }
        else {
            var geocoder = new google.maps.Geocoder()
            var address = floodsData[i].location

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
                        `<div>Name: ${floodsData[i].name}</div>` +
                        `<div>Location: ${floodsData[i].location}</div>` +
                        `<div>Rivers/Seas: ${floodsData[i].riverOrSea}</div>` +
                        `<div>Source: ${floodsData[i].source}</div>`
                    })
                    infowindow.open(map, marker)
                })
            })
        }
    }
}