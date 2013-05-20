/*global MFCoverflow */
(function() {
	'use strict';

	window.addEvent('domready', function() {
		var moviesCoverflow = new MFCoverflow({
			containerEl: 'movies-coverflow',
			leftControl: '.left-arrow',
			rightControl: '.right-arrow'
		});
	});

}());