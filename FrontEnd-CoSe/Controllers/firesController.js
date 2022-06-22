const pageSize = 5
var curPage = 1
var eventsData = []
var filterStatus = 'all'

async function onInitialized() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("firesComponent").style.display = "block";
    
    //Initialize NavBar
    initializeNavbar(userData);

    eventsData = await getEvents();

    document.getElementById("loader").style.display = "none";
    initMap();
    renderEventTable(1, eventsData);
    renderCounts();
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

        const fires = data.filter(x => x.category === "fire");

        return fires;
    }

    return [];
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
                    <div class="elements--data__title">Code</div>
                    <div class="elements--data__value">${events[i].code}</div>
                    </div>
                </div>
                <div class="elements--details">
                    <div class="elements--data">
                    <div class="elements--data__title">Status</div>
                    <div class="elements--data__value">${events[i].status}</div>
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
        center: {lat: 46.039663, lng: 25.096306},
        zoom:6
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
        var geocoder = new google.maps.Geocoder()
        var address = eventsData[i].location

        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat()
            var longitude = results[0].geometry.location.lng()
            }

            var latlng = new google.maps.LatLng(latitude, longitude)
            
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