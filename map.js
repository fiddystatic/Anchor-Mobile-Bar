import * as L from 'leaflet';

let googleMapsApiLoaded = false;
let googleMapsApiLoading = false;
//As provided below (Add your personal API key from Google Cloud Console: add - Geocoding API, Maps JavaScript API, and Places API)
const API_KEY = "AIzaSyBM8F2gXXiOXJQbW7JXPPtBI5KqPplrl3E"; // Replace with your actual API key or else map features will not work.

function loadGoogleMapsApi() {
    return new Promise((resolve, reject) => {
        if (googleMapsApiLoaded) {
            resolve();
            return;
        }
        if (googleMapsApiLoading) {
            // If already loading, wait for it to finish
            const interval = setInterval(() => {
                if (googleMapsApiLoaded) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
            return;
        }
        googleMapsApiLoading = true;
        
        window.initMap = () => {
            googleMapsApiLoaded = true;
            googleMapsApiLoading = false;
            resolve();
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            googleMapsApiLoading = false;
            reject(new Error('Failed to load Google Maps API.'));
        };
        document.head.appendChild(script);
    });
}

function initMapModal(onLocationConfirm) {
    const useMapBtn = document.getElementById('use-map-btn');
    const mapModal = document.getElementById('map-modal');
    const closeMapModalBtn = document.getElementById('close-map-modal-btn');
    const mapContainer = document.getElementById('map-container');
    const confirmLocationBtn = document.getElementById('confirm-location-btn');
    const selectedAddressDisplay = document.getElementById('selected-address-display');

    let map;
    let marker;
    let geocoder;
    let selectedAddress = '';
    const harareCoords = { lat: -17.8252, lng: 31.0335 }; // Default to Harare, Zimbabwe

    async function openModal() {
        mapModal.classList.add('open');
        try {
            await loadGoogleMapsApi();
            // Delay map initialization until the modal is visible to prevent sizing issues
            setTimeout(() => {
                if (!map) {
                    initializeMap();
                } else {
                    map.setCenter(harareCoords); // Recenter on open
                    askForLocation();
                }
            }, 150);
        } catch (error) {
            console.error(error);
            selectedAddressDisplay.textContent = "Could not load map.";
        }
    }

    function closeModal() {
        mapModal.classList.remove('open');
    }

    function askForLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
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
        if (map || !window.google) return;
        
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(mapContainer, {
            center: harareCoords,
            zoom: 13,
            disableDefaultUI: true,
            zoomControl: true,
        });

        marker = new google.maps.Marker({
            position: harareCoords,
            map: map,
            draggable: true
        });
        
        askForLocation();

        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            updateAddressFromMarker(position);
        });
        
        map.addListener('click', (e) => {
            updateMarkerPosition(e.latLng);
            updateAddressFromMarker(e.latLng);
        });
    }
    
    function updateMarkerPosition(latlng, zoom) {
        if (!map || !marker) return;
        marker.setPosition(latlng);
        if (zoom) {
            map.setZoom(zoom);
        }
        map.setCenter(latlng);
    }

    function updateAddressFromMarker(latlng) {
        if (!geocoder) return;
        selectedAddressDisplay.textContent = 'Fetching address...';
        geocoder.geocode({ 'location': latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    selectedAddress = results[0].formatted_address;
                    selectedAddressDisplay.textContent = `Selected: ${selectedAddress}`;
                } else {
                    selectedAddress = '';
                    selectedAddressDisplay.textContent = 'No address found for this location.';
                }
            } else {
                selectedAddress = '';
                selectedAddressDisplay.textContent = 'Geocoder failed due to: ' + status;
            }
        });
    }
    
    function confirmLocation() {
        if(selectedAddress){
            onLocationConfirm(selectedAddress);
            closeModal();
        } else {
            alert('Please select a valid location first.');
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
    confirmLocationBtn.addEventListener('click', confirmLocation);
}

export { initMapModal };