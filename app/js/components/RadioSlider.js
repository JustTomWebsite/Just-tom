import Slider from './Slider'

export default class RadioSlider extends Slider {
	stateDidUpdate(param, value) {
		super.stateDidUpdate(param, value)

		switch (param) {
		case 'showRadioLightbox':
			if (value) {
				this.setState('animating', true)
				this.show()
			} else {
				setTimeout(() => this.setState('animating', false), 300)
				this.hide()
			}
			break
		case 'radioLightboxIndex':
			if (typeof value === 'number') {
				this.setSlide(value)
			}
			break
		default:
			break
		}
	}

	hide() {
		super.hide()
		this.setState('showRadioLightbox', false)
	}
}
