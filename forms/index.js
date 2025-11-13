// Defensive client-side script for form validation.
// This file is safe to include on every page in the site root.
document.addEventListener('DOMContentLoaded', function () {
	// Only run if the demo form exists on the page
	const form = document.getElementById('demoForm');
	const nameInput = document.getElementById('name');

	if (!form || !nameInput) {
		// nothing to do on this page
		return;
	}

	// Simple client-side validation: name length >= 6
	form.addEventListener('submit', function (e) {
		// remove previous inline message if present
		const prevErr = document.getElementById('nameError');
		if (prevErr) prevErr.remove();

		const value = nameInput.value.trim();
		if (value.length < 6) {
			e.preventDefault();
			nameInput.style.borderColor = 'red';
			nameInput.focus();

			const msg = document.createElement('div');
			msg.id = 'nameError';
			msg.style.color = 'red';
			msg.style.marginTop = '8px';
			msg.textContent = 'Name must be at least 6 characters.';
			nameInput.parentNode.insertBefore(msg, nameInput.nextSibling);
			return false;
		}

		// OK — reset styles
		nameInput.style.borderColor = '';
		return true;
	});
});