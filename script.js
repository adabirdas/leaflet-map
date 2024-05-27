



var map = L.map('map').setView([ 22.9868, 87.8550], 4);

var currentTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// var wmsLayer = L.tileLayer.wms("https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms", {
//     layers: "lulc:WB_LULC50K_0506",
//     format: 'image/png',
//     transparent: true,
//     attribution: 'Your attribution'
// }).addTo(map);

// get osm hot
var osm_hot = document.querySelector("#osm-hot");

// click event for osm hot
osm_hot.addEventListener("click", () => {
    map.removeLayer(currentTileLayer); // Remove the current tile layer
    // map.removeLayer(wmsLayer);
    
    currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
    });
    currentTileLayer.addTo(map);

//     wmsLayer = L.tileLayer.wms("https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms", {
//     layers: "lulc:WB_LULC50K_0506",
//     format: 'image/png',
//     transparent: true,
//     attribution: 'Your attribution'
// }).addTo(map);

});
// get osm

var osm = document.querySelector("#osm");

// click event for osm 
osm.addEventListener("click", () => {
    map.removeLayer(currentTileLayer); // Remove the current tile layer
    // map.removeLayer(wmsLayer);
    currentTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    });
    currentTileLayer.addTo(map);

//     wmsLayer = L.tileLayer.wms("https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms", {
//     layers: "lulc:WB_LULC50K_0506",
//     format: 'image/png',
//     transparent: true,
//     attribution: 'Your attribution'
// }).addTo(map);

});



var topo = document.querySelector("#topo");

// click event for osm 
topo.addEventListener("click", () => {
    map.removeLayer(currentTileLayer); // Remove the current tile layer
    // map.removeLayer(wmsLayer);
    currentTileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    });
    currentTileLayer.addTo(map);

//     wmsLayer = L.tileLayer.wms("https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms", {
//     layers: "lulc:WB_LULC50K_0506",
//     format: 'image/png',
//     transparent: true,
//     attribution: 'Your attribution'
// }).addTo(map);

});
// this.currentTileLayer = L.tileLayer('https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', {
//     layers: 'mmerc:ISRO-Bhuvan',
//     format: 'image/jpeg',
//     transparent: false,
//     attribution: 'Bhuvan'
// }).addTo(this.map);



// click event for osm 

//     currentTileLayer.addTo(map);

//     wmsLayer = L.tileLayer.wms("https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms", {
//     layers: "lulc:WB_LULC50K_0506",
//     format: 'image/png',
//     transparent: true,
//     attribution: 'Your attribution'
// }).addTo(map);


// Define variables to store references to the marker and circle representing the user's location
var userMarker;
var userCircle;

// Define a variable to track whether the map is currently locating the user's position
var isLocating = false;

// location
var locationButton = document.querySelector("#location-button");

// Check if the button is found
if (locationButton) {
    // Add click event listener to the button
    locationButton.addEventListener("click", () => {
        if (!isLocating) {
            // If not currently locating, start location tracking
            map.locate({setView: true, maxZoom: 16, watch: true});

            // Set isLocating to true
            isLocating = true;

            // Define function to handle successful location
            function onLocationFound(e) {
                var radius = e.accuracy;

                // Remove previous user marker and circle, if any
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                if (userCircle) {
                    map.removeLayer(userCircle);
                }

                // Add marker at user's location with accuracy information
                userMarker = L.marker(e.latlng).addTo(map)
                    .bindPopup("You are within " + radius + " meters from this point").openPopup();

                // Add circle overlay representing the accuracy radius
                userCircle = L.circle(e.latlng, radius).addTo(map);
            }

            // Set up event listener for successful location
            map.on('locationfound', onLocationFound);

            // Define function to handle location errors
            function onLocationError(e) {
                // Show an alert with the error message
                alert("Error: " + e.message);
            }

            // Set up event listener for location errors
            map.on('locationerror', onLocationError);
        } else {
            // If currently locating, stop location tracking
            map.stopLocate();

            // Set isLocating to false
            isLocating = false;

            // Remove previous user marker and circle, if any
            if (userMarker) {
                map.removeLayer(userMarker);
                userMarker = null; // Reset reference
            }
            if (userCircle) {
                map.removeLayer(userCircle);
                userCircle = null; // Reset reference
            }

            console.log("Location tracking disabled.");
        }
    });
}









// Add GeoSearch control


// GeoSearch control
const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    style: 'button',
    searchLabel: 'Enter address',
    showMarker: true,
    marker: {
        icon: new L.Icon.Default(),
        draggable: false,
    },
    updateMap: true,
    autoClose: true,
    keepResult: true,
    position: 'topleft'
});

