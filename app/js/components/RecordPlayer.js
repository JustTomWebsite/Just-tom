import $ from '../vendor/zepto'
import Component from '../base/Component'
import { UserAgent, AudioManager } from '../services'
import Enum from '../Enum'
import Util from '../Util'

const CSSPlugin = require('../../../node_modules/gsap/CSSPlugin.js')
const TimelineMax = require('../../../node_modules/gsap/TimelineMax.js')

export default class RecordPlayer extends Component {
	constructor(parent) {
		super('.record-player', parent)

		this.cacheDOMElement('button', '.play-button')
		this.cacheDOMElement('blank', '.play-button .blank')
		this.cacheDOMElement('needle', '.needle')
		this.cacheDOMElement(Enum.ALBUMS.ABOUT, '.record .about')
		this.cacheDOMElement(Enum.ALBUMS.CONTACT, '.record .contact')
		this.cacheDOMElement(Enum.ALBUMS.WORK, '.record .work')
		this.cacheDOMElement('reflection', '.record .reflection')
		this.currentSound = undefined

		this.recordTimelines = []

		if (UserAgent.isMobile()) {
			this.initTimelines()
		}

		this.elements.button.on('click touchstart', (e) => {
			const event = e
			if (event.handled === false) {
				return
			}
			event.stopPropagation()
			event.preventDefault()
			event.handled = true

			this.onButtonClick()
		})
	}

	onButtonClick() {
		if (!this.state.playing) {
			return
		}
		if (this.state.paused) {
			this.setState('paused', false)
		} else {
			this.setState('paused', true)
		}
	}

	onNeedleCued() {
		this.setState('playing', true)
		this.setState('animating', false)
	}

	onNeedleReset() {
		this.setState('spinning', false)
	}

	getCSSRotation(target) {
		const tr = target.css('-webkit-transform') ||
			target.css('-moz-transform') ||
			target.css('-ms-transform') ||
			target.css('-o-transform') ||
			target.css('transform') ||
			undefined

		if (typeof tr === 'undefined' || tr === 'none') {
			return 0
		}

		const values = tr.split('(')[1].split(')')[0].split(',')
		return Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI))
	}

	initTimelines() {
		for (let i = 0; i <= 2; i += 1) {
			this.recordTimelines.push(new TimelineMax({ repeat: -1 })
				.to(this.elements[i], 1, { ease: window.Power0.easeNone, rotation: '360deg' })
			)
		}
	}

	recordPlay() {
		this.recordTimelines[this.state.currentRecord].play()
	}

	recordPause() {
		this.recordTimelines[this.state.currentRecord].pause()
	}

	recordUnpause() {
		this.recordTimelines[this.state.currentRecord].play()
	}

	recordReset() {
		this.recordTimelines[this.state.currentRecord].pause()

		setTimeout(() => {
			this.recordTimelines[this.state.currentRecord].pause(0, true)
		}, 1000)
	}

	needlePlay() {
		this.timeline = new TimelineMax()
			.to(this.elements.needle, this.currentSound.audio.duration(), { rotation: '35deg' })
		this.timeline.play()
	}

	needleCue() {
		this.timeline = new TimelineMax()
			.to(this.elements.needle, 2, { rotation: '22deg' })
			.add(this.onNeedleCued.bind(this))
		this.timeline.play()
	}

	needleReset() {
		this.timeline = new TimelineMax()
			.to(this.elements.needle, 2, { rotation: '0deg' })
			.add(this.onNeedleReset.bind(this))
		this.timeline.play()
	}

	stateWillUpdate(param, value) {
		switch (param) {
		case 'currentRecord':
			if (typeof this.currentSound !== 'undefined') {
				this.currentSound.audio.stop()
			}
			if (!this.state.currentRecord || this.state.reading) {
				break
			}
			this.elements[this.state.currentRecord].removeClass('show').removeClass('spin')
			break
		default:
			break
		}
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'needleActivated':
			if (value) {
				this.needleCue()
				this.setState('spinning', true)
			} else {
				this.needleReset()
				this.elements.button.removeClass('paused')
			}
			break
		case 'showRadioLightbox':
		case 'showTVLightbox':
			if (value && this.state.playing) {
				this.setState('paused', true)
			}
			break
		case 'playing':
			if (typeof this.state.currentRecord === 'undefined') {
				break
			}
			if (value) {
				AudioManager.play(this.state.currentRecord)
				this.needlePlay()
				this.elements.blank.addClass('hide')
				this.elements.button.addClass('playing')
				this.elements.button.removeClass('paused')
			} else {
				if (!this.state.reading) {
					this.setState('animating', true)
				}
				this.setState('paused', false)
				AudioManager.stop(this.state.currentRecord)
				AudioManager.stop('record_noises')
				this.elements.button.removeClass('playing')
				this.elements.button.addClass('paused')
				this.elements[this.state.currentRecord].addClass('paused')

				if (UserAgent.isMobile()) {
					this.recordPause()
				}

				this.setState('needleActivated', false)
			}
			break
		case 'paused':
			if (typeof this.state.currentRecord === 'undefined' || !this.state.playing) {
				break
			}
			if (value) {
				this.timeline.pause()
				AudioManager.pause(this.state.currentRecord)
				this.elements.button.removeClass('playing')
				this.elements.button.addClass('paused')
				this.elements[this.state.currentRecord].addClass('paused')

				if (UserAgent.isMobile()) {
					this.recordPause()
				}
			} else {
				this.timeline.play()
				AudioManager.play(this.state.currentRecord)
				this.elements.button.addClass('playing')
				this.elements.button.removeClass('paused')
				this.elements[this.state.currentRecord].removeClass('paused')

				if (UserAgent.isMobile()) {
					this.recordUnpause()
				}
			}
			break
		case 'recordOnPlayer':
			if (typeof this.state.currentRecord === 'undefined') {
				break
			}
			if (value) {
				this.elements[this.state.currentRecord].addClass('show')
				this.elements.reflection.addClass('show')
				this.currentSound = AudioManager.get(this.state.currentRecord)

				if (UserAgent.isMobile()) {
					this.recordPlay()
				}
			} else {
				this.elements[this.state.currentRecord].removeClass('show').removeClass('spin').removeClass('paused')
				this.elements.reflection.removeClass('show')
				this.elements.blank.removeClass('hide')

				if (UserAgent.isMobile()) {
					this.recordReset()
				}
			}
			break
		case 'spinning':
			if (typeof this.state.currentRecord === 'undefined') {
				break
			}
			if (value) {
				AudioManager.play('record_noises')
				this.elements[this.state.currentRecord].addClass('spin')
			} else {
				this.elements[this.state.currentRecord].addClass('paused')
				this.setState('recordAngle', this.getCSSRotation($(this.elements[this.state.currentRecord])))
				this.setState('recordOnPlayer', false)
			}
			break
		case 'reading':
			if (value) {
				this.element.addClass('hide-block')
				this.setState('playing', false)
				this.setState('spinning', false)
			} else {
				this.element.removeClass('hide-block')
			}
			break
		default:
			break
		}
	}
}
