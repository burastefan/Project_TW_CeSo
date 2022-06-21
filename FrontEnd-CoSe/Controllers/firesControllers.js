async function onInitialized() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("firesComponent").style.display = "block";
    
    //Initialize NavBar
    initializeNavbar(userData);

    initMap();
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
    // for (let i = 0; i < earthquakes.length; i++) {
    //     const latlng = new google.maps.LatLng(earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0])

    //     const marker = new google.maps.Marker({
    //         position: latlng,
    //         map: map,
    //         title: 'Click Me ' + i
    //     })

    //     google.maps.event.addListener(marker, 'click', function() {
    //         infowindow = new google.maps.InfoWindow({
    //             content: 
    //             `<div>Name: ${earthquakes[i].properties.title}</div>` +
    //             `<div>Location: ${earthquakes[i].properties.place}</div>` +
    //             `<div>Date of occurence: ${new Date(earthquakes[i].properties.time).toLocaleDateString('en-UK')}</div>` +
    //             `<div>Time of occurence: ${new Date(earthquakes[i].properties.time).toLocaleTimeString('en-UK')}</div>` +
    //             `<div>Magnitude: ${earthquakes[i].properties.mag}</div>`
    //         })
    //         infowindow.open(map, marker)
    //     })
    // }
}