map.addControl(search);


// Function to display alert messages
function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-warning', 'fixed-top');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerText = message;
    document.body.appendChild(alertDiv);

    // Remove the alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}


let routingControl; // Declare routingControl here to be accessible in the scope

// Function to create a button
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

// Function to format latLng to sexagesimal
function waypointNameFallback(latLng) {
    function zeroPad(n) {
        n = Math.round(n);
        return n < 10 ? '0' + n : n;
    }

    function sexagesimal(p, pos, neg) {
        var n = Math.abs(p),
            degs = Math.floor(n),
            mins = (n - degs) * 60,
            secs = (mins - Math.floor(mins)) * 60,
            frac = Math.round((secs - Math.floor(secs)) * 100);
        return (n >= 0 ? pos : neg) + degs + '°' +
            zeroPad(mins) + '\'' +
            zeroPad(secs) + '.' + zeroPad(frac) + '"';
    }

    return sexagesimal(latLng.lat, 'N', 'S') + ' ' + sexagesimal(latLng.lng, 'E', 'W');
}

// Function to display alert messages
function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-warning');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerText = message;
    document.body.appendChild(alertDiv);

    // Remove the alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Add click event listener to the routing button
document.querySelector("#routing").addEventListener("click", (event) => {
    // Prevent click propagation to window
    event.stopPropagation();

    if (!routingControl) {
        // Initialize the routing control
        routingControl = L.Routing.control({
            waypoints: [],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim(),
            waypointNameFallback: waypointNameFallback
        }).addTo(map);

        showAlert("Routing control added! You can drag it also!");

        // Add map click event listener to set waypoints
        map.on('click', onMapClick);
    } else {
        // Remove the routing control if it is active
        map.off('click', onMapClick);
        map.removeControl(routingControl);
        routingControl = null; // Reset the control

        showAlert("Routing control turned OFF!");
    }
});

// Map click event handler to set waypoints
function onMapClick(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);

    // Attach event listeners to the buttons
    L.DomEvent.on(startBtn, 'click', function() {
        if (routingControl.getWaypoints().length === 0) {
            routingControl.spliceWaypoints(0, 0, e.latlng);
        } else {
            routingControl.spliceWaypoints(0, 1, e.latlng);
        }
        map.closePopup();
    });

    L.DomEvent.on(destBtn, 'click', function() {
        const waypointsLength = routingControl.getWaypoints().length;
        if (waypointsLength < 2) {
            routingControl.spliceWaypoints(waypointsLength, 0, e.latlng);
        } else {
            routingControl.spliceWaypoints(waypointsLength - 1, 1, e.latlng);
        }
        map.closePopup();
    });
}

// Add double-click event listener to hide routing control
window.addEventListener("dblclick", () => {
    // Check if routing control is added and visible
    if (routingControl && routingControl.getContainer().style.display !== 'none') {
        // Hide the routing control
        routingControl.getContainer().style.display = 'none';
    }
});



// for standalone

var standAlonesvgIconBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmktYmktcGVyc29uLXJhaXNlZC1oYW5kIiB2aWV3Qm94PSIwIDE2IDE2Ij4KICA8cGF0aCBkPSJNNiA2LjIwN3Y5LjA0M2EuNzUuNzUgMCAwIDAgMS41IDBWMTAuNWEuNS41IDAgMCAxIDEgMHY0Ljc1YS43NS43NSAwIDAgMCAxLjUgMHYtOC41YS4yNS4yNSAwIDEgMSAuNSAwVjkuNWEuNzUuNzUgMCAwIDAgMS41IDBWNi41YTMgMyAwIDAgMC0zLTNINi4yMzZhMSAxIDAgMCAxLS40NDctLjEwNmwtLjMzLS4xNjVBLjgzLjgzIDAgMCAxIDUgMi40ODhWLjc1YS43NS43NSAwIDAgMC0xLjUgMHYyLjA4M2MwIC43MTUuNDA0IDEuMzcgMS4wNDQgMS42ODlMNS41IDVjLjMyLjMyLjUuNzUuNSAxLjIwNyIvPgogIDxwYXRoIGQ9Ik04IDNhMS41IDEuNSAwIDEgMCAwLTMgMS41IDEuNSAwIDAgMCAwIDMiLz4KPC9zdmc+';

