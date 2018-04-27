import { Howl } from 'howler'
import Observer from '../base/Observer'

class _AudioManager extends Observer {
	constructor() {
		super()
		this.sounds = {}
	}

	add(tag, path) {
		const sound = {
			id: tag,
			playing: false
		}
		const howl = new Howl({ src: path, onend: this.onEnd.bind(this, tag, sound) })
		sound.audio = howl

		this.sounds[tag] = sound
	}

	play(tag) {
		if (tag in this.sounds && !this.sounds[tag].playing) {
			const sound = this.sounds[tag]
			sound.audio.play()
			sound.playing = true
			this.emit('play', sound)
		}
	}

	volume(tag, volume) {
		const sound = this.get(tag)
		let normalizedVolume = volume

		if (!!sound && typeof normalizedVolume === 'number') {
			if (normalizedVolume > 1) {
				normalizedVolume = 1
			}
			if (normalizedVolume < 0) {
				normalizedVolume = 0
			}
			sound.audio.volume(normalizedVolume)
		}
	}

	stop(tag, emit = true) {
		if (tag in this.sounds && this.sounds[tag].playing) {
			const sound = this.sounds[tag]
			sound.audio.stop()
			sound.audio.seek(0)
			sound.playing = false
			this.emit('stop', sound)
		}
	}

	get(tag) {
		if (tag in this.sounds) {
			return this.sounds[tag]
		}
		return false
	}

	pause(tag) {
		if (tag in this.sounds && this.sounds[tag].playing) {
			const sound = this.sounds[tag]
			sound.audio.pause()
			sound.playing = false
			this.emit('pause', sound)
		}
	}

	onEnd(tag, sound) {
		if (tag in this.sounds) {
			this.sounds[tag].playing = false
		}
		this.emit('end', sound)
	}
}

const AudioManager = new _AudioManager()
export default AudioManager
