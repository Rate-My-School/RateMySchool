
mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2bGl2ZSIsImEiOiJja2hreHNpN3AwdW8xMnhwZmNmemdjdWV0In0.CU-UA0lRN23uVgf3PuZnZA'



const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: schools.geometry.coordinates,
    zoom: 12
});


const marker1 = new mapboxgl.Marker()
.setLngLat(schools.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ closeOnClick: true, offset: 25, closeButton: false})
    .setHTML(`<h3>${schools.title}<h3/>`)
   

)
.addTo(map);


