const store = require('store')

class StoreClass {
	constructor() {
		this.name = 'JustTom'
	}

	set(prop, value) {
		store.set(`${this.name}:${prop}`, value)
	}

	get(prop) {
		return store.get(`${this.name}:${prop}`)
	}

	clear() {
		store.clearAll()
	}
}

const Store = new StoreClass()
export default Store
