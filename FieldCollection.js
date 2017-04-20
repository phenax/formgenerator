
import FormField from './FormField';

export default class FieldCollection {

	constructor() {
		this.arr = [];
	}

	get(id) {
		const matches = this.arr.filter(field => field.id === id);
		return (matches.length)? matches[0]: null;
	}

	set(id, field) {
		const match = this.get(id);
		(!match)?
			this.arr.push(field):
			(this.arr[this.arr.indexOf(match)] = field);
	}

	delete(id) {
		const match = this.get(id);
		if(match) {
			const index = this.arr.indexOf(match);
			this.arr.splice(index, 1);
		}
	}

	swap(index, swapIndex) {

		if(index >= 0 && swapIndex >= 0 && swapIndex < this.arr.length) {
			const tmp = this.arr[swapIndex];
			this.arr[swapIndex] = this.arr[index];
			this.arr[index] = tmp;
			return true;
		}

		return false;
	}

	toJSON() { return JSON.stringify(this.toArray()); }
	toArray() {
		return this.arr.map(field => ({
			type: field.type,
			id: field.id,
			attribs: field.attribs,
		}));
	}
	loadArray(fields) {
		return fields
			.map(field => new FormField(field.type, field.id, field.attribs))
			.map(field => this.set(field.id, field));
	}
}
