
import * as vdom from './vdom';
import FieldCollection from './FieldCollection';
import FormField from './FormField';


export default class FormGenerator {

	static renderEditModal($el, field) {

		$el.dataset.fieldID = field.id;

		const template = field.getTemplateFields();
		const $wrapper = $el.querySelector('.js-render-options');
		let $arrInput = null;

		vdom.unrender($wrapper);

		const arrayInpChange = (render) => {};

		if($wrapper) {
			Object
				.keys(template)
				.map(attr => ({
					value: template[attr],
					name: attr,
					placeholder: attr,
					class: 'form-control',
					label: attr,
				}))
				.map(attribs => {
					if(Array.isArray(attribs.value)) {
						$arrInput = vdom.createArrayInput(attribs, arrayInpChange);
						return $arrInput;
					}

					return vdom.createElem('input', attribs);
				})
				.map($input => $wrapper.appendChild(vdom.labeledInput($input)));
		}

		Object
			.keys(field.attribs)
			.forEach(attr => {

				const $input = $el.querySelector(`[name=${attr}]`);

				if($input) {
					$input.value = field.attribs[attr];
				}
			});
	}


	constructor(config) {

		this.initConstants();
		this.$parent = document.querySelector(config.selector);

		this.$previewWrapper = this.$parent.querySelector(this.PREVIEW_WRAPPER);
		this.$addFieldBtns = this.$parent.querySelectorAll(this.ADD_FIELD_BTN);

		this.fields = new FieldCollection();
		this.controls = true;
	}

	initConstants() {
		this.PREVIEW_WRAPPER = '.js-preview';
		this.ADD_FIELD_BTN = '.js-add-field';
	}

	get fieldID() {
		const random = Math.floor(Math.random() * 100000);
		return random.toString(16) + Date.now().toString();
	}

	unrenderFields() {
		vdom.unrender(this.$previewWrapper);
	}

	removeField(fieldID) {
		this.fields.delete(fieldID);
		this.renderFields();
	}

	appendField(field, $container = this.$previewWrapper) {
		const $fieldEl = vdom.labeledInput(field.getElement(), field.attribs.label);
		const $wrapper = vdom.div({ 'class': 'input-wrapper' }, [ $fieldEl ]);

		if(this.controls) {
			$wrapper.appendChild(this.getControlPanel(field));
		}

		$container.appendChild($wrapper);
	}

	renderString() {
		const $wrapper = vdom.createElem('div');
		this.fields.forEach(field => this.appendField(field, $wrapper));
		return $wrapper.outerHTML;
	}

	renderFields(keys=[]) {
		if(keys.length) {
			keys.map(key => this.appendField(this.fields.get(key)));
		} else {
			this.unrenderFields();
			this.fields.forEach(field => this.appendField(field));
		}
	}

	addField(type, attribs) {

		const id = this.fieldID;
		const field = new FormField(type, id, attribs);

		this.fields.set(id, field);
		return id;
	}

	getControlPanel(field) {

		const $editBtn = vdom.controlButton('Edit', 'btn-warning', () => {
			if(typeof this.editCallback === 'function')
				this.editCallback(field.id, field);
		});

		const $removeBtn = vdom.controlButton('Remove', 'btn-danger',
			() => this.removeField(field.id)
		);

		const $pullUp = vdom.controlButton('Up', 'btn-primary', () => {
			const index = this.fields.indexOf(field);
			if(this.fields.swap(index, index - 1))
				this.renderFields();
		});

		const $pullDown = vdom.controlButton('Down', 'btn-primary', () => {
			const index = this.fields.indexOf(field);
			if(this.fields.swap(index, index + 1))
				this.renderFields();
		});

		return vdom.div(
			{ 'class': 'control-box' },
			[ $editBtn, $removeBtn, $pullUp, $pullDown ]
		);
	}
}