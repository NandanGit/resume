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
	sections: {
		education: getElem('education'),
		skills: getElem('skills'),
		projects: getElem('projects'),
		contact: getElem('contact'),
		messageMe: getElem('message-me'),
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
		forceLightTheme() {
			const target = DOM.themeContainer;
			target.classList.remove('dark-theme');
			target.classList.add('light-theme');
		},
		forceDarkTheme() {
			const target = DOM.themeContainer;
			target.classList.add('dark-theme');
			target.classList.remove('light-theme');
		},
		updateEducation(education) {
			let finalHTML = '<h2>Education & Employment</h2>';
			education.forEach(({ title, qualification, score }) => {
				finalHTML += `<div class="sub-education">
							<hr />
							<h4>${title}</h4>
							<div class="qualification">
								<p>${qualification}</p>
								<p>${score}</p>
							</div>
						</div>`;
			});
			finalHTML = finalHTML.replace(/\n/g, '').replace(/\t/g, '');
			DOM.sections.education.innerHTML = finalHTML;
		},
		updateSkills(skills) {
			let finalHTML = '<h2>Skills</h2>';
			skills.forEach(({ skillSet, subSkills }) => {
				finalHTML += `<div class="sub-skills">
							<hr />
							<h4>${skillSet}</h4>
							<div class="programming-languages badges-container">
								${subSkills.map((skill) => '<span class="badge">' + skill + '</span>').join('')}
							</div>
						</div>`;
			});
			finalHTML = finalHTML.replace(/\n/g, '').replace(/\t/g, '');
			DOM.sections.skills.innerHTML = finalHTML;
		},
		updateProjects(projects) {
			let finalHTML = '<h2>Projects</h2>';
			projects.forEach(({ title, description, sourceCodeUrl, appUrl }) => {
				finalHTML += `<div class="sub-project"> <hr /> <h4>${title}</h4> <p> ${description} </p> <div class="badges-container"> <span class="badge" ><a target="_blank" href="${sourceCodeUrl}" ><i class="fab fa-github icon"></i> See Code</a ></span > <span class="badge" ><a target="_blank" href="${appUrl}" >Try App</a ></span > </div> </div>`;
			});
			finalHTML = finalHTML.replace(/\n/g, '').replace(/\t/g, '');
			DOM.sections.projects.innerHTML = finalHTML;
		},
		resumeMode(mode = 'light') {
			if (mode !== 'light' && mode !== 'dark') {
				return;
			}
			document.querySelector('html').style.backgroundColor = `var(--${mode})`;
			if (mode === 'light') {
				this.forceLightTheme();
			} else {
				this.forceDarkTheme();
			}
			DOM.themeChangerButtonElement.style.display = 'none';
			DOM.sections.messageMe.style.display = 'none';
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
		init() {
			// Populate the Sections
			UI.updateEducation(Details.education);
			UI.updateSkills(Details.skills);
			UI.updateProjects(Details.projects);
		},
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
				const stringifiedMessage = new URLSearchParams(messageObj).toString();
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
				event.target.closest('.form-control').classList.remove('active-input');
			}
		});
	});
})();

// Initialize
Logic.init();
