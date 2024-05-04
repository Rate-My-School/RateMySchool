
mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2bGl2ZSIsImEiOiJja2hreHNpN3AwdW8xMnhwZmNmemdjdWV0In0.CU-UA0lRN23uVgf3PuZnZA'



const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [12.550343, 55.665957],
    zoom: 8
});


const marker1 = new mapboxgl.Marker()
.setLngLat([12.554729, 55.70651])
.addTo(map);