// Initialize map only if it's not already initialized


    var svgIcon = L.icon({
        iconUrl: standAlonesvgIconBase64,
        iconSize: [25, 25],
        className: 'custom-div-icon'
    });

    var markers = [];

    // Load markers positions from localStorage
    var markersPositions = JSON.parse(localStorage.getItem('markersPositions'));
    if (markersPositions) {
        markersPositions.forEach(function(position) {
            var marker = L.marker(position, { icon: svgIcon, draggable: true }).addTo(map);
            marker.bindPopup('I am here.');
            markers.push(marker);
            addMarkerEventListeners(marker);
        });
    }

    function addMarkerEventListeners(marker) {
        // Event listener for the marker's double click
        marker.on('dblclick', function(e) {
            map.removeLayer(marker); // Remove the marker from the map
            markers = markers.filter(function(m) {
                return m !== marker;
            });
            // Remove marker position from localStorage
            var markersPositions = markers.map(function(marker) {
                return marker.getLatLng();
            });
            localStorage.setItem('markersPositions', JSON.stringify(markersPositions));
        });

        // Event listener for marker dragend
        marker.on('dragend', function(e) {
            // Update markers positions in localStorage
            var markersPositions = markers.map(function(marker) {
                return marker.getLatLng();
            });
            localStorage.setItem('markersPositions', JSON.stringify(markersPositions));
        });
    }

    document.getElementById('standAlone').addEventListener('click', function() {
        map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
        
        var marker = L.marker([22.5726, 88.3639], {
            icon: svgIcon,
            draggable: true
        }).addTo(map)
        .bindPopup('I am here.')
        .openPopup();

        markers.push(marker); // Add the new marker to the markers array
        addMarkerEventListeners(marker);

        // Save markers positions to localStorage
        var markersPositions = markers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('markersPositions', JSON.stringify(markersPositions));

        // Show alert
        document.getElementById('alertMessage').style.display = 'block';

        // Hide alert after 3 seconds
        setTimeout(function() {
            document.getElementById('alertMessage').style.display = 'none';
        }, 3000);
    });


    


// for building


var svgIconbuilding = L.icon({
    iconUrl: "workplace.png",
    iconSize: [30, 30],
    className: 'custom-div-icon'
});

var buildingMarkers = [];

// Load markers positions from localStorage
var buildingMarkersPositions = JSON.parse(localStorage.getItem('buildingMarkersPositions'));
if (buildingMarkersPositions) {
    buildingMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: svgIconbuilding, draggable: true }).addTo(map);
        marker.bindPopup('Work place.');
        buildingMarkers.push(marker);
        addBuildingMarkerEventListeners(marker);
    });
}

function addBuildingMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        buildingMarkers = buildingMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var buildingMarkersPositions = buildingMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('buildingMarkersPositions', JSON.stringify(buildingMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var buildingMarkersPositions = buildingMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('buildingMarkersPositions', JSON.stringify(buildingMarkersPositions));
    });
}

document.getElementById('building').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: svgIconbuilding,
        draggable: true
    }).addTo(map)
    .bindPopup('Work place.')
    .openPopup();

    buildingMarkers.push(marker); // Add the new marker to the markers array
    addBuildingMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var buildingMarkersPositions = buildingMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('buildingMarkersPositions', JSON.stringify(buildingMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});


// for bus stop 

var busstopsvgIconbuilding = L.icon({
    iconUrl: "busstop.png",
    iconSize: [25, 25],
    className: 'custom-div-icon'
});

var busStopMarkers = [];

// Load markers positions from localStorage
var busStopMarkersPositions = JSON.parse(localStorage.getItem('busStopMarkersPositions'));
if (busStopMarkersPositions) {
    busStopMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: busstopsvgIconbuilding, draggable: true }).addTo(map);
        marker.bindPopup('Bus Stop.');
        busStopMarkers.push(marker);
        addBusStopMarkerEventListeners(marker);
    });
}

function addBusStopMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        busStopMarkers = busStopMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var busStopMarkersPositions = busStopMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('busStopMarkersPositions', JSON.stringify(busStopMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var busStopMarkersPositions = busStopMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('busStopMarkersPositions', JSON.stringify(busStopMarkersPositions));
    });
}

document.getElementById('busstop').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: busstopsvgIconbuilding,
        draggable: true
    }).addTo(map)
    .bindPopup('Bus Stop.')
    .openPopup();

    busStopMarkers.push(marker); // Add the new marker to the markers array
    addBusStopMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var busStopMarkersPositions = busStopMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('busStopMarkersPositions', JSON.stringify(busStopMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});
