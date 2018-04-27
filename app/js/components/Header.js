import Component from '../base/Component'

export default class Header extends Component {
	constructor(parent) {
		super('.header', parent)
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'loaded':
			if (value) {
				this.element.addClass('loaded')
			} else {
				this.element.removeClass('loaded')
			}
			break
		default:
			break
		}
	}
}
