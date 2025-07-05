import * as L from 'leaflet';

function initMapModal(onLocationConfirm) {
    const useMapBtn = document.getElementById('use-map-btn');
    const mapModal = document.getElementById('map-modal');
    const closeMapModalBtn = document.getElementById('close-map-modal-btn');
    const mapContainer = document.getElementById('map-container');
    const searchInput = document.getElementById('map-search-input');
    const searchBtn = document.getElementById('map-search-btn');
    const confirmLocationBtn = document.getElementById('confirm-location-btn');

    let map;
    let marker;
    let geocodingDebounceTimer;

    const harareCoords = [-17.8252, 31.0335]; // Default to Harare, Zimbabwe

    function openModal() {
        mapModal.classList.add('open');
        // Delay map initialization until the modal is visible to prevent sizing issues
        setTimeout(() => {
            if (!map) {
                initializeMap();
            } else {
                map.invalidateSize();
                askForLocation();
            }
        }, 150);
    }

    function closeModal() {
        mapModal.classList.remove('open');
    }

    function askForLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
                updateMarkerPosition(userLatLng, 15);
                updateAddressFromMarker(userLatLng);
            }, () => {
                // User denied or error occurred, use default
                updateMarkerPosition(harareCoords, 13);
                updateAddressFromMarker(harareCoords);
            });
        } else {
            // Geolocation not available, use default
            updateMarkerPosition(harareCoords, 13);
            updateAddressFromMarker(harareCoords);
        }
    }

    function initializeMap() {
        if (map) return;
        
        map = L.map(mapContainer);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        marker = L.marker(harareCoords, {
            draggable: true
        }).addTo(map);
        
        askForLocation();

        marker.on('dragend', function(event) {
            const position = marker.getLatLng();
            updateAddressFromMarker(position);
        });
        
        map.on('click', function(e) {
            updateMarkerPosition(e.latlng);
            updateAddressFromMarker(e.latlng);
        });
    }
    
    function updateMarkerPosition(latlng, zoom) {
        if (!map || !marker) return;
        marker.setLatLng(latlng);
        if (zoom) {
            map.setView(latlng, zoom);
        } else {
            map.panTo(latlng);
        }
    }

    async function updateAddressFromMarker(latlng) {
        clearTimeout(geocodingDebounceTimer);
        geocodingDebounceTimer = setTimeout(async () => {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data && data.display_name) {
                    searchInput.value = data.display_name;
                }
            } catch (error) {
                console.error('Error reverse geocoding:', error);
            }
        }, 300); // Debounce to avoid too many requests while dragging
    }


    async function searchLocation() {
        const query = searchInput.value;
        if (!query) return;

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLatLng = L.latLng(lat, lon);
                updateMarkerPosition(newLatLng, 15);
            } else {
                alert('Location not found.');
            }
        } catch (error) {
            console.error('Error fetching from Nominatim:', error);
            alert('Could not perform search.');
        }
    }
    
    function confirmLocation() {
        const address = searchInput.value;
        if(address){
            onLocationConfirm(address);
            closeModal();
        } else {
            alert('Please select a location first.');
        }
    }


    // Event Listeners
    useMapBtn.addEventListener('click', openModal);
    closeMapModalBtn.addEventListener('click', closeModal);
    mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            closeModal();
        }
    });
    searchBtn.addEventListener('click', searchLocation);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocation();
        }
    });
    confirmLocationBtn.addEventListener('click', confirmLocation);
}

export { initMapModal };