const pageSize = 4;
var curPage = 1;
var eventsData = [];
var earthquakesData = [];
var floodsData = [];
var filterStatus = 'all';

async function onInitialized() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("mapComponent").style.display = "block";
    
    //Initialize NavBar
    initializeNavbar(userData);

    eventsData = await getEvents()

    //Get earthquakes from API and concatenate with events array
    earthquakesData = await getEarthquakesApi();
    console.log("Earthquakes: ", earthquakesData);
    eventsData = eventsData.concat(earthquakesData);

    //Get floods from API and concatenate with events array
    floodsData = await getFloodsApi();
    console.log("Floods: ", floodsData);
    eventsData = eventsData.concat(floodsData);

    //Sort events desc by date of occurence
    eventsData = eventsData.sort((e1, e2) => (new Date(e2.date) - new Date(e1.date)));
    console.log("All events: ", eventsData);

    document.getElementById("loader").style.display = "none";
    initMap()
    renderEventTable(1, eventsData)
    renderCounts()
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
        console.log('Get Events Data: ', data);

        const events = data.map(event => ({
            ...event,
            source: "Local authorities"
        }))

        return events;
    }

    return [];
}

async function getEarthquakesApi() {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=10')
    console.log('Response: ', response)
    
    const data = await response.json()
    console.log('Data: ', data)

    const earthquakes = data.features.map(event => {
        if (event.properties.mag < 2) {
            var code = 'yellow';
        } else if (event.properties.mag < 4) {
            var code = 'orange';
        } else {
            var code = 'red';
        }

        return {
            name: event.properties.title,
            status: 'completed',
            location: event.properties.place,
            category: 'earthquake',
            date: new Date(event.properties.time),
            timeOfOccurence: new Date(event.properties.time).toLocaleTimeString('en-UK'),
            dateOfOccurence: new Date(event.properties.time).toLocaleDateString('en-UK'),
            code: code,
            source: 'USGS Earthquake Catalog',
            mag: event.properties.mag,
            lat: event.geometry.coordinates[1],
            long: event.geometry.coordinates[0]
        }
    })

    return earthquakes;
}

async function getFloodsApi() {
    const response = await fetch('http://environment.data.gov.uk/flood-monitoring/id/floodAreas?_limit=10')
    
    const data = await response.json();

    const floods = data.items.map(event => {
        const random = Math.floor(Math.random() * 3);
        if (random == 0) {
            var code = 'yellow';
        } else if (random == 1) {
            var code = 'orange';
        } else {
            var code = 'red';
        }

        const utcDate = new Date().setUTCHours(0,0,0,0);

        return {
            name: event.label,
            status: 'pending',
            location: event.county,
            category: 'flood',
            date: new Date(utcDate),
            timeOfOccurence: new Date(utcDate).toLocaleTimeString('en-UK'),
            dateOfOccurence: new Date(utcDate).toLocaleDateString('en-UK'),
            code: code,
            source: 'Environment Agency Real Time Flood-Monitoring',
            lat: event.lat,
            long: event.long,
            riverOrSea: event.riverOrSea
        }
    });

    return floods;
}

function previousPage() {
    if (curPage > 1) {
        curPage--
        if (filterStatus === 'all') {
            renderEventTable(curPage, eventsData)
        }
        else if (filterStatus === 'new') {
            const newEvents = eventsData.filter(x => x.status === 'new')
            renderEventTable(curPage, newEvents)
        }
        else if (filterStatus === 'pending') {
            const pendingEvents = eventsData.filter(x => x.status === 'pending')
            renderEventTable(curPage, pendingEvents)
        }
        else if (filterStatus === 'completed') {
            const completedEvents = eventsData.filter(x => x.status === 'completed')
            renderEventTable(curPage, completedEvents)
        }
    }
}
  
function nextPage() {
    if ((curPage * pageSize) < eventsData.length) {
        curPage++
        if (filterStatus === 'all') {
            renderEventTable(curPage, eventsData)
        }
        else if (filterStatus === 'new') {
            const newEvents = eventsData.filter(x => x.status === 'new')
            renderEventTable(curPage, newEvents)
        }
        else if (filterStatus === 'pending') {
            const pendingEvents = eventsData.filter(x => x.status === 'pending')
            renderEventTable(curPage, pendingEvents)
        }
        else if (filterStatus === 'completed') {
            const completedEvents = eventsData.filter(x => x.status === 'completed')
            renderEventTable(curPage, completedEvents)
        }
    }
}

