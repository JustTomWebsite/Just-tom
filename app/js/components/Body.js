import Component from '../base/Component'
import { WindowSize } from '../services'

export default class Body extends Component {
	constructor(parent) {
		super('.body', parent)
		WindowSize.on('resize', this.onResize.bind(this))
		this.largeScreen = WindowSize.height >= 900
	}

	onResize() {
		const windowIsLarge = WindowSize.height >= 900
		// extend element to 100% height only when the window is scrollable
		if (windowIsLarge && !this.largeScreen) {
			this.largeScreen = true
			this.element.css('height', '100%')
		} else if (!windowIsLarge && this.largeScreen) {
			this.largeScreen = false
			this.element.css('height', 'auto')
		}
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'entered':
			if (value) {
				this.element.addClass('entered')
			}
			break
		case 'reading':
			this.element[0].scrollTop = 0
			break
		default:
			break
		}
	}
}
