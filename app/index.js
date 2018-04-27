import * as Components from './js/components'
import { UserAgent, AudioManager, Loader, YoutubeIframeAPI, GoogleMapAPI, Store } from './js/services'
import Component from './js/base/Component'
import State from './js/State'
import Enum from './js/Enum'

const loader = new Loader()

class App extends Component {
	constructor() {
		super('#app')
		loader.on('loaded', this.onLoad.bind(this))

		if (UserAgent.isDesktop()) {
			this.element.addClass('desktop')
		} else if (UserAgent.isTablet()) {
			this.element.addClass('desktop')
		} else if (UserAgent.isMobile()) {
			this.element.addClass('mobile')
		}

		//	Safari code here..
		if (UserAgent.isOSSafari()) {
			this.element.find('.about').addClass('safarifix')
			this.element.find('.work').addClass('safarifixW')
			this.element.find('.contact').addClass('safarifix')
		}

		AudioManager.add(Enum.ALBUMS.ABOUT, 'audio/about.mp3')
		AudioManager.add(Enum.ALBUMS.CONTACT, 'audio/contact.mp3')
		AudioManager.add(Enum.ALBUMS.WORK, 'audio/work.mp3')
		AudioManager.add('record_noises', 'audio/player_start.mp3')
		AudioManager.volume('record_noises', 0.7)
		AudioManager.on('end', this.onAudioEnd.bind(this))

		State.init({
			visited: false,
			loaded: false,
			entered: false,
			reading: false,
			playing: false,
			paused: false,
			animating: false,
			showRadioLightbox: false,
			radioLightboxIndex: 0,
			showTVLightbox: false,
			recordAngle: 0,
			tvLightboxIndex: 0,
			recordOnPlayer: false,
			needleActivated: false,
			currentRecord: undefined,
			cuedRecord: undefined,
			mobileGalleryIndex: 0,
			showEmail: false,
			showPhone: false,
			hoverEmail: false,
			hoverPhone: false,
			sliding: false
		})

		if (UserAgent.isMobile() && !UserAgent.isTablet()) {
			this.element.find('.desktop').addClass('hide-block')
			this.element.find('.mobile').addClass('show')
		}
	}

	onAudioEnd(sound) {
		if (typeof sound.id === 'number') { // if audio is one of the records
			this.setState('playing', false)
		}
	}

	onLoad() {
		this.setState('loaded', true)
		this.element.removeClass('no-transition') // prevents content-wrapper transform from animating on page load
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'animating':
			if (!value && typeof this.state.cuedRecord !== 'undefined' && !this.state.playing && !this.state.reading) {
				// if a record is cued and UI has just finished animating, play the cued record
				setTimeout(() => {
					this.setState('currentRecord', this.state.cuedRecord)
					this.setState('cuedRecord', undefined)
				}, 300)
			}
			break
		default:
			break
		}
	}
}

const app = new App()
new Components.Body(app)
new Components.Header(app)
new Components.Loading(app)
new Components.ReadToggle(app)
new Components.EmailToggle(app)
new Components.PhoneToggle(app)
const contentWrapper = new Components.ContentWrapper(app)
new Components.AlbumGallery(contentWrapper)
new Components.RecordAnimation(contentWrapper)
new Components.RecordPlayer(contentWrapper)
const readSection = new Components.ReadSection(app)
const listenSection = new Components.ListenSection(app)
new Components.WorkSection(listenSection)
new Components.Switch(listenSection)

new Components.TVSlider('.slider.tv-slider', app)
new Components.RadioSlider('.slider.radio-slider', app)

const userHasVisited = Store.get('visited')
if (userHasVisited) {
	// if the user has already visited (stored in localstorage), hide the loading page
	loader.setLoaded()
	State.set('visited', true)
	State.set('entered', true)
} else {
	Store.set('visited', true)
}
