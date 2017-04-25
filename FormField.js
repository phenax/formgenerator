
import * as vdom from './vdom';


/**
 * Email validation regular expression
 * @type {RegExp}
 */
const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


/**
 * Each field in the form collection
 */
export default class FormField {

	// Element type for the form field
	static get TEXT_FIELD() { return 'TEXT_FIELD'; }
	static get TEXT_AREA() { return 'TEXT_AREA'; }
	static get SELECT_FIELD() { return 'SELECT_FIELD'; }
	static get HTML_CONTENT() { return 'HTML_CONTENT'; }
	static get FILE_UPLOAD() { return 'FILE_UPLOAD'; }

	// Validation method constants
	static REQUIRED_VALIDATION(input) { return !!input; }
	static LENGTH_VALIDATION(input, size) { return input.length >= size; }
	static EMAIL_VALIDATION(email) {return EMAIL_REGEX.test(email); }
	static NO_VALIDATION() { return true; }


	/**
	 * Validation function getter
	 * @param  {String}   type   Validation identifier
	 * @return {Function}        Validation function
	 */
	static getValidationFn(type) {
		switch(type) {
			case 'required': return FormField.REQUIRED_VALIDATION;
			case 'email': return FormField.EMAIL_VALIDATION;
			default: return FormField.NO_VALIDATION;
		}
	}


	/**
	 * Error message getter
	 * @return {String}
	 */
	get ERROR_MESSAGE() {
		switch(this.attribs.validationType) {
			case 'required': return 'This field is required';
			case 'email': return 'The email you entered is invalid';
			default: return 'Something went wrong';
		}
	}


	// Constructor
	constructor(type, id, attribs={}) {
		this.id = id;
		this.type = type;
		this.attribs = attribs;
		this.selector = `.js-form-input-el--${this.id}`;

		const validationFn =
			FormField.getValidationFn(this.attribs.validationType);
		this.validate = () => validationFn(this.$inputEl.value);
	}


	/**
	 * Render and get the element
	 * @param  {Object}       attribs  Attributes/Props
	 * @param  {Boolean}      merge    To merge or not to merge the attributes
	 * @return {HTMLElement}           Rendered element
	 */
	getElement(attribs=this.attribs, merge=true) {

		// Merge the config
		if(merge) {
			attribs = Object.assign(this.attribs, attribs);
		}

		let elementName = 'input';
		let childrenEls = null;
		let isInput = true;

		// Configure the element depending on its type
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
			case FormField.FILE_UPLOAD: {
				elementName = 'input';
				attribs.type = 'file';
				break;
			}
		}

		attribs.name = attribs.name || this.id;

		// If the element has children, render them
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

		// For inputs, add the form control class
		if(isInput) $inputEl.classList.add('form-control');

		this.$inputEl = $inputEl;
		return $inputEl;
	}


	/**
	 * Get template fields
	 *  (Static version of the instance method)
	 */
	static getTemplateFields(type) {
		return FormField.prototype.getTemplateFields(type);
	}

	/**
	 * Get template fields
	 * @param  {String} type  The element type (default:this.type)
	 * @return {Object}       The element template
	 */
	getTemplateFields(type=this.type) {

		const template = { label: 'Some content' };

		// Extend the attributes
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
			case FormField.FILE_UPLOAD: {
				Object.assign(template, {
					label: 'Upload image',
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


	/**
	 * Mark the field as invalid (after validation)
	 * @param  {String} text
	 */
	markInvalid(text = 'The value you entered is invalid') {

		this.unmark();

		this.$invalidMessage = vdom.div({}, [ text ]);

		this.$inputEl.style.borderColor = this.$invalidMessage.style.color = '#e74c3c';
		this.$inputEl.parentNode.appendChild(this.$invalidMessage);
	}


	/**
	 * Unmark the field(if not invalid)
	 */
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
