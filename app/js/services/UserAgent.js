class UserAgentClass {
	constructor() {
		this.ua = navigator.userAgent
		this.mobile = !!this.ua.match(/mobi/i)
		this.tablet = !!this.ua.match(/tablet|ipad/i)
		this.iOS = !!this.ua.match(/iPad/i) || !!this.ua.match(/iPhone/i)
		this.webkit = !!this.ua.match(/WebKit/i)
		this.iOSSafari = this.iOS && this.webkit && !this.ua.match(/CriOS/i)
	}

	userAgent() {
		return this.ua
	}

	isMobile() {
		return this.mobile
	}
	isTablet() {
		return this.tablet
	}
	isSafari() {
		return this.safari
	}
	isOSSafari() {
		return this.iOSSafari
	}

	isDesktop() {
		return !this.mobile && !this.tablet
	}
}

const UserAgent = new UserAgentClass()
export default UserAgent
