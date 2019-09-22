import { writable } from 'svelte/store';

const properties = writable([]);

// create custom store
const customPropertiesStore = {
	subscribe: properties.subscribe,
	setProperties: (propertyArray) => {
		properties.set(propertyArray);
	},
	addProperty: (propertyData) => {
		const newProperty = {
			...propertyData
		};
		// add to properties object
		properties.update(items => {
			return [newProperty, ...items];
		})
	},
	updateProperty: (id, propertyData) => {
		properties.update(items => {
			const propertyIndex = items.findIndex(i => i.id === id);
			const updatedProperty = { ...items[propertyIndex], ...propertyData }; // pull out and merge all data
			const updatedProperties = [...items]; // copy all of the items
			updatedProperties[propertyIndex] = updatedProperty; // replace with copied meetup
			return updatedProperties;
		});
	},
	removeProperty: (id) => {
		properties.update(items => {
			return items.filter(i => i.id !== id);
		});
	},
	toggleProperty: (id) => {
		properties.update(items => {
			const updatedProperty = { ...items.find(m => m.id === id) }; // extract and add to new object and not mutate original array
			updatedProperty.is_active = !updatedProperty.is_active; // toggle value
			const propertyIndex = items.findIndex(m => m.id === id); // find index of meetup by id
			const updatedProperties = [...items]; // copy of existent properties
			updatedProperties[propertyIndex] = updatedProperty; // override it with updated meetup
			return updatedProperties; //
		})
	}
}

export default customPropertiesStore;