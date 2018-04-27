import $ from '../vendor/zepto'
import Component from '../base/Component'
import { UserAgent } from '../services'

export default class ContentWrapper extends Component {
	constructor(parent) {
		super('.content-wrapper', parent)
	}

	hideOverflow() {
		if (UserAgent.isMobile() && !UserAgent.isTablet()) {
			this.element.addClass('no-overflow')
		}
		if (UserAgent.isTablet()) {
			this.element.addClass('no-overflow')
		}
	}

	showOverflow() {
		if (UserAgent.isMobile() && !UserAgent.isTablet()) {
			this.element.removeClass('no-overflow')
		}
		if (UserAgent.isTablet()) {
			this.element.removeClass('no-overflow')
		}
	}


	stateDidUpdate(param, value) {
		switch (param) {
		case 'entered':
			if (value) {
				this.element.addClass('entered')
				this.hideOverflow()
			} else {
				this.element.removeClass('entered')
			}
			break
		case 'visited':
			if (value) {
				this.element.addClass('visited')
			} else {
				this.element.removeClass('visited')
			}
			break
		case 'loaded':
			if (value) {
				this.element.addClass('loaded')
			}
			break
		case 'reading':
			if (value) {
				this.element.removeClass('listen')
				this.element.addClass('read')
				this.showOverflow()
			} else {
				this.element.addClass('listen')
				this.element.removeClass('read')
				this.hideOverflow()
				this.element.scrollTop(0)
			}
			break
		default:
			break
		}
	}
}
