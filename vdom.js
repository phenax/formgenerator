
export function createElem(name, attribs={}) {

	const $elem = document.createElement(name);

	// Apply attribs
	Object.keys(attribs).forEach(key => {
		$elem[key] = attribs[key];
		$elem.setAttribute(key, attribs[key]);
	});

	return $elem;
}

export function unrender($el) {
	while($el.firstChild) {
		$el.removeChild($el.firstChild);
	}
}

export function createControlBtn(text, classname, clickHandle) {
	const $btn = createElem('button', { 'class': `btn btn-sm ${classname}` });
	$btn.innerHTML = text;
	$btn.addEventListener('click', () => clickHandle());
	return $btn;
}

export function labeledInput($input, label=($input.placeholder)) {

	if([ 'input', 'textarea', 'select' ].indexOf($input.nodeName.toLowerCase()) >= 0) {

		const $label = createElem('label', { 'style': 'display: block; width: 100%; padding: .5em 1em;' });

		const $div = createElem('div', {  });
		$div.textContent = label;
		$label.appendChild($div);
		$label.appendChild($input);

		return $label;
	}

	return $input;
}
