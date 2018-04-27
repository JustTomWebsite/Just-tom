import * as ZingTouchLibrary from 'zingtouch'

let instance

export default class ZingTouch {
	constructor() {
		if (!instance) {
			instance = this

			delete ZingTouchLibrary.default
			Object.assign(this, ZingTouchLibrary)
			this.body = new ZingTouchLibrary.Region(document.body)
		}

		return instance
	}

	IsLeft(value) {
		return value > 90 + 45 && value < 270 - 45
	}

	IsDown(value) {
		return value > 180 + 45 && value < 360 - 45
	}

	IsUp(value) {
		return value > 45 && value < 180 - 45
	}

	IsRight(value) {
		return (value > 270 + 45 && value <= 360) ||
			(value >= 0 && value < 90 - 45)
	}

	get Direction() {
		const { IsLeft, IsRight, IsUp, IsDown } = this
		return { IsLeft, IsRight, IsUp, IsDown }
	}

	set Direction(value) {
		// not implemented
	}
}
