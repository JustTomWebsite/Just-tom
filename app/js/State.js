import Observer from './base/Observer'

class _State extends Observer {
	constructor() {
		super()
		this.state = {}
		this.didInit = false
	}

	set(param, value) {
		if (typeof param === 'undefined') {
			return
		}
		if (!(param in this.state) || value !== this.state[param]) {
			const newState = { ...this.state }
			newState[param] = value
			this.state = newState
			this.emit('setState', param, value, this.state)
		}
	}

	init(obj) {
		if (!this.didInit) {
			this.state = obj
			this.didInit = true

			const values = Object.keys(this.state)
			for (let index = 0; index < values.length; index += 1) {
				const key = values[index]
				const value = this.state[key]
				this.emit('setState', key, value, this.state)
			}
		}
	}
}

const State = new _State()
export default State
