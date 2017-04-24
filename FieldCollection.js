
import FormField from './FormField';


/**
 * Collection for forms(map-like interfaced list)
 */
export default class FieldCollection {

	constructor() {
		this.arr = [];
	}

	/**
	 * Get the value using a key
	 * @param  {String} id
	 * @return {FormField}
	 */
	get(id) {
		const matches = this.arr.filter(field => field.id === id);
		return (matches.length)? matches[0]: null;
	}

	/**
	 * Set the value of a field with the id
	 * @param {String}    id
	 * @param {FormField} field
	 */
	set(id, field) {
		const match = this.get(id);
		(!match)?
			this.arr.push(field):
			(this.arr[this.arr.indexOf(match)] = field);
	}

	/**
	 * Remove the item with the given id
	 * @param  {String} id
	 */
	delete(id) {
		const match = this.get(id);
		if(match) {
			const index = this.arr.indexOf(match);
			this.arr.splice(index, 1);
		}
	}

	/**
	 * Swap elements
	 */
	swap(index, swapIndex) {

		if(index >= 0 && swapIndex >= 0 && swapIndex < this.arr.length) {
			const tmp = this.arr[swapIndex];
			this.arr[swapIndex] = this.arr[index];
			this.arr[index] = tmp;
			return true;
		}

		return false;
	}

	/**
	 * Iterate through each field in the collection
	 * @param  {Function} callback
	 * @return {Array}
	 */
	forEach(callback) {
		if(typeof callback === 'function')
			return this.arr.map((field, i) => callback(field, i));

		return [];
	}

	/**
	 * Get the index of a field
	 * @param  {FormField} field
	 * @return {Number}
	 */
	indexOf(field) {
		return this.arr.indexOf(field);
	}

	// Conver the fields collection to json
	toJSON() { return JSON.stringify(this.toArray()); }

	// Convert the field collection to an array
	toArray() {
		return this.arr.map(field => ({
			type: field.type,
			id: field.id,
			attribs: field.attribs,
		}));
	}

	// Load an array as a field collection
	loadArray(fields) {
		return fields
			.map(fieldOptns => new FormField(fieldOptns.type, fieldOptns.id, fieldOptns.attribs))
			.map(field => this.set(field.id, field));
	}


	/**
	 * Validate all fields in the collection
	 * @return {Object}  (Schema: { isValid boolean; field FormField; })
	 */
	validate() {

		let isValid = true;
		let field = null;

		this.forEach(inpField => {
			if(isValid) {
				isValid = inpField.validate();
				field = inpField;
			}
		});

		return { isValid, field };
	}
}
