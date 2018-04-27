import Observer from '../base/Observer'

let instance

export default class Loader extends Observer {
	constructor() {
		if (!instance) {
			super()
			this.minimumWaitTime = 4100
			this.loaded = false
			this.waited = false
			this.emitted = false

			window.addEventListener('DOMContentLoaded', this.onDOMContentLoad.bind(this))
			setTimeout(this.onWaited.bind(this), this.minimumWaitTime)
			instance = this
		}

		return instance
	}

	setLoaded() {
		this.loaded = true
		this.waited = true
		this.onLoaded()
	}

	onDOMContentLoad() {
		this.loaded = true
		this.onLoaded()
	}

	onWaited() {
		this.waited = true
		this.onLoaded()
	}

	onLoaded() {
		if (this.loaded && this.waited && !this.emitted) {
			this.emitted = true
			this.emit('loaded')
		}
	}
}