// ev charging stataion
var evsvgIconbuilding = L.icon({
    iconUrl: "ev.webp",
    iconSize: [25, 25],
    className: 'custom-div-icon'
});

var evMarkers = [];

// Load markers positions from localStorage
var evMarkersPositions = JSON.parse(localStorage.getItem('evMarkersPositions'));
if (evMarkersPositions) {
    evMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: evsvgIconbuilding, draggable: true }).addTo(map);
        marker.bindPopup('EV Charging Station.');
        evMarkers.push(marker);
        addEvMarkerEventListeners(marker);
    });
}

function addEvMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        evMarkers = evMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var evMarkersPositions = evMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('evMarkersPositions', JSON.stringify(evMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var evMarkersPositions = evMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('evMarkersPositions', JSON.stringify(evMarkersPositions));
    });
}

document.getElementById('ev').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: evsvgIconbuilding,
        draggable: true
    }).addTo(map)
    .bindPopup('EV Charging Station.')
    .openPopup();

    evMarkers.push(marker); // Add the new marker to the markers array
    addEvMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var evMarkersPositions = evMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('evMarkersPositions', JSON.stringify(evMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});

// for mall
var svgMall = L.icon({
    iconUrl: "mall.png",
    iconSize: [30, 30],
    className: 'custom-div-icon'
});

var mallMarkers = [];

// Load mall markers positions from localStorage
var mallMarkersPositions = JSON.parse(localStorage.getItem('mallMarkersPositions'));
if (mallMarkersPositions) {
    mallMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: svgMall, draggable: true }).addTo(map);
        marker.bindPopup('Mall.');
        mallMarkers.push(marker);
        addMallMarkerEventListeners(marker);
    });
}

function addMallMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        mallMarkers = mallMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var mallMarkersPositions = mallMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('mallMarkersPositions', JSON.stringify(mallMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var mallMarkersPositions = mallMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('mallMarkersPositions', JSON.stringify(mallMarkersPositions));
    });
}

document.getElementById('mall').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: svgMall,
        draggable: true
    }).addTo(map)
    .bindPopup('Mall.')
    .openPopup();

    mallMarkers.push(marker); // Add the new marker to the markers array
    addMallMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var mallMarkersPositions = mallMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('mallMarkersPositions', JSON.stringify(mallMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});

var fuel = L.icon({
    iconUrl: "petrol pump.png",
    iconSize: [25, 25],
    className: 'custom-div-icon'
});

var fuelMarkers = [];

// Load fuel markers positions from localStorage
var fuelMarkersPositions = JSON.parse(localStorage.getItem('fuelMarkersPositions'));
if (fuelMarkersPositions) {
    fuelMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: fuel, draggable: true }).addTo(map);
        marker.bindPopup('Fuel Station.');
        fuelMarkers.push(marker);
        addFuelMarkerEventListeners(marker);
    });
}

function addFuelMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        fuelMarkers = fuelMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var fuelMarkersPositions = fuelMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('fuelMarkersPositions', JSON.stringify(fuelMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var fuelMarkersPositions = fuelMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('fuelMarkersPositions', JSON.stringify(fuelMarkersPositions));
    });
}

document.getElementById('fuel').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: fuel,
        draggable: true
    }).addTo(map)
    .bindPopup('Fuel Station.')
    .openPopup();

    fuelMarkers.push(marker); // Add the new marker to the markers array
    addFuelMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var fuelMarkersPositions = fuelMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('fuelMarkersPositions', JSON.stringify(fuelMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});

var svghospitalicon = L.icon({
    iconUrl: "hospital.png",
    iconSize: [30, 30],
    className: 'custom-div-icon'
});

var hospitalMarkers = [];

// Load hospital markers positions from localStorage
var hospitalMarkersPositions = JSON.parse(localStorage.getItem('hospitalMarkersPositions'));
if (hospitalMarkersPositions) {
    hospitalMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: svghospitalicon, draggable: true }).addTo(map);
        marker.bindPopup('Hospital.');
        hospitalMarkers.push(marker);
        addHospitalMarkerEventListeners(marker);
    });
}

function addHospitalMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        hospitalMarkers = hospitalMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var hospitalMarkersPositions = hospitalMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('hospitalMarkersPositions', JSON.stringify(hospitalMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var hospitalMarkersPositions = hospitalMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('hospitalMarkersPositions', JSON.stringify(hospitalMarkersPositions));
    });
}

