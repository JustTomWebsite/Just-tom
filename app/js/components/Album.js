import ZingTouch from '../services/ZingTouch'
import Component from '../base/Component'
import UserAgent from '../services/UserAgent'

export default class Album extends Component {
	constructor(selector, parent, index) {
		super(selector, parent)
		this.deselect()
		this.setProp('index', index)

		this.cacheDOMElement('albumRead', '.normal .read')
		this.cacheDOMElement('albumReadHover', '.hover .read')
		this.cacheDOMElement('albumReadActive', '.active .read')
		this.cacheDOMElement('albumListen', '.normal .listen, .hover .listen')

		if (UserAgent.isMobile()) {
			const zt = new ZingTouch()
			zt.body.bind(this.element[0], new zt.Tap(), this.select.bind(this))
		} else {
			this.element.on('click', this.select.bind(this))
		}
	}

	select() {
		if ((!this.state.reading && this.state.animating) || this.prop.selected) {
			return
		}

		if (!this.state.playing) {
			if (this.state.currentRecord !== this.prop.index) {
				this.setState('currentRecord', this.prop.index)
			}
			if (!this.state.reading) {
				this.setState('animating', true)
			}
			this.setProp('selected', true)
		} else {
			this.setState('cuedRecord', this.prop.index)

			if (UserAgent.isMobile()) {
				if (this.state.mobileGalleryIndex === this.state.currentRecord) {
					this.setState('playing', false)
				} else {
					this.setState('mobileGalleryIndex', this.state.currentRecord)
				}
			} else {
				this.setState('playing', false)
			}
		}
	}

	deselect() {
		this.setProp('selected', false)
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'currentRecord':
			if (value === this.prop.index) {
				this.select()
			} else {
				this.deselect()
			}
			break
		default:
			break
		}
	}

	propDidUpdate(param, value) {
		switch (param) {
		case 'selected':
			if (value) {
				this.element.addClass('selected')
			} else {
				this.element.removeClass('selected')
			}
			break
		default:
			break
		}
	}
}
