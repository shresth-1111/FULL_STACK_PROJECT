if (!coordinates) {
    console.log("No coordinates available");
}
    
let lng = coordinates[0];
let lat = coordinates[1];

var map = L.map('map').setView([lat, lng], 13);   //Starting position [lat,long]
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

L.marker([lat,lng]).addTo(map);
L.popup().setLatLng([lat,lng])
.setContent('<p>Exact location will be sent after booking</p>')
.openOn(map);