import $ from '../vendor/zepto'
import Observer from './Observer'
import State from '../State'

export default class Component extends Observer {
	constructor(selector, parent) {
		super()
		this.state = {}
		this.prop = {}
		this.elements = {}
		this.element = undefined

		if (typeof selector !== 'undefined') {
			this.element = window.$(selector)
		}

		if (typeof parent !== 'undefined') {
			parent.on('setProp', (param, value, object) => {
				this.setProp(param, value, object)
			})
		}

		State.on('setState', (param, value, object) => {
			this.setState(param, value, object)
		})
	}

	stateDidUpdate() {}
	stateWillUpdate() {}
	propDidUpdate() {}
	propWillUpdate() {}

	setState(param, value, object) {	// propagates both up and down
		if (typeof object !== 'undefined') {
			this.stateWillUpdate(param, value)
			this.state = {
				...this.state,
				...object
			}
			this.stateDidUpdate(param, value)
		} else {
			State.set(param, value)
		}
	}

	setProp(param, value, object) {	// propagates down
		if (typeof param === 'undefined') {
			return
		}
		if (typeof object !== 'undefined') {
			this.prop = {
				...this.prop,
				...object
			}
			this.emit('setProp', [undefined, undefined, object])
			return
		}
		if (!(param in this.prop) || value !== this.prop[param]) {
			const newProp = { ...this.prop }
			newProp[param] = value
			this.propWillUpdate(param, value)
			this.prop = newProp
			this.propDidUpdate(param, value)
			this.emit('setProp', [param, value, undefined])
		}
	}

	cacheDOMElement(key, selector, element) {
		if (typeof element !== 'undefined') {
			this.elements[key] = element
		} else {
			this.elements[key] = this.element.find(selector)
		}
	}
}
