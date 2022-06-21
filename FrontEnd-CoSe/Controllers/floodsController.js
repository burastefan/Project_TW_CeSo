const pageSize = 4
var curPage = 1

var floods = []

async function onInitialized() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("floodsComponent").style.display = "block";
    
    //Initialize NavBar
    initializeNavbar(userData);

    floods = await getFloodsApi()

    initMap()
    renderEventTable(1)
    //renderCounts()
}

async function getFloodsApi() {
    const response = await fetch('http://environment.data.gov.uk/flood-monitoring/id/floodAreas')
    console.log('Response: ', response)
    
    const data = await response.json()
    console.log('Data: ', data)

    return data.items
}

function previousPage() {
    if (curPage > 1) {
        curPage--
        renderEventTable(curPage)
    }
}
  
function nextPage() {
    if ((curPage * pageSize) < floods.length) {
        curPage++
        renderEventTable(curPage)
    }
}

function numPages() {
    return Math.ceil(floods.length / pageSize)
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

    const events = JSON.parse(JSON.stringify(floods)).filter((row, index) => {
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
                <div class="elements--data__value">${events[i].label}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Location</div>
                <div class="elements--data__value">${events[i].county}</div>
                </div>
            </div>
            <div class="elements--details">
                <div class="elements--data">
                <div class="elements--data__title">Rivers/Seas</div>
                <div class="elements--data__value">${events[i].riverOrSea}</div>
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
    completedEvents.innerHTML = floods.length

    const pendingEvents = document.getElementById('pendingEvents')
    pendingEvents.innerHTML = 0

    const newEvents = document.getElementById('newEvents')
    newEvents.innerHTML = 0
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('eventsMap'), {
        center: {lat: 52.408054, lng: -1.510556},
        zoom: 7
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
    for (let i = 0; i < floods.length; i++) {
        const latlng = new google.maps.LatLng(floods[i].lat, floods[i].long)

        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: 'Click Me ' + i
        })

        google.maps.event.addListener(marker, 'click', function() {
            infowindow = new google.maps.InfoWindow({
                content: 
                `<div>Name: ${floods[i].label}</div>` +
                `<div>Location: ${floods[i].county}</div>` +
                `<div>Rivers/Seas: ${floods[i].riverOrSea}</div>`
            })
            infowindow.open(map, marker)
        })
    }
}