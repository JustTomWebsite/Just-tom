import Component from '../base/Component'
import WindowSize from '../services/WindowSize'
import UserAgent from '../services/UserAgent'
import Enum from '../Enum'

const CSSPlugin = require('../../../node_modules/gsap/CSSPlugin.js')
const TimelineLite = require('../../../node_modules/gsap/TimelineLite.js')

export default class RecordAnimation extends Component {
	constructor(parent) {
		super('.record-animation', parent)

		this.cacheDOMElement('albumAbout', '.animation-album .about')
		this.cacheDOMElement('albumContact', '.animation-album .contact')
		this.cacheDOMElement('albumWork', '.animation-album .work')
		this.cacheDOMElement('recordAbout', '.record .about')
		this.cacheDOMElement('recordContact', '.record .contact')
		this.cacheDOMElement('recordWork', '.record .work')
		this.cacheDOMElement('record', '.record')
		this.cacheDOMElement('recordInner', '.record-inner')
		this.cacheDOMElement('reflection', '.reflection')

		this.currentAlbum = undefined
		this.currentAlbumImage = undefined
		this.currentRecord = undefined
		this.animatedDown = false
	}

	onAlbumAnimatedDown() {
		if (!this.state.reading) {
			this.setState('recordOnPlayer', true)
			this.setState('needleActivated', true)
		}
	}

	onAlbumAnimatedUp() {
		if (!this.state.reading) {
			this.elements.recordAbout.animate({ rotate: '0deg' }, 0)
			this.elements.recordContact.animate({ rotate: '0deg' }, 0)
			this.elements.recordWork.animate({ rotate: '0deg' }, 0)
			this.setState('currentRecord', undefined)
			this.setState('animating', false)
		}
	}

	setTimeline() {
		const xOrigin = this.currentAlbum.position().left

		if (UserAgent.isMobile() && !UserAgent.isTablet() && WindowSize.width > 320) {
			this.timeline = new TimelineLite({
				onReverseComplete: this.onAlbumAnimatedUp.bind(this)
			}, CSSPlugin)
				.to(this.currentAlbum, 0.8, { x: 0, rotation: 90, boxShadow: '11px -8px 8px -2px rgba(0, 0, 0, 0.3) ' })
				.to([this.elements.record, this.currentRecord], 0, { opacity: 1 })
				.to([this.elements.record], 1, { y: 199 })
				.add(() => {
					if (!this.animatedDown) {
						this.onAlbumAnimatedDown()
						this.animatedDown = true
					} else {
						this.animatedDown = false
					}
				})
				.to(this.currentAlbum, 0.6, { x: xOrigin, y: 0, rotation: 0, boxShadow: '11px 8px 8px -2px rgba(0, 0, 0, 0.3) ' })
		} else if (UserAgent.isMobile() && !UserAgent.isTablet() && WindowSize.width <= 320) {
			this.timeline = new TimelineLite({
				onReverseComplete: this.onAlbumAnimatedUp.bind(this)
			}, CSSPlugin)
				.to(this.currentAlbum, 0.6, { x: 0, rotation: 90, boxShadow: '8px -6px 6px -2px rgba(0, 0, 0, 0.3) ' })
				.to([this.elements.record, this.currentRecord], 0, { opacity: 1 })
				.to([this.elements.record], 0.8, { y: 176 })
				.add(() => {
					if (!this.animatedDown) {
						this.onAlbumAnimatedDown()
						this.animatedDown = true
					} else {
						this.animatedDown = false
					}
				})
				.to(this.currentAlbum, 0.6, { x: xOrigin, y: 0, rotation: 0, boxShadow: '8px 6px 6px -2px rgba(0, 0, 0, 0.3) ' })
		} else if (UserAgent.isDesktop() && !UserAgent.isTablet()) {
			let yOffset = 0
			if (WindowSize.height >= 900) {
				yOffset = 333
			} else {
				yOffset = 256
			}

			this.timeline = new TimelineLite({
				onReverseComplete: this.onAlbumAnimatedUp.bind(this)
			}, CSSPlugin)
				.to(this.currentAlbum, 0.6, { x: 0, y: 30, rotation: 90, boxShadow: '11px -8px 8px -2px rgba(0, 0, 0, 0.3) ' })
				.to([this.elements.record, this.currentRecord], 0, { opacity: 1 })
				.to(this.elements.record, 0.8, { scale: 1, y: yOffset })
				.add(() => {
					if (!this.animatedDown) {
						this.onAlbumAnimatedDown()
						this.animatedDown = true
					} else {
						this.animatedDown = false
					}
				})
				.to(this.currentAlbum, 0.6, { x: xOrigin, y: 0, rotation: 0, boxShadow: '11px 8px 8px -2px rgba(0, 0, 0, 0.3) ' })
		} else if (UserAgent.isTablet()) {
			this.timeline = new TimelineLite({
				onReverseComplete: this.onAlbumAnimatedUp.bind(this)
			}, CSSPlugin)
				.to(this.currentAlbum, 0.6, { x: 0, y: 30, rotation: 90, boxShadow: '11px -8px 8px -2px rgba(0, 0, 0, 0.3) ' })
				.to([this.elements.record, this.currentRecord], 0, { opacity: 1 })
				.to(this.elements.record, 0.8, { scale: 1, y: 256 })
				.add(() => {
					if (!this.animatedDown) {
						this.onAlbumAnimatedDown()
						this.animatedDown = true
					} else {
						this.animatedDown = false
					}
				})
				.to(this.currentAlbum, 0.6, { x: xOrigin, y: 0, rotation: 0, boxShadow: '11px 8px 8px -2px rgba(0, 0, 0, 0.3) ' })
		}
	}

