//////////////////////////////////// DOM Elements ////////////////////////////////////
const DOM = {
	themeChangerButtonElement: document.getElementById('theme-changer'),
	themeContainer: document.getElementById('theme'),
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

//////////////////////////////////// Controllers /////////////////////////////////////
DOM.themeChangerButtonElement.addEventListener('click', (event) => {
	// console.log('Clicked');
	UI.switchTheme();
});
