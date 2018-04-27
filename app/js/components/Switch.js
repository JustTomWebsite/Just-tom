import Component from '../base/Component'
import UserAgent from '../services/UserAgent'
import ZingTouch from '../services/ZingTouch'
import WindowSize from '../services/WindowSize'

export default class Switch extends Component { // TV / Radio switch
	constructor(parent) {
		super('.switch', parent)

		WindowSize.on('resize', this.onResize.bind(this))

		if (UserAgent.isDesktop()) {
			this.element.on('mousedown', this.onMouseDown.bind(this))
			this.element.on('mouseup', this.onMouseUp.bind(this))
		} else {
			const zt = new ZingTouch()
			this.ZingTouch = zt

			zt.body.bind(this.element[0], 'swipe', (event) => {
				const { currentDirection } = event.detail.data[0]
				this.onSwipe(currentDirection)
			})
		}

		this.isMouseDown = false
		this.origin = { x: 0, y: 0 }
	}

	onMouseDown(event) {
		if (this.state.animating || (typeof this.state.currentRecord !== 'undefined' && this.state.currentRecord !== 1)) {
			return
		}

		this.isMouseDown = true
		this.origin = {
			x: event.clientX,
			y: event.clientY
		}
		this.screenWidth = WindowSize.width
	}

	onMouseUp(event) {
		if (this.state.animating || (typeof this.state.currentRecord !== 'undefined' && this.state.currentRecord !== 1)) {
			return
		}

		if (this.isMouseDown) {
			this.isMouseDown = false

			const endpoint = {
				x: event.clientX,
				y: event.clientY
			}
			const a = this.origin.x - endpoint.x
			const b = this.origin.y - endpoint.y
			const swipeDistance = Math.sqrt((a * a) + (b * b))

			if (swipeDistance > 30) {
				if (endpoint.x < this.origin.x) {
					this.swipeLeft()
				} else {
					this.swipeRight()
				}
			} else if (swipeDistance < 3) {
				const midpoint = this.width * 0.4433
				const normalizedXOrigin = this.origin.x - ((this.screenWidth / 2) - (this.width / 2))

				if (normalizedXOrigin < midpoint) {
					this.swipeLeft()
				} else {
					this.swipeRight()
				}
			}
		}
	}

	onSwipe(angle) {
		if (this.state.animating || (this.state.currentRecord !== 1 && typeof this.state.currentRecord !== 'undefined')) {
			return
		}

		if (this.ZingTouch.Direction.IsLeft(angle)) {
			this.swipeLeft()
		}

		if (this.ZingTouch.Direction.IsRight(angle)) {
			this.swipeRight()
		}
	}

	onResize() {
		this.width = this.element.width()
	}

	stateDidUpdate(param, value) {
		switch (param) {
		case 'currentRecord':
			if (value === 1) {
				this.onResize()
			}
			break
		case 'showTVLightbox':
		case 'showRadioLightbox':
			if (typeof value !== 'undefined' && !value) {
				this.element.removeClass('left').removeClass('right')
			}
			break
		default:
			break
		}
	}

	swipeLeft() {
		setTimeout(() => {
			this.setState('showTVLightbox', true)
		}, 300)
		this.element.addClass('left')
	}

	swipeRight() {
		setTimeout(() => {
			this.setState('showRadioLightbox', true)
		}, 300)
		this.element.addClass('right')
	}
}
