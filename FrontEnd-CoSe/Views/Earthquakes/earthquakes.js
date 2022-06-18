const pageSize = 4
var curPage = 1

var earthquakes = []

async function onInitialized() {
    earthquakes = await getEarthquakesApi()

    initMap()
    renderEventTable(1)
    renderCounts()

    //LOADING PANEL
}

async function getEarthquakesApi() {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-06-17&endtime=2022-06-18')
    console.log('Response: ', response)
    
    const data = await response.json()
    console.log('Data: ', data)

    return data.features
}

function previousPage() {
    if (curPage > 1) {
        curPage--
        renderEventTable(curPage)
    }
}
  
function nextPage() {
    if ((curPage * pageSize) < earthquakes.length) {
        curPage++
        renderEventTable(curPage)
    }
}

function numPages() {
    return Math.ceil(earthquakes.length / pageSize)
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

    const events = JSON.parse(JSON.stringify(earthquakes)).filter((row, index) => {
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
                <div class="elements--data__value">${events[i].properties.title}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Date</div>
                <div class="elements--data__value">${new Date(events[i].properties.time).toLocaleDateString('en-UK')}</div>
                <div class="elements--data__value">${new Date(events[i].properties.time).toLocaleTimeString('en-UK')}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Location</div>
                <div class="elements--data__value">${events[i].properties.place}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Magnitude</div>
                <div class="elements--data__value">${events[i].properties.mag}</div>
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
    completedEvents.innerHTML = earthquakes.length

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
    for (let i = 0; i < earthquakes.length; i++) {
        const latlng = new google.maps.LatLng(earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0])

        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: 'Click Me ' + i
        })

        google.maps.event.addListener(marker, 'click', function() {
            infowindow = new google.maps.InfoWindow({
                content: 
                `<div>Name: ${earthquakes[i].properties.title}</div>` +
                `<div>Location: ${earthquakes[i].properties.place}</div>` +
                `<div>Date of occurence: ${new Date(earthquakes[i].properties.time).toLocaleDateString('en-UK')}</div>` +
                `<div>Time of occurence: ${new Date(earthquakes[i].properties.time).toLocaleTimeString('en-UK')}</div>` +
                `<div>Magnitude: ${earthquakes[i].properties.mag}</div>`
            })
            infowindow.open(map, marker)
        })
    }
}