document.getElementById('hospital').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: svghospitalicon,
        draggable: true
    }).addTo(map)
    .bindPopup('Hospital.')
    .openPopup();

    hospitalMarkers.push(marker); // Add the new marker to the markers array
    addHospitalMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var hospitalMarkersPositions = hospitalMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('hospitalMarkersPositions', JSON.stringify(hospitalMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});

var home = L.icon({
    iconUrl: "home.png",
    iconSize: [25, 25],
    className: 'custom-div-icon'
});

var homeMarkers = [];

// Load home markers positions from localStorage
var homeMarkersPositions = JSON.parse(localStorage.getItem('homeMarkersPositions'));
if (homeMarkersPositions) {
    homeMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: home, draggable: true }).addTo(map);
        marker.bindPopup('Home.');
        homeMarkers.push(marker);
        addHomeMarkerEventListeners(marker);
    });
}

function addHomeMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        homeMarkers = homeMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var homeMarkersPositions = homeMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('homeMarkersPositions', JSON.stringify(homeMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var homeMarkersPositions = homeMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('homeMarkersPositions', JSON.stringify(homeMarkersPositions));
    });
}

document.getElementById('home').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: home,
        draggable: true
    }).addTo(map)
    .bindPopup('Home.')
    .openPopup();

    homeMarkers.push(marker); // Add the new marker to the markers array
    addHomeMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var homeMarkersPositions = homeMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('homeMarkersPositions', JSON.stringify(homeMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});
// for train station

var train = L.icon({
    iconUrl: "train station.png",
    iconSize: [25, 25],
    className: 'custom-div-icon'
});

var trainMarkers = [];

// Load train markers positions from localStorage
var trainMarkersPositions = JSON.parse(localStorage.getItem('trainMarkersPositions'));
if (trainMarkersPositions) {
    trainMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: train, draggable: true }).addTo(map);
        marker.bindPopup('Train Station.');
        trainMarkers.push(marker);
        addTrainMarkerEventListeners(marker);
    });
}

function addTrainMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        trainMarkers = trainMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var trainMarkersPositions = trainMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('trainMarkersPositions', JSON.stringify(trainMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var trainMarkersPositions = trainMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('trainMarkersPositions', JSON.stringify(trainMarkersPositions));
    });
}

document.getElementById('train').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: train,
        draggable: true
    }).addTo(map)
    .bindPopup('Train Station.')
    .openPopup();

    trainMarkers.push(marker); // Add the new marker to the markers array
    addTrainMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var trainMarkersPositions = trainMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('trainMarkersPositions', JSON.stringify(trainMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});

// FOR TOUR
var tour = L.icon({
    iconUrl: "tour.png",
    iconSize: [16, 16],
    className: 'custom-div-icon'
});

var tourMarkers = [];

// Load tour markers positions from localStorage
var tourMarkersPositions = JSON.parse(localStorage.getItem('tourMarkersPositions'));
if (tourMarkersPositions) {
    tourMarkersPositions.forEach(function(position) {
        var marker = L.marker(position, { icon: tour, draggable: true }).addTo(map);
        marker.bindPopup('Tourist Spot.');
        tourMarkers.push(marker);
        addTourMarkerEventListeners(marker);
    });
}

function addTourMarkerEventListeners(marker) {
    // Event listener for the marker's double click
    marker.on('dblclick', function(e) {
        map.removeLayer(marker); // Remove the marker from the map
        tourMarkers = tourMarkers.filter(function(m) {
            return m !== marker;
        });
        // Remove marker position from localStorage
        var tourMarkersPositions = tourMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('tourMarkersPositions', JSON.stringify(tourMarkersPositions));
    });

    // Event listener for marker dragend
    marker.on('dragend', function(e) {
        // Update markers positions in localStorage
        var tourMarkersPositions = tourMarkers.map(function(marker) {
            return marker.getLatLng();
        });
        localStorage.setItem('tourMarkersPositions', JSON.stringify(tourMarkersPositions));
    });
}

document.getElementById('tour').addEventListener('click', function() {
    map.setView([22.5726, 88.3639], 16); // Set the view to Kolkata with zoom level 16
    
    var marker = L.marker([22.5726, 88.3639], {
        icon: tour,
        draggable: true
    }).addTo(map)
    .bindPopup('Tourist Spot.')
    .openPopup();

    tourMarkers.push(marker); // Add the new marker to the markers array
    addTourMarkerEventListeners(marker);

    // Save markers positions to localStorage
    var tourMarkersPositions = tourMarkers.map(function(marker) {
        return marker.getLatLng();
    });
    localStorage.setItem('tourMarkersPositions', JSON.stringify(tourMarkersPositions));

    // Show alert
    document.getElementById('alertMessage').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function() {
        document.getElementById('alertMessage').style.display = 'none';
    }, 3000);
});

