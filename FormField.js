
import * as vdom from './vdom';


export default class FormField {

	static get TEXT_FIELD() { return 'TEXT_FIELD'; }
	static get TEXT_AREA() { return 'TEXT_AREA'; }
	static get SELECT_FIELD() { return 'SELECT_FIELD'; }
	static get HTML_CONTENT() { return 'HTML_CONTENT'; }


	constructor(type, id, attribs={}) {
		this.id = id;
		this.type = type;
		this.attribs = attribs;
		this.selector = `.js-form-input-el--${this.id}`;
	}

	getElement(attribs=this.attribs, merge=true) {

		if(merge) {
			attribs = Object.assign(this.attribs, attribs);
		}

		let elementName = 'input';
		let childrenEls = null;
		let isInput = true;

		switch(this.type) {
			case FormField.TEXT_FIELD: {
				elementName = 'input';
				attribs.type = 'text';
				break;
			}
			case FormField.TEXT_AREA: {
				elementName = 'textarea';
				break;
			}
			case FormField.SELECT_FIELD: {
				elementName = 'select';
				childrenEls = attribs.options;
				break;
			}
			case FormField.HTML_CONTENT: {
				elementName = 'div';
				isInput = false;
				break;
			}
		}

		attribs.name = attribs.name || this.id;

		const $inputEl = vdom.createElem(elementName, attribs);
		$inputEl.classList.add(this.selector);
		if(isInput)
			$inputEl.classList.add('form-control');

		if(childrenEls && childrenEls.length) {
			childrenEls
				.map(elem => vdom.createElem(elem.tagname, elem))
				.forEach($elem => $inputEl.appendChild($elem));
		}

		this.$inputEl = $inputEl;
		return $inputEl;
	}

	getTemplateFields() {

		const template = {
			label: 'Form field',
		};

		switch(this.type) {
			case FormField.TEXT_FIELD: {
				Object.assign(template, {
					placeholder: 'Enter value',
					label: 'Enter value',
				});
				break;
			}
			case FormField.TEXT_AREA: {
				Object.assign(template, {
					placeholder: 'Enter value',
					label: 'Enter value',
				});
				break;
			}
			case FormField.SELECT_FIELD: {
				Object.assign(template, {
					options: [],
					label: 'Select Value',
				});
				break;
			}
			case FormField.HTML_CONTENT: {
				Object.assign(template, {
					innerHTML: 'Awesome',
				});
				break;
			}
		}

		return template;
	}
}