	reset() {
		if (typeof this.currentAlbum !== 'undefined') {
			this.currentAlbum.removeClass('show')
		}
		if (typeof this.currentRecord !== 'undefined') {
			this.currentRecord.css('opacity', 0)
		}
	}

	stateWillUpdate(param, value) {
		switch (param) {
		case 'currentRecord':
			if (typeof this.currentAlbum !== 'undefined') {
				this.currentAlbum.removeClass('show')
			}
			break
		default:
			break
		}
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'animating':
			if (UserAgent.isMobile() && typeof this.currentAlbum !== 'undefined') {
				if (!value) {
					this.currentAlbum.removeClass('show')
				} else {
					this.currentAlbum.addClass('show')
				}
			}
			break
		case 'currentRecord':
			if (this.state.reading) {
				break
			}

			switch (value) {
			case Enum.ALBUMS.ABOUT:
				this.currentAlbum = this.elements.albumAbout
				this.currentRecord = this.elements.recordAbout
				break
			case Enum.ALBUMS.WORK:
				this.currentAlbum = this.elements.albumWork
				this.currentRecord = this.elements.recordWork
				break
			case Enum.ALBUMS.CONTACT:
				this.currentAlbum = this.elements.albumContact
				this.currentRecord = this.elements.recordContact
				break
			default:
				this.currentAlbum = undefined
				this.currentRecord = undefined
				break
			}

			if (typeof value !== 'undefined') {
				this.setTimeline()
				this.currentAlbum.addClass('show')
			}
			break
		case 'reading':
			if (value) {
				this.element.addClass('hide-block')
				this.reset()
			} else {
				this.element.removeClass('hide-block')
			}
			break
		case 'recordAngle':
			if (typeof this.currentRecord !== 'undefined') {
				this.currentRecord.animate({ rotate: `${value}deg` }, 0)
			}
			break
		case 'recordOnPlayer':
			if (!this.currentRecord) {
				break
			}
			if (value) {
				this.currentRecord.css('opacity', 0)
				this.elements.reflection.css('opacity', 0)
			} else {
				this.currentRecord.css('opacity', 1)
				this.elements.reflection.css('opacity', 1)
				this.timeline.reverse()
			}
			break
		default:
			break
		}
	}
}