// distance measures

var measureControl = new L.Control.Measure({
    position: 'topleft',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'sqkilometers'
});

measureControl.addTo(map);

// add polygon
       


// FeatureGroup is to store editable layers
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialize the draw control and pass it the FeatureGroup of editable layers
const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
        circlemarker: false // disable circlemarker if not needed
    }
});
map.addControl(drawControl);

// Event listener for creating new shapes
map.on('draw:created', function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);

    if (event.layerType === 'marker') {
        layer.bindPopup('A popup!');
    }

    console.log(`Created shape: ${event.layerType}`, layer);
});

// Event listener for editing shapes
map.on('draw:edited', function (event) {
    const layers = event.layers;
    layers.eachLayer(function (layer) {
        console.log('Edited shape', layer);
    });
});

// Event listener for deleting shapes
map.on('draw:deleted', function (event) {
    const layers = event.layers;
    layers.eachLayer(function (layer) {
        console.log('Deleted shape', layer);
    });
});

map.on('click', function (e) {
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polyline || layer instanceof L.Polygon) {
            const latlngs = layer.getLatLngs();
            if (latlngs.length > 0) {
                // Calculate distance from clicked point to each vertex
                const distance = e.latlng.distanceTo(latlngs[0]); // Considering only the first set of latlngs

                // Display distance in a popup
                layer.bindPopup(`Distance: ${distance.toFixed(2)} meters`).openPopup();
            }
        }
    });
})

// dropdown lulc event

// Accessing each dropdown item individually
var andhraPradesh = document.querySelectorAll('.dropdown-item')[0].textContent;
var arunachalPradesh = document.querySelectorAll('.dropdown-item')[1].textContent;
var assam = document.querySelectorAll('.dropdown-item')[2].textContent;
var bihar = document.querySelectorAll('.dropdown-item')[3].textContent;
var chhattisgarh = document.querySelectorAll('.dropdown-item')[4].textContent;
var goa = document.querySelectorAll('.dropdown-item')[5].textContent;
var gujarat = document.querySelectorAll('.dropdown-item')[6].textContent;
var haryana = document.querySelectorAll('.dropdown-item')[7].textContent;
var himachalPradesh = document.querySelectorAll('.dropdown-item')[8].textContent;
var jharkhand = document.querySelectorAll('.dropdown-item')[9].textContent;
var karnataka = document.querySelectorAll('.dropdown-item')[10].textContent;
var kerala = document.querySelectorAll('.dropdown-item')[11].textContent;
var madhyaPradesh = document.querySelectorAll('.dropdown-item')[12].textContent;
var maharashtra = document.querySelectorAll('.dropdown-item')[13].textContent;
var manipur = document.querySelectorAll('.dropdown-item')[14].textContent;
var meghalaya = document.querySelectorAll('.dropdown-item')[15].textContent;
var mizoram = document.querySelectorAll('.dropdown-item')[16].textContent;
var nagaland = document.querySelectorAll('.dropdown-item')[17].textContent;
var odisha = document.querySelectorAll('.dropdown-item')[18].textContent;
var punjab = document.querySelectorAll('.dropdown-item')[19].textContent;
var rajasthan = document.querySelectorAll('.dropdown-item')[20].textContent;
var sikkim = document.querySelectorAll('.dropdown-item')[21].textContent;
var tamilNadu = document.querySelectorAll('.dropdown-item')[22].textContent;
var telangana = document.querySelectorAll('.dropdown-item')[23].textContent;
var tripura = document.querySelectorAll('.dropdown-item')[24].textContent;
var uttarPradesh = document.querySelectorAll('.dropdown-item')[25].textContent;
var uttarakhand = document.querySelectorAll('.dropdown-item')[26].textContent;
var westBengal = document.querySelectorAll('.dropdown-item')[27].textContent;
var andamanNicobar = document.querySelectorAll('.dropdown-item')[28].textContent;
var chandigarh = document.querySelectorAll('.dropdown-item')[29].textContent;
var dadraNagarDamanDiu = document.querySelectorAll('.dropdown-item')[30].textContent;
var delhi = document.querySelectorAll('.dropdown-item')[31].textContent;
var lakshadweep = document.querySelectorAll('.dropdown-item')[32].textContent;
var puducherry = document.querySelectorAll('.dropdown-item')[33].textContent;
var ladakh = document.querySelectorAll('.dropdown-item')[34].textContent;
var jammuKashmir = document.querySelectorAll('.dropdown-item')[35].textContent;

