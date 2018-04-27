import Observer from '../base/Observer'

class GoogleMapsAPIClass extends Observer {
	constructor() {
		super()
		this.ready = false
		this.lat = 43.6477
		this.lng = -79.4007
		this.styles = [
			{
				elementType: 'geometry',
				stylers: [{
					color: '#f5f5f5'
				}]
			},
			{
				elementType: 'labels.icon',
				stylers: [{
					visibility: 'off'
				}]
			},
			{
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#616161'
				}]
			},
			{
				elementType: 'labels.text.stroke',
				stylers: [{
					color: '#f5f5f5'
				}]
			},
			{
				featureType: 'administrative.land_parcel',
				elementType: 'labels',
				stylers: [{
					visibility: 'off'
				}]
			},
			{
				featureType: 'administrative.land_parcel',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#bdbdbd'
				}]
			},
			{
				featureType: 'poi',
				elementType: 'geometry',
				stylers: [{
					color: '#eeeeee'
				}]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text',
				stylers: [{
					visibility: 'off'
				}]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#757575'
				}]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [{
					color: '#e5e5e5'
				}]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#9e9e9e'
				}]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{
					color: '#ffffff'
				}]
			},
			{
				featureType: 'road.arterial',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#757575'
				}]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{
					color: '#dadada'
				}]
			},
			{
				featureType: 'road.highway',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#616161'
				}]
			},
			{
				featureType: 'road.local',
				elementType: 'labels',
				stylers: [{
					visibility: 'off'
				}]
			},
			{
				featureType: 'road.local',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#9e9e9e'
				}]
			},
			{
				featureType: 'transit.line',
				elementType: 'geometry',
				stylers: [{
					color: '#e5e5e5'
				}]
			},
			{
				featureType: 'transit.station',
				elementType: 'geometry',
				stylers: [{
					color: '#eeeeee'
				}]
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{
					color: '#c9c9c9'
				}]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#9e9e9e'
				}]
			}
		]

		this.onAPIReady()
	}

	onAPIReady() {
		this.ready = true
		this.google = window.google
	}

	create(element) {
		const map = new window.google.maps.Map(element, {
			center: { lat: this.lat, lng: this.lng },
			zoom: 17,
			styles: this.styles,
			draggable: false,
			mapTypeControl: false,
			disableDefaultUI: true
		})

		const marker = new window.google.maps.Marker({
			position: { lat: this.lat, lng: this.lng },
			map
		})

		return { map, marker }
	}
}

const GoogleMapsAPI = new GoogleMapsAPIClass()
export default GoogleMapsAPI
