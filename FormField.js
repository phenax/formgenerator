
import * as vdom from './vdom';


export default class FormField {

	// Element type for the form field
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
				childrenEls = attribs.options_;
				break;
			}
			case FormField.HTML_CONTENT: {
				elementName = 'div';
				isInput = false;
				break;
			}
		}

		attribs.name = attribs.name || this.id;

		if(childrenEls && childrenEls.length) {
			childrenEls = childrenEls.map(elem => vdom.createElem(elem.tagname, elem));
		} else {
			childrenEls = [];
		}

		const $inputEl = vdom.createElem(elementName, attribs, childrenEls);
		$inputEl.classList.add(this.selector);

		if(isInput) {
			$inputEl.classList.add('form-control');
		}

		this.$inputEl = $inputEl;
		return $inputEl;
	}

	static getTemplateFields(type) {
		return FormField.prototype.getTemplateFields(type);
	}

	getTemplateFields(type=this.type) {

		const template = { label: 'Form field' };

		switch(type) {
			case FormField.TEXT_FIELD: {
				Object.assign(template, {
					placeholder: 'Eg - Wowness',
					label: 'Enter value',
				});
				break;
			}
			case FormField.TEXT_AREA: {
				Object.assign(template, {
					placeholder: 'Eg - Something cool',
					label: 'Enter value',
				});
				break;
			}
			case FormField.SELECT_FIELD: {
				Object.assign(template, {
					options_: [],
					label: 'Select Value',
				});
				break;
			}
			case FormField.HTML_CONTENT: {
				Object.assign(template, {
					innerHTML: 'This is content!',
				});
				break;
			}
		}

		return template;
	}
}
