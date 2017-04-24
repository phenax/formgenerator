
import * as vdom from './vdom';


/**
 * Email validation regular expression
 * @type {RegExp}
 */
const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



export default class FormField {

	// Element type for the form field
	static get TEXT_FIELD() { return 'TEXT_FIELD'; }
	static get TEXT_AREA() { return 'TEXT_AREA'; }
	static get SELECT_FIELD() { return 'SELECT_FIELD'; }
	static get HTML_CONTENT() { return 'HTML_CONTENT'; }

	static REQUIRED_VALIDATION(input) { return !!input; }
	static LENGTH_VALIDATION(input, size) { return input.length >= size; }
	static NO_VALIDATION() { return true; }
	static EMAIL_VALIDATION(email) {return EMAIL_REGEX.test(email); }


	static getValidationFn(type) {
		switch(type) {
			case 'required': return FormField.REQUIRED_VALIDATION;
			case 'email': return FormField.EMAIL_VALIDATION;
			default: return FormField.NO_VALIDATION;
		}
	}


	constructor(type, id, attribs={}) {
		this.id = id;
		this.type = type;
		this.attribs = attribs;
		this.selector = `.js-form-input-el--${this.id}`;

		const validationFn =
			FormField.getValidationFn(this.attribs.validationType);
		this.validate = () => validationFn(this.$inputEl.value);
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
			childrenEls =
				childrenEls
					.filter(elem => elem.textContent || elem.innerHTML)
					.map(elem => vdom.createElem(elem.tagname, elem));
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
					validationType: 'required',
				});
				break;
			}
			case FormField.TEXT_AREA: {
				Object.assign(template, {
					placeholder: 'Eg - Something cool',
					label: 'Enter value',
					validationType: 'required',
				});
				break;
			}
			case FormField.SELECT_FIELD: {
				Object.assign(template, {
					options_: [],
					label: 'Select Value',
					validationType: 'required',
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


	markInvalid(text = 'The value you entered is invalid') {

		this.unmark();

		this.$invalidMessage = vdom.div({}, [ vdom.text(text) ]);

		this.$inputEl.style.borderColor = this.$invalidMessage.style.color = '#e74c3c';
		this.$inputEl.parentNode.appendChild(this.$invalidMessage);
	}

	unmark() {
		if(this.$invalidMessage) {
			try {
				this.$inputEl.parentNode.removeChild(this.$invalidMessage);
				this.$inputEl.style.borderColor = '#ddd';
				this.$invalidMessage = null;
			} catch(e) { console.log(e); }
		}
	}
}
