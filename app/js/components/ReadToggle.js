import Component from '../base/Component'
import AudioManager from '../services/AudioManager'
import Enum from '../Enum'
import { UserAgent } from '../services'


export default class ReadToggle extends Component {
	constructor(parent) {
		super('.read-toggle', parent)
		this.element.on('click', this.onButtonClick.bind(this))
	}

	onButtonClick() {
		if (this.state.animating) {
			return
		}
		if (this.state.reading) {
			this.setState('currentRecord', undefined)
			this.setState('reading', false)
		} else {
			this.setState('reading', true)
			this.setState('playing', false)
			this.setState('emailSlide', false)
			this.setState('phoneSlide', false)
			this.setState('showEmail', false)
			this.setState('showPhone', false)
		}
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'reading':
			if (value) {
				this.setState('animating', true)
				setTimeout(() => {
					// disable toggle button to allow for the listen animation to reset
					this.setState('animating', false)
				}, 2500)

				this.element.removeClass('listen')
				this.element.addClass('read')
			} else {
				this.element.addClass('listen')
				this.element.removeClass('read')
			}
			break
		case 'entered':
			if (value) {
				this.element.removeClass('hide')
				this.element.addClass('show')
			} else {
				this.element.addClass('hide')
				this.element.removeClass('show')
			}
			break
		case 'playing':
			switch (this.state.currentRecord) {
			case Enum.ALBUMS.WORK:
				//	disable buttons pointer events for slider to come up
				this.element.removeClass('show')
				this.element.addClass('unclickable')
				setTimeout(() => {
					//	reset the click event for that the button is clickable
					this.element.addClass('show')
					this.element.removeClass('unclickable')
				}, 1500)
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
