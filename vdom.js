

/**
 * Create new element
 * 
 * @param  {String}       name    Element name
 * @param  {Object}       attribs Element properties/attributes
 * 
 * @return {HTMLElement}
 */
export function createElem(name, attribs={}, children=[]) {

	const $elem = document.createElement(name);

	// Append children
	Array
		.from(children)
		.map(el => typeof el === 'string'? text(el): el)
		.forEach($el => $elem.appendChild($el));

	// Apply attribs
	Object.keys(attribs).forEach(key => {
		if(!key.endsWith('_')) {
			$elem[key] = attribs[key];
			$elem.setAttribute(key, attribs[key]);
		}
	});

	return $elem;
}

/**
 * Create a text node for appending
 * 
 * @param  {String} str
 * 
 * @return {Text}
 */
export function text(str='') {
	return document.createTextNode(str);
}

/**
 * Unrender a container(empty children)
 * 
 * @param  {HTMLElement} $el
 */
export function unrender($el) {
	while($el.firstChild) {
		$el.removeChild($el.firstChild);
	}
}


/**
 * Create a control button(small button with an action)
 * 
 * @param  {String}      text         Text to go inside the button
 * @param  {String}      classname    Additional classname
 * @param  {Function}    clickHandle  Button click handler
 * 
 * @return {HTMLButtonElement}
 */
export function controlButton(text, classname='', clickHandle) {

	const $btn = createElem('button', { class: `btn btn-sm ${classname}`, type: 'button' });

	$btn.innerHTML = text;
	$btn.addEventListener('click', () => clickHandle());

	return $btn;
}


/**
 * Label a given input
 * 
 * @param  {HTMLElement} $input  Input element to label
 * @param  {String}      label   Label for the element
 * 
 * @return {HTMLElement}
 */
export function labeledInput($input, label=($input.placeholder)) {

	// Label only if the element is an input element
	if([ 'input', 'textarea', 'select' ].indexOf($input.nodeName.toLowerCase()) >= 0) {

		return createElem(
			'label',
			{ 'style': 'display: block; width: 100%; padding: .5em 1em;' },
			[ div({}, [ label ]), $input ]
		);
	}

	return $input;
}

// Div element
export function div(attribs={}, children=[]) {
	return createElem('div', attribs, children);
}

export function createArrayInput(attribs, callback=(() => null)) {

	let lastIndex = 0;
	let $lastNode = null;
	let addInput;

	const arr = attribs.value.map((a, i) => { lastIndex = i; a.name = `options_[${i}]`; });

	const render = () =>
		createElem('label', {}, [
			div({},[ attribs.label ]),
			div({}, arr.map(val => createElem('input', val))),
			div({}, [ controlButton('Add', 'btn-primary', addInput) ])
		]);

	addInput = () => {
		arr.push({ name: `options_[${lastIndex++}]`, value: 'Option ' + lastIndex });
		callback(render, arr);

		if($lastNode.parentNode) {
			const $node = render();
			$lastNode.parentNode.replaceChild($node, $lastNode);
			$lastNode = $node;
		}
	};

	$lastNode = render();

	return $lastNode;
}

