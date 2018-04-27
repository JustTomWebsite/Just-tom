import Component from '../base/Component'
import { UserAgent } from '../services'

const CSSPlugin = require('../../../node_modules/gsap/CSSPlugin.js')
const TimelineLite = require('../../../node_modules/gsap/TimelineLite.js')

export default class PhoneToggle extends Component {
	constructor(parent) {
		super('.phoneToggle', parent)
		this.cacheDOMElement('phone', '.phone')

		if (UserAgent.isTablet()) {
			this.element.removeClass('phoneHoverToggle')
		}
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'reading':
			if (value) {
				this.element.removeClass('show')
				this.element.addClass('hide')
			} else {
				this.element.removeClass('hide')
				this.element.addClass('show')
			}
			break
		case 'showPhone':
			if (value) {
				this.element.removeClass('slide-in-phone')
				this.element.addClass('slide-out-phone')
			} else {
				this.element.addClass('slide-in-phone')
				this.element.removeClass('slide-out-phone')
			}
			break
		default:
			break
		}
	}
}
