export function getFormData<T extends Record<string, FormDataEntryValue | FormDataEntryValue[]>>(
	form: HTMLFormElement
): T {
	if (!form.checkValidity()) throw new Error('Form is not valid!');
	const formData = new FormData(form);
	const data: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
	for (const [key, val] of formData.entries()) {
		if (key in data) {
			const oldVal = data[key];
			if (Array.isArray(oldVal)) oldVal.push(val);
			else data[key] = [oldVal, val];
		} else {
			data[key] = val;
		}
	}

	return data as T;
}
