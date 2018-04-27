export default class Util {
	static debounce(fn, wait, immediate) {
		// throttles a function being called multiple times to every Xms
		let timeout

		return (...args) => {
			const later = () => {
				timeout = null
				if (!immediate) {
					fn.apply(this, args)
				}
			}

			const callNow = !!immediate && !timeout
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)

			if (callNow) {
				fn.apply(this, args)
			}
		}
	}
}