function numPages() {
    if (filterStatus === 'all') {
        return Math.ceil(eventsData.length / pageSize)
    }
    else if (filterStatus === 'new') {
        const newEvents = eventsData.filter(x => x.status === 'new')
        return Math.ceil(newEvents.length / pageSize)
    }
    else if (filterStatus === 'pending') {
        const pendingEvents = eventsData.filter(x => x.status === 'pending')
        return Math.ceil(pendingEvents.length / pageSize)
    }
    else if (filterStatus === 'completed') {
        const completedEvents = eventsData.filter(x => x.status === 'completed')
        return Math.ceil(completedEvents.length / pageSize)
    }
    
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function renderEventTable(page, eventsDataParam) {
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

    const events = JSON.parse(JSON.stringify(eventsDataParam)).filter((row, index) => {
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
                    <div class="elements--data__title">Category</div>
                    <div class="elements--data__value">${events[i].category}</div>
                    </div>
                </div>
                <div class="elements--details">
                        <div class="elements--data">
                        <div class="elements--data__title">Status</div>
                        <div class="elements--data__value">${events[i].status}</div>
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
    const completedEventsCount = eventsData.filter((obj) => obj.status === 'completed').length
    completedEvents.innerHTML = completedEventsCount

    const pendingEvents = document.getElementById('pendingEvents')
    const pendingEventsCount = eventsData.filter((obj) => obj.status === 'pending').length
    pendingEvents.innerHTML = pendingEventsCount

    const newEvents = document.getElementById('newEvents')
    const newEventsCount = eventsData.filter((obj) => obj.status === 'new').length
    newEvents.innerHTML = newEventsCount
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('eventsMap'), {
        center: {lat: 53.1424, lng: -27.6921},
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
    for (let i = 0; i < eventsData.length; i++) {
        if (eventsData[i].source === 'Environment Agency Real Time Flood-Monitoring') {
            const latlng = new google.maps.LatLng(eventsData[i].lat, eventsData[i].long)

            const marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: 'Click Me ' + i
            })

            google.maps.event.addListener(marker, 'click', function() {
                infowindow = new google.maps.InfoWindow({
                    content: 
                    `<div>Name: ${eventsData[i].name}</div>` +
                    `<div>Location: ${eventsData[i].location}</div>` +
                    `<div>Rivers/Seas: ${eventsData[i].riverOrSea}</div>` +
                    `<div>Source: ${eventsData[i].source}</div>`
                })
                infowindow.open(map, marker)
            })
        }
        else if (eventsData[i].source === 'USGS Earthquake Catalog') {
            const latlng = new google.maps.LatLng(eventsData[i].lat, eventsData[i].long)

            const marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: 'Click Me ' + i
            })

            google.maps.event.addListener(marker, 'click', function() {
                infowindow = new google.maps.InfoWindow({
                    content: 
                    `<div>Name: ${eventsData[i].name}</div>` +
                    `<div>Location: ${eventsData[i].location}</div>` +
                    `<div>Date of occurence: ${eventsData[i].dateOfOccurence}</div>` +
                    `<div>Time of occurence: ${eventsData[i].timeOfOccurence}</div>` +
                    `<div>Magnitude: ${eventsData[i].mag}</div>` +
                    `<div>Source: ${eventsData[i].source}</div>`
                })
                infowindow.open(map, marker)
            })
        }
        else {
            var geocoder = new google.maps.Geocoder()
            var address = eventsData[i].location

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
                        `<div>Name: ${eventsData[i].name}</div>` +
                        `<div>Location: ${eventsData[i].location}</div>` +
                        `<div>Date of occurence: ${eventsData[i].dateOfOccurence}</div>` +
                        `<div>Time of occurence: ${eventsData[i].timeOfOccurence}</div>` +
                        `<div>Category: ${eventsData[i].category}</div>` +
                        `<div>Code: ${eventsData[i].code}</div>` +
                        `<div>Status: ${eventsData[i].status}</div>`
                    })
                    infowindow.open(map, marker)
                })
            })
        }
    }
}

function filterByStatus(status) {
    if (status === 'all') {
        filterStatus = 'all'
        document.getElementById('allSelected').className = "filter--selected"
        document.getElementById('newSelected').className = "filter--not__selected"
        document.getElementById('pendingSelected').className = "filter--not__selected"
        document.getElementById('completedSelected').className = "filter--not__selected"
        renderEventTable(1, eventsData)
    }
    else if (status === 'new') {
        filterStatus = 'new'
        document.getElementById('allSelected').className =  "filter--not__selected"
        document.getElementById('newSelected').className =  "filter--selected"
        document.getElementById('pendingSelected').className = "filter--not__selected"
        document.getElementById('completedSelected').className = "filter--not__selected"
        const newEvents = eventsData.filter(x => x.status === 'new')
        renderEventTable(1, newEvents)
    }
    else if (status === 'pending') {
        filterStatus = 'pending'
        document.getElementById('allSelected').className = "filter--not__selected"
        document.getElementById('newSelected').className = "filter--not__selected"
        document.getElementById('pendingSelected').className = "filter--selected"
        document.getElementById('completedSelected').className = "filter--not__selected"
        const pendingEvents = eventsData.filter(x => x.status === 'pending')
        renderEventTable(1, pendingEvents)
    }
    else if (status === 'completed') {
        filterStatus = 'completed'
        document.getElementById('allSelected').className = "filter--not__selected"
        document.getElementById('newSelected').className = "filter--not__selected"
        document.getElementById('pendingSelected').className = "filter--not__selected"
        document.getElementById('completedSelected').className = "filter--selected"
        const completedEvents = eventsData.filter(x => x.status === 'completed')
        renderEventTable(1, completedEvents)
    }
}