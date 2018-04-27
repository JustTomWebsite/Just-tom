# Just-Tom 
  
# Getting Started  
```npm install```  
  
# Development  
```npm start```  
This runs webpack, which transpiles ```app/index.js``` and ```app/index.html``` to ```dist/index.compiled.js``` and ```dist/index.html``` respectively.  
  
```gulp```  
This transpiles ```app/index.scss``` to ```dist/index.css```. This is done to keep CSS in it's own file since including it in js delays its load a noticeable amount. This also copies the ```audio``` and ```images``` folders to ```dist```. All relevant folders are watched for changes.
  
# Code style  
Javascript is linted using eslint via webpack. This ensures similar formatting throughout the codebase. The rules enforced can be found here: 
https://github.com/airbnb/javascript

# Stylesheet layout  
Each component has it's own stylesheet with the same name. Styles exclusive to desktop or mobile are separated into ```app/scss/~platform/~component``` and are applied dynamically based on the user agent.  
  
# Zepto.js  
This application uses a custom build of Zepto.js for dom selection. It has the zepto, event, ie, and fx modules enabled. A compiled copy is found at ```app/js/vendor```. If a recompile is ever necessary, the codebase with instructions may be found here:  
https://github.com/madrobby/zepto  

# App layout  
### DOM manipulation  
This application employs a component system somewhat similar to React. The intent is to have each component be concerned only with itself. Any outside data is to be sent through the messaging system explained below. Each component has a few convenience methods for dealing with the DOM. For posterity, a component is created like this:

```
import Component from '../base/Component'

class Home extends Component {
	constructor(parent) {
		super('.home', parent)  // selector, parent element
	}
}
```

All components except the root component must be given a parent component.

```
import { Home } from './components'

class App extends Component {}
const app = new App()
const home = new Home(app)
```
  
By default, a component's DOM may be accessed via ```this.element```, which is just a reference to Zepto. 

```
import Component from '../base/Component'

class Home extends Component {
	constructor(parent) {
		super('.home', parent)

		console.log(this.element) // this
		console.log($('.home')) // and this are identical
	}
}
```

To cache an element within the DOM of a given selector, you may call ```this.cacheDOMElement()```. This makes it accessible for the lifetime of the app within that component via ```this.component.~name```. For example:

```
<html>
<body>
	<div class="app>
		<div class="home">
			<div class="food-dish"></div>
		</div>
	</div>
</body>
</html>
```

```
import Component from '../base/Component'

class Home extends Component {
	constructor(parent) {
		super('.home', parent)
		
		this.cacheDOMElement('foodDish', '.food-dish') // name, selector

		// now accessible via this.elements
		console.log(this.elements.foodDish)
	}
}
```  
  
```cacheDOMElement()``` uses ```$.find()```. It only searches within it's own DOM tree.

### Messaging  
This application employs a messaging system following the [observer pattern](http://www.oodesign.com/observer-pattern.html) and lifecycle methods similar in function to React. This is implemented via ```State.js``` which is consumed by ```Component.js```. App components can then extend ```Component.js``` and implement it's methods.  
  
To start, we must initialize the message's default value. This is done in ```index.js```. When initializing a message's default value, it is not sent to ```stateWillUpdate()``` or ```stateDidUpdate()```.

```
import State from './State'

State.init({
	cats: false
})
```
  
Components can now listen for this message and react accordingly.
  
```
import Component from '../base/Component'  
  
class Home extends Component {
	stateDidUpdate(param, value) { // the state object has been set
		switch(param) {
			case 'cats':
				if (value) {
					console.log('yay, cats!')
				} else {
					console.log('aww, no cats...')
				}
				break
			default:
				break
		}
	}

	stateWillUpdate(param, value) {  // the state object will be set
		switch(param) {
			case 'cats':
				console.log(this.state.cats) // old value
				console.log(value) // new value
				break
			default:
				bteak
		}
	}
}
```  
  
To send a state message from within a component, simply call
```
this.setState('cats', true)
```  
  
and from outside a component
```
import State from './State'

State.set('cats', true)
```
  
You may also set props on components. These propagate downwards in the component tree, rather than to all components. The component hierarchy is defined via instantiation in ```index.js```.  
  
```
this.setProp('isCute', true)
```  

This may then be accessed (after the message has propagated) via  
```
this.prop.isCute
```

Again, remember that this prop is only available within the component it's defined in and it's child components. Components may listen for prop messages similar to state messages via ```propWillUpdate()``` and ```propDidUpdate()```.