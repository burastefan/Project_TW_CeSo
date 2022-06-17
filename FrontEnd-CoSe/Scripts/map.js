// Initialize and add the map
async function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.151726, lng: 27.587914},
        zoom: 8
    });

    var input = document.getElementById('searchInput')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

    var autocomplete = new google.maps.places.Autocomplete(input)
    autocomplete.bindTo('bounds', map)

    var infowindow = new google.maps.InfoWindow()
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    })
   

    autocomplete.addListener('place_changed', function() {
        infowindow.close()
        marker.setVisible(false)
        var place = autocomplete.getPlace()

        var geocoder = new google.maps.Geocoder()
        var address = place.address_components[0].long_name

        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat()
                var longitude = results[0].geometry.location.lng()
            }

            var latlng = new google.maps.LatLng(latitude, longitude)
            marker.setPosition(latlng)
            marker.setVisible(true)
        })

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
}
