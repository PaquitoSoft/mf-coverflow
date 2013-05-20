/*global Class, Options */
(function() {
	'use strict';

	window.MFCoverflow = new Class({

		$container: null,
		$leftCover: null,
		$activeCover: null,
		$rightCover: null,

		Implements: [Options],

		initialize: function(options) {
			var $images;
			if (options) {
				this.setOptions(options);
			}

			this.$container = document.id(this.options.containerEl).addClass('mf-coverflow');
			this.$container.getElement('ul').addClass('mf-list');
			$images = this.$container.getElements('li').addClass('mf-item hidden');
			this.$container.getElements('li img').addClass('mf-cover');
			this.$container.setStyle('visibility', 'visible');

			this.$leftCover = $images[0].addClass('left-cover').removeClass('hidden');
			this.$activeCover = $images[1].addClass('active-cover').removeClass('hidden');
			this.$rightCover = $images[2].addClass('right-cover').removeClass('hidden');

			this.configureHandlers();

		},

		configureHandlers: function() {
			var self = this,
				$body = document.id(document.body);

			$body.addEvent('click:relay(' + this.options.leftControl + ')', function(e) {
				e.preventDefault();
				self.move('left');
			});
			$body.addEvent('click:relay(' + this.options.rightControl + ')', function(e) {
				e.preventDefault();
				self.move('right');
			});
		},

		move: function(mode) {
			var $newCover = (mode === 'left') ? this.$rightCover.getNext('.mf-item') : 
				this.$leftCover.getPrevious('.mf-item');

			if (mode === 'left' && $newCover) {
				$newCover.addClass('right-cover').removeClass('hidden');
				this.$rightCover.removeClass('right-cover').addClass('active-cover');
				this.$activeCover.removeClass('active-cover').addClass('left-cover');
				this.$leftCover.removeClass('left-cover').addClass('hidden');

				this.$leftCover = this.$activeCover;
				this.$activeCover = this.$rightCover;
				this.$rightCover = $newCover;

			} else if (mode === 'right' && $newCover) {
				$newCover.addClass('left-cover').removeClass('hidden');
				this.$leftCover.removeClass('left-cover').addClass('active-cover');
				this.$activeCover.removeClass('active-cover').addClass('right-cover');
				this.$rightCover.removeClass('right-cover').addClass('hidden');

				this.$rightCover = this.$activeCover;
				this.$activeCover = this.$leftCover;
				this.$leftCover = $newCover;
			}
		}

	});

}());
