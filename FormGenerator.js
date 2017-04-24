
import * as vdom from './vdom';
import FieldCollection from './FieldCollection';
import FormField from './FormField';


/**
 * Form generator
 */
export default class FormGenerator {

	/**
	 * Render the edit page modal
	 * @param  {HTMLElement}  $el    Parent div to render the fields in
	 * @param  {FormField}    field  What to generate inside the formfield
	 */
	static renderEditModal($el, field) {

		$el.dataset.fieldID = field.id;

		const template = field.getTemplateFields();
		const $wrapper = $el.querySelector('.js-render-options');
		let $arrInput = null;

		// Clear the parent
		vdom.unrender($wrapper);

		// If the wrapper exists
		if($wrapper) {
			Object
				.keys(template)
				.map(attr => ({
					class: 'form-control', value: template[attr],
					name: attr, label: attr, placeholder: attr,
				}))
				.map(attribs =>
					(Array.isArray(attribs.value))?
						vdom.createArrayInput(attribs, () => null):
						vdom.createElem('input', attribs)
				)
				.concat([ vdom.text('NOTE: Possible validation inputs: email, required') ])
				.map($input => $wrapper.appendChild(vdom.labeledInput($input)));
		}

		// Set all the values in the rendered edit form
		Object
			.keys(field.attribs)
			.map(attr => ({ $el: $el.querySelector(`[name=${attr}]`), value: field.attribs[attr] }))
			.filter(attr => attr.$el)
			.forEach(attr => attr.$el.value = attr.value);
	}


	constructor(config) {

		this.initConstants();
		this.$parent = document.querySelector(config.selector);

		this.$previewWrapper = this.$parent.querySelector(this.PREVIEW_WRAPPER);
		this.$addFieldBtns = this.$parent.querySelectorAll(this.ADD_FIELD_BTN);

		this.fields = new FieldCollection();
		this.controls = true;
	}

	// RELEASE THE KONSTANTS!
	initConstants() {
		this.PREVIEW_WRAPPER = '.js-preview';
		this.ADD_FIELD_BTN = '.js-add-field';
	}

	// Field id getter(generate a random id everytime)
	get fieldID() {
		const random = Math.floor(Math.random() * 100000);
		return random.toString(16) + Date.now().toString();
	}

	/**
	 * Unrender the root field wrapper
	 */
	unrenderFields() {
		vdom.unrender(this.$previewWrapper);
	}

	/**
	 * Remove a field from the project
	 * @param  {String} fieldID  The id of the field to remove
	 */
	removeField(fieldID) {
		this.fields.delete(fieldID);
		this.renderFields();
	}

	/**
	 * Append a field inside the wrapper
	 * @param  {FormField} field
	 * @param  {HTMLElement} $container
	 */
	appendField(field, $container = this.$previewWrapper) {

		const $fieldEl = vdom.labeledInput(field.getElement(), field.attribs.label);
		const $wrapper = vdom.div({ 'class': 'input-wrapper' }, [ $fieldEl ]);

		// To render the controls or not to render the controls
		if(this.controls)
			$wrapper.appendChild(this.getControlPanel(field));

		$container.appendChild($wrapper);
	}

	/**
	 * Render the form into a string
	 * @return {String}
	 */
	renderString() {
		const $wrapper = vdom.createElem('div');
		this.fields.forEach(field => this.appendField(field, $wrapper));
		return $wrapper.outerHTML;
	}

	/**
	 * Render the fields
	 * @param  {Array}  keys  ID of the field to render(will render all fields if empty)
	 */
	renderFields(keys=[]) {
		if(keys.length) {
			keys.map(key => this.appendField(this.fields.get(key)));
		} else {
			this.unrenderFields();
			this.fields.forEach(field => this.appendField(field));
		}
	}


	/**
	 * Add a new form field
	 * @param {String} type     The Form field Type
	 * @param {Object} attribs  Field attributes
	 */
	addField(type, attribs) {

		const id = this.fieldID;
		const field = new FormField(type, id, attribs);

		this.fields.set(id, field);
		return id;
	}


	/**
	 * Get the control panel for each field
	 * @param  {FormField}   field
	 * @return {HtmlElement}
	 */
	getControlPanel(field) {

		// Edit button
		const $editBtn = vdom.controlButton('Edit', 'btn-warning', () => {
			if(typeof this.editCallback === 'function')
				this.editCallback(field.id, field);
		});

		// Remove button
		const $removeBtn = vdom.controlButton('Remove', 'btn-danger',
			() => this.removeField(field.id)
		);

		// Pull the field up an index
		const $pullUp = vdom.controlButton('Up', 'btn-primary', () => {
			const index = this.fields.indexOf(field);
			if(this.fields.swap(index, index - 1))
				this.renderFields();
		});

		// Pull the field down an index
		const $pullDown = vdom.controlButton('Down', 'btn-primary', () => {
			const index = this.fields.indexOf(field);
			if(this.fields.swap(index, index + 1))
				this.renderFields();
		});

		// Wrap it all up, literally
		return vdom.div(
			{ 'class': 'control-box' },
			[ $editBtn, $removeBtn, $pullUp, $pullDown ]
		);
	}
}