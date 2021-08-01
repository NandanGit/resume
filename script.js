//////////////////////////////////// DOM Elements ////////////////////////////////////
const getElem = (elemId, root = document) => root.getElementById(elemId);
const DOM = {
	themeChangerButtonElement: getElem('theme-changer'),
	themeContainer: getElem('theme'),
	messageForm: getElem('message-form'),
	messageFormElements: {
		nameField: getElem('message-form__name'),
		emailField: getElem('message-form__email'),
		messageField: getElem('message-form__message'),
	},
};

///////////////////////////////////// UI Methods /////////////////////////////////////
const UI = (function () {
	return {
		switchTheme() {
			const target = DOM.themeContainer;
			target.classList.toggle('dark-theme');
			target.classList.toggle('light-theme');
		},
	};
})();

/////////////////////////////////////// Logic ////////////////////////////////////////
const Utilities = (function () {
	return {
		isValidEmail(email) {
			const re =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		},
	};
})();

const Logic = (function () {
	return {
		messageForm: {
			validate() {
				const errors = [];
				const messageForm = DOM.messageForm;
				const formData = new FormData(messageForm);

				const name = formData.get('name').trim();
				if (!name) {
					errors.push('Name is required.');
				}
				const email = formData.get('email').trim();
				if (!email) {
					errors.push('Email is required.');
				} else if (Utilities.isValidEmail(email) === false) {
					errors.push('Email is invalid.');
				}
				const message = formData.get('message');
				if (!message) {
					errors.push('Message is required.');
				}
				const formattedFormData = {
					name,
					email,
					message,
				};
				const validationResult = {
					isValid: errors.length === 0,
					errors,
					formattedFormData,
				};
				return validationResult;
			},
			sendMessage(messageObj) {
				// console.log(messageObj);
				const stringifiedMessage = new URLSearchParams(
					messageObj
				).toString();
				console.log(stringifiedMessage);
				fetch('/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: stringifiedMessage,
				})
					.then(() => console.log('Form successfully submitted'))
					.catch((error) => alert(error));
			},
		},
	};
})();

//////////////////////////////////// Controllers /////////////////////////////////////
DOM.themeChangerButtonElement.addEventListener('click', (event) => {
	// console.log('Clicked');
	UI.switchTheme();
});

(function () {
	const inputElements = Object.values(DOM.messageFormElements);
	console.log(inputElements);
	inputElements.forEach((inputElement) => {
		inputElement.addEventListener('focus', (event) => {
			// console.log(event.target.value);
			event.target.closest('.form-control').classList.add('active-input');
		});
		inputElement.addEventListener('blur', (event) => {
			if (!event.target.value.trim()) {
				event.target
					.closest('.form-control')
					.classList.remove('active-input');
			}
		});
	});
})();

// DOM.messageForm.addEventListener('submit', (event) => {
// 	event.preventDefault();
// 	const {
// 		isValid: isFormValid,
// 		errors,
// 		formattedFormData: formData,
// 	} = Logic.messageForm.validate();

// 	if (!isFormValid) {
// 		return console.log(errors);
// 	}
// 	Logic.messageForm.sendMessage(formData);
// 	// console.log(formData);
// });
