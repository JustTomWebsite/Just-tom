import Observer from './base/Observer'
import YoutubeIframeAPI from './services/YoutubeIframeAPI'

export default class YoutubeVideo extends Observer {
	constructor(parent, id) {
		super()
		this.id = id
		this.parent = parent
		this.ready = false
		this.playing = false
		this.paused = true
		this.stopped = false

		if (YoutubeIframeAPI.ready) {
			this.onAPIReady()
		} else {
			YoutubeIframeAPI.on('ready', this.onAPIReady.bind(this))
		}
	}

	onAPIReady() {
		const origin = location.origin.replace('http://', 'https://')

		this.player = new YT.Player(this.parent, {
			videoId: this.id,
			origin,
			widget_referrer: origin,
			playerVars: {
				html5: 1,
				playsinline: 1,
				hidecontrols: 1,
				modestbranding: 1,
				autoplay: 0,
				showinfo: 0,
				showsearch: 0,
				enablejsapi: 1,
				rel: 0,
				border: 0
			},
			events: {
				onReady: this.onReady.bind(this),
				onStateChange: this.onStateChange.bind(this),
				onError: this.onError.bind(this)
			}
		})
	}

	play() {
		if (!this.ready) {
			return
		}
		if (!this.playing) {
			this.playing = true
			this.paused = false
			this.stopped = false
			this.player.playVideo()
		}
	}

	stop() {
		if (!this.ready) {
			return
		}
		if (this.playing) {
			this.playing = false
			this.paused = true
			this.stopped = true
			this.player.stopVideo()
		}
	}

	pause() {
		if (!this.ready) {
			return
		}
		if (this.playing) {
			this.playing = false
			this.paused = true
			this.stopped = true
			this.player.pauseVideo()
		}
	}

	destroy() {
		this.ready = false
		this.player.destroy()
	}

	onReady() {
		this.ready = true
		this.emit('ready')
	}

	onEnded() {
		this.playing = false
		this.stopped = true
		this.paused = false
		this.emit('ended')
	}

	onPlaying() {
		this.stopped = false
		this.paused = false
		this.playing = true
		this.emit('playing')
	}

	onPaused() {
		this.playing = false
		this.paused = true
		this.emit('paused')
	}

	onBuffering() {
		this.emit('buffering')
	}

	onCued() {
		this.emit('cued')
	}

	onError(event) {
		switch (event.data) {
		case 2:
			this.error('The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.')
			break
		case 5:
			this.error('The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.')
			break
		case 100:
			this.error('The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.')
			break
		case 101:
		case 150:
			this.error('The owner of the requested video does not allow it to be played in embedded players.')
			break
		default:
			this.error('An unknown error has occurred.')
		}
	}

	error(...args) {
		args.splice(0, 0, `YoutubeVideo (${this.id}):`)
		// console.error.apply(this, args)
	}

	log(...args) {
		args.splice(0, 0, `YoutubeVideo (${this.id}):`)
		// console.log.apply(this, args)
	}

	onStateChange(event) {
		switch (event.data) {
		case YT.PlayerState.ENDED:
			this.onEnded(event)
			break
		case YT.PlayerState.PLAYING:
			this.onPlaying(event)
			break
		case YT.PlayerState.PAUSED:
			this.onPaused(event)
			break
		case YT.PlayerState.BUFFERING:
			this.onBuffering(event)
			break
		case YT.PlayerState.CUED:
			this.onCued(event)
			break
		default:
			break
		}
	}
}
