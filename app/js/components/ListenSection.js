import Component from '../base/Component'
import Enum from '../Enum'
import { WindowSize, UserAgent } from '../services'

const $ = window.$

export default class ListenSection extends Component {
	constructor(parent) {
		super('.listen-section', parent)
		this.cacheDOMElement('about', '.about')
		this.cacheDOMElement('work', '.work')
		this.cacheDOMElement('contact', '.contact')
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'reading':
			if (value) {
				this.elements.about.removeClass('fade-out').removeClass('fade-in')
				this.elements.contact.removeClass('fade-out').removeClass('fade-in')
				this.elements.work.removeClass('fade-out').removeClass('fade-in')
				this.element.addClass('hide-block')
			} else {
				this.element.removeClass('hide-block')
			}
			break
		case 'cuedRecord':
			this.lastRecord = this.state.currentRecord
			break
		case 'currentRecord':
			if (typeof value === 'undefined') {
				return
			}
			if (typeof this.lastRecord !== 'undefined') {
				switch (this.lastRecord) {
				case Enum.ALBUMS.ABOUT:
					this.elements.about.addClass('fade-out').removeClass('fade-in')
					break
				case Enum.ALBUMS.CONTACT:
					this.elements.contact.addClass('fade-out').removeClass('fade-in')
					this.setState('showEmail', false)
					this.setState('showPhone', false)
					break
				case Enum.ALBUMS.WORK:
					this.elements.work.addClass('fade-out').removeClass('fade-in')
					break
				default:
					break
				}
			}
			break
		case 'playing':
			if (typeof this.state.currentRecord === 'undefined') {
				return
			}

			this.elements.about.removeClass('fade-out').removeClass('fade-in')
			this.elements.contact.removeClass('fade-out').removeClass('fade-in')
			this.elements.work.removeClass('fade-out').removeClass('fade-in')

			switch (this.state.currentRecord) {
			case Enum.ALBUMS.ABOUT:
				this.elements.about.addClass('fade-in')
				break
			case Enum.ALBUMS.CONTACT:
				this.elements.contact.addClass('fade-in')
				this.setState('showEmail', true)
				this.setState('showPhone', true)
				break
			case Enum.ALBUMS.WORK:
				this.elements.work.addClass('fade-in')
				break
			default:
				break
			}
			break
		default:
			break
		}
	}
}