// Define WMS layer information for each state
var wmsLayers = {
    'Andhra Pradesh': {
        layer: 'lulc:AP_LULC50K_1516',
        extent: [79.5, 12.5, 85.5, 20.5] // Adjust the extent as per your data
    },
    'Arunachal Pradesh': {
        layer: 'lulc:AR_LULC50K_1516',
        extent: [91.0, 26.0, 97.5, 30.0] // Adjust the extent as per your data
    },
    'Assam': {
        layer: 'lulc:AS_LULC50K_1516',
        extent: [89.5, 24.0, 96.0, 28.5] // Adjust the extent as per your data
    },
    'Bihar': {
        layer: 'lulc:BR_LULC50K_1516',
        extent: [83.0, 23.5, 88.0, 27.5] // Adjust the extent as per your data
    },
    'Chhattisgarh': {
        layer: 'lulc:CG_LULC50K_1516',
        extent: [80.5, 17.5, 86.0, 23.0] // Adjust the extent as per your data
    },
    'Goa': {
        layer: 'lulc:GA_LULC50K_1516',
        extent: [73.5, 14.0, 75.5, 16.5] // Adjust the extent as per your data
    },
    'Gujarat': {
        layer: 'lulc:GJ_LULC50K_1516',
        extent: [68.5, 20.5, 75.0, 24.0] // Adjust the extent as per your data
    },
    'Haryana': {
        layer: 'lulc:HR_LULC50K_1516',
        extent: [75.5, 28.0, 78.0, 31.5] // Adjust the extent as per your data
    },
    'Himachal Pradesh': {
        layer: 'lulc:HP_LULC50K_1516',
        extent: [76.5, 30.0, 79.5, 33.5] // Adjust the extent as per your data
    },
    'Jharkhand': {
        layer: 'lulc:JH_LULC50K_1516',
        extent: [83.0, 20.0, 87.5, 24.5] // Adjust the extent as per your data
    },
    'Karnataka': {
        layer: 'lulc:KA_LULC50K_1516',
        extent: [74.5, 11.5, 77.5, 18.0] // Adjust the extent as per your data
    },
    'Kerala': {
        layer: 'lulc:KL_LULC50K_1516',
        extent: [75.0, 8.0, 78.5, 12.5] // Adjust the extent as per your data
    },
    'Madhya Pradesh': {
        layer: 'lulc:MP_LULC50K_1516',
        extent: [74.5, 20.5, 82.0, 26.5] // Adjust the extent as per your data
    },
    'Maharashtra': {
        layer: 'lulc:MH_LULC50K_1516',
        extent: [72.0, 15.0, 79.5, 22.0] // Adjust the extent as per your data
    },
    'Manipur': {
        layer: 'lulc:MN_LULC50K_1516',
        extent: [92.5, 23.0, 95.5, 25.5] // Adjust the extent as per your data
    },
    'Meghalaya': {
        layer: 'lulc:ML_LULC50K_1516',
        extent: [89.5, 25.0, 92.0, 26.5] // Adjust the extent as per your data
    },
    'Mizoram': {
        layer: 'lulc:MZ_LULC50K_1516',
        extent: [91.0, 20.0, 94.0, 24.0] // Adjust the extent as per your data
    },
    'Nagaland': {
        layer: 'lulc:NL_LULC50K_1516',
        extent: [92.5, 25.0, 96.0, 27.5] // Adjust the extent as per your data
    },
    'Odisha': {
        layer: 'lulc:OD_LULC50K_1516',
        extent: [81.0, 16.0, 87.0, 22.0] // Adjust the extent as per your data
    },
    'Punjab': {
        layer: 'lulc:PB_LULC50K_1516',
        extent: [73.5, 29.5, 77.5, 32.5] // Adjust the extent as per your data
    },
    'Rajasthan': {
        layer: 'lulc:RJ_LULC50K_1516',
        extent: [68.0, 23.5, 75.0, 30.5] // Adjust the extent as per your data
    },
    'Sikkim': {
        layer: 'lulc:SK_LULC50K_1516',
        extent: [87.0, 26.5, 89.5, 28.5] // Adjust the extent as per your data
    },
    'Tamil Nadu': {
        layer: 'lulc:TN_LULC50K_1516',
        extent: [76.0, 8.0, 80.5, 13.5] // Adjust the extent as per your data
    },
    'Telangana': {
        layer: 'lulc:TS_LULC50K_1516',
        extent: [77.0, 16.5, 81.5, 20.5] // Adjust the extent as per your data
    },
    'Tripura': {
        layer: 'lulc:TR_LULC50K_1516',
        extent: [91.0, 23.5, 94.0, 25.5] // Adjust the extent as per your data
    },
    'Uttar Pradesh': {
        layer: 'lulc:UP_LULC50K_1516',
        extent: [77.5, 25.0, 84.0, 31.5] // Adjust the extent as per your data
    },
    'Uttarakhand': {
        layer: 'lulc:UK_LULC50K_1516',
        extent: [77.0, 29.0, 80.5, 31.5] // Adjust the extent as per your data
    },
    'West Bengal': {
        layer: 'lulc:WB_LULC50K_1516',
        extent: [85.5, 20.5, 89.5, 27.0] // Adjust the extent as per your data
    },
    'Andaman and Nicobar Islands': {
        layer: 'lulc:AN_LULC50K_1516',
        extent: [92.208, 6.758, 93.948, 13.676] // Adjust the extent as per your data
    },
    'Chandigarh': {
        layer: 'lulc:CH_LULC50K_1516',
        extent: [76.4, 30.6, 76.9, 30.9] // Adjust the extent as per your data
    },
    'Dadra and Nagar Haveli and Daman and Diu': {
        layer: 'lulc:DD_LULC50K_1516',
        extent: [72.5, 20.0, 73.3, 20.5] // Adjust the extent as per your data
    },
    'Delhi': {
        layer: 'lulc:DL_LULC50K_1516',
        extent: [76.8, 28.4, 77.3, 28.9] // Adjust the extent as per your data
    },
    'Lakshadweep': {
        layer: 'lulc:LD_LULC50K_1516',
        extent: [71.1, 8.0, 74.4, 12.3] // Adjust the extent as per your data
    },
    'Puducherry': {
        layer: 'lulc:PY_LULC50K_1516',
        extent: [78.9, 11.9, 79.8, 12.3] // Adjust the extent as per your data
    },
    'Ladakh': {
        layer: 'lulc:LA_LULC50K_1516',
        extent: [76.5, 33.5, 79.0, 35.5] // Adjust the extent as per your data
    },
    'Jammu and Kashmir': {
        layer: 'lulc:JK_LULC50K_1516',
        extent: [73.5, 32.5, 77.5, 37.5] // Adjust the extent as per your data
    }
};




