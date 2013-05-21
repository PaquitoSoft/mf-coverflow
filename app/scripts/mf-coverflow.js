/*global Class, Options */
(function() {
	'use strict';

	window.MFCoverflow = new Class({

		TRANSITIONS_DURATION: 1000, // milliseconds

		$container: null,
		$leftCover: null,
		$activeCover: null,
		$rightCover: null,

		leftPos: 0,
		centerPos: 0,
		rightPos: 0,
		lateralCoverWidth: 0,
		centerCoverWidth: 0,
		centerCoverHeight: 175,
		lateralCoverHeight: 142,

		Implements: [Options],

		initialize: function(options) {
			if (options) {
				this.setOptions(options);
			}

			this.$container = document.id(this.options.containerEl);

			this.configureMarkup();

			this.configureEvents();

			this.locateElements();

			setTimeout(function() {
				this.$container.getElements('.mf-cover').setStyle('-webkit-transition', 'all ' + this.TRANSITIONS_DURATION + 'ms');
			}.bind(this), this.TRANSITIONS_DURATION + 5);
		},

		configureMarkup: function() {
			var $images;
			this.$container.addClass('mf-coverflow');
			this.$container.getElement('ul').addClass('mf-list');
			$images = this.$container.getElements('li img').addClass('mf-cover hidden');
			this.$container.setStyle('visibility', 'visible');

			this.$container.getElements('li').addClass('mf-item');
			this.$leftCover = $images[0].addClass('left-cover').removeClass('hidden');
			this.$activeCover = $images[1].addClass('active-cover').removeClass('hidden');
			this.$rightCover = $images[2].addClass('right-cover').removeClass('hidden');
		},

		locateElements: function() {
			var ulSize = this.$activeCover.getParent('ul').getSize();
			this.centerPos = ulSize.x * 0.23;
			this.rightPos = ulSize.x * 0.563;
			this.lateralCoverWidth = ulSize.x * 0.45;
			this.centerCoverWidth = ulSize.x * 0.55;

			this.$activeCover.setStyles({
				left: this.centerPos,
				width: this.centerCoverWidth,
				height: this.centerCoverHeight
			});
			this.$leftCover.setStyles({
				width: this.lateralCoverWidth,
				height: this.lateralCoverHeight
			});
			this.$rightCover.setStyles({
				left: this.rightPos,
				width: this.lateralCoverWidth,
				height: this.lateralCoverHeight
			});
		},

		configureEvents: function() {
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

		moveToLeft: function($el) {
			if ($el.getStyle('opacity') > 0) {
				this.$leftCover.setStyle('opacity', 0);
			}
			$el.setStyles({
				left: 0,
				opacity: 0.8,
				width: this.lateralCoverWidth,
				height: this.lateralCoverHeight,
				'-webkit-transform': 'translate3d(0, 0, 0) perspective(600px) rotateY(45deg)'
			});
			this.$leftCover = $el.addClass('left-cover');
		},

		moveToCenter: function($el) {
			$el.setStyles({
				left: this.centerPos,
				width: this.centerCoverWidth,
				height: this.centerCoverHeight,
				opacity: 1,
				'z-index': 0,
				'-webkit-transform': 'none'
			});
			this.$activeCover = $el.addClass('active-cover');
		},

		moveToRight: function($el) {
			var newEl = $el.getStyle('opacity') <= 0;
			if (!newEl) {
				this.$rightCover.setStyle('opacity', 0);
			} else {
				$el.setStyle('-webkit-transition', 'none');
			}
			$el.setStyles({
				opacity: 0.8,
				left: this.rightPos,
				width: this.lateralCoverWidth,
				height: this.lateralCoverHeight,
				'z-index': -10,
				'-webkit-transform': 'translate3d(0, 0, 0) perspective(600px) rotateY(-45deg)'
			});
			this.$rightCover = $el.addClass('right-cover');
			if (newEl) {
				setTimeout(function() {
					$el.setStyle('-webkit-transition', 'all ' + this.TRANSITIONS_DURATION + 'ms');
				}.bind(this), this.TRANSITIONS_DURATION + 5);
			}
		},

		getRelativeCover: function($cover, mode) {
			var fn = (mode === 'left') ? $cover.getNext : $cover.getPrevious,
				$relativeMfItem = fn.call($cover.getParent('.mf-item'), '.mf-item');
			return ($relativeMfItem) ? $relativeMfItem.getElement('.mf-cover') : null;
		},

		move: function(mode) {
			var $newCover = this.getRelativeCover((mode === 'left') ? this.$rightCover : this.$leftCover, mode);

			if (mode === 'left' && $newCover) {
				this.moveToLeft(this.$activeCover);
				this.moveToCenter(this.$rightCover);
				this.moveToRight($newCover);

			} else if (mode === 'right' && $newCover) {
				this.moveToRight(this.$activeCover);
				this.moveToCenter(this.$leftCover);
				this.moveToLeft($newCover);
			}
		}

	});

}());
