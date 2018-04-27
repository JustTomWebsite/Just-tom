import Component from '../base/Component'
import Enum from '../Enum'
import { WindowSize, UserAgent, GoogleMapsAPI } from '../services'

export default class ReadSection extends Component {
	constructor(parent) {
		super('.read-section', parent)
		this.cacheDOMElement('about', '.about')
		this.cacheDOMElement('work', '.work')
		this.cacheDOMElement('contact', '.contact')
		this.cacheDOMElement('map', '.map')
		this.cacheDOMElement('tvButton', 'button.tv')
		this.cacheDOMElement('radioButton', 'button.radio')

		this.elements.radioButton.click(this.onRadioButtonClick.bind(this))
		this.elements.tvButton.click(this.onTVButtonClick.bind(this))

		WindowSize.on('resize', this.onResize.bind(this))
		this.mapElements = GoogleMapsAPI.create(this.elements.map[0])
	}

	onTVButtonClick() {
		this.setState('showTVLightbox', true)
	}

	onRadioButtonClick() {
		this.setState('showRadioLightbox', true)
	}

	onResize() {
		const { map, marker } = this.mapElements
		GoogleMapsAPI.google.maps.event.trigger(map, 'resize') // force redraw when visible so the map isn't blank
		map.setCenter(new GoogleMapsAPI.google.maps.LatLng(GoogleMapsAPI.lat, GoogleMapsAPI.lng))
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'reading':
			if (value) {
				this.element.removeClass('hide-block')
				this.onResize()
			} else {
				this.element.addClass('hide-block')
			}
			break
		case 'mobileGalleryIndex':
			if (UserAgent.isMobile()) {
				if (typeof value === 'undefined') {
					return
				}
				this.elements.about.removeClass('show')
				this.elements.work.removeClass('show')
				this.elements.contact.removeClass('show')

				switch (value) {
				case 0:
					this.elements.about.addClass('show')
					break
				case 2:
					this.elements.contact.addClass('show')
					this.onResize()
					break
				case 1:
					this.elements.work.addClass('show')
					break
				default:
					break
				}
			}
			break
		case 'currentRecord':
			if (UserAgent.isDesktop()) {
				if (typeof value === 'undefined') {
					return
				}
				this.elements.about.removeClass('show')
				this.elements.work.removeClass('show')
				this.elements.contact.removeClass('show')

				switch (value) {
				case Enum.ALBUMS.ABOUT:
					this.elements.about.addClass('show')
					break
				case Enum.ALBUMS.CONTACT:
					this.elements.contact.addClass('show')
					this.onResize()
					break
				case Enum.ALBUMS.WORK:
					this.elements.work.addClass('show')
					break
				default:
					break
				}
			}
			break
		default:
			break
		}
	}
}