// Function to add WMS layer to the map
function addWMSToMap(state) {
    var layerInfo = wmsLayers[state];
    if (layerInfo) {
        var wmsLayer = L.tileLayer.wms('https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', {
            layers: layerInfo.layer,
            format: 'image/png',
            transparent: true,
            version: '1.1.1',
            crs: L.CRS.EPSG4326, // Coordinate reference system
            attribution: 'Bhuvan - NRSC'
        }).addTo(map);
        map.fitBounds(layerInfo.extent); // Fit map to the extent of the state
    } else {
        console.error('State not found');
    }
}

// Get all dropdown items
var dropdownItems = document.querySelectorAll('.dropdown-item');

// Function to handle dropdown item click
function dropdownItemClickHandler(index) {
    var state = dropdownItems[index].textContent;
    addWMSToMap(state);
}

// Attach click event listeners to each dropdown item


dropdownItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
        dropdownItemClickHandler(index);


         


      
    });
});;


// print

L.control.browserPrint({
    position: 'topleft',
    title: 'Print map',
   
  }).addTo(map);


  //cordinates
  L.control.coordinates({
    position: "bottomleft", // Optional default position, "bootomright" by default
    decimals: 6, // Optional coordinate digits (default is 4)
    decimalSeperator: ".", // Optional decimal separator character (default is ".")
    labelTemplateLat: "Latitude: {y}", // Optional label templates, "{y}" will be replaced with latitude
    labelTemplateLng: "Longitude: {x}", // Optional label templates, "{x}" will be replaced with longitude
    enableUserInput: false, // Optional: If true, the user can input coordinates directly into the control
    useDMS: false, // Optional: If true, show coordinates in Degrees, Minutes, Seconds
    useLatLngOrder: true // Optional: If true, show coordinates in the format (lat, lng). If false, show coordinates in the format (lng, lat)
}).addTo(map);

// scale
L.control.scale({
    position: 'bottomleft', // Position of the scale control
    maxWidth: 100, // Maximum width of the scale bar in pixels
    metric: true, // Display the scale in metric units
    imperial: false // Do not display the scale in imperial units
}).addTo(map);

  









