/*!=========================================
 * animatedModal.js: Version 1.0
 * author: João Pereira
 * website: http://www.joaopereira.pt
 * email: joaopereirawd@gmail.com
 * Licensed MIT 
 =========================================*/

(function(window, $, undefined) {
	"use strict";

	var animateEndEventNames = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

	$.animatedModal = function(options) {
		//Defaults
		var settings = $.extend({
			closeButtonSelector: '.close',
			opacityIn: '1',
			opacityOut: '0',
			zIndexIn: '9999',
			zIndexOut: '-9999',
			animatedIn: 'zoomIn',
			animatedOut: 'zoomOut'
		}, options);

		var css = $.extend({
			position: 'fixed',
			width: '100%',
			height: '100%',
			top: '0px',
			left: '0px',
			overflow: 'auto',
			backgroundColor: '#39BEB9',
			animationDuration: '0.6s'
		}, settings.css);

		var $modal = $('<section />', {
			'class': ['animated-modal', settings.className, 'animated', settings.animatedIn].join(' ')
		}).css($.extend({
			zIndex: settings.zIndexOut,
			opacity: settings.opacityOut
		}, css)).on({
			click: function(e) {
				e.preventDefault();
				$('body, html').css('overflow', 'auto');
				$modal.trigger('beforeClose');
				$modal.one(animateEndEventNames, function() {
					$modal.trigger('afterClose').remove();
				}).removeClass(settings.animatedIn).addClass(settings.animatedOut);
			}
		}, settings.closeButtonSelector);

		var $content = $(settings.content);
		if ($content.length === 0) {
			throw new Error('property "content" is required.');
		}

		$modal.append($content.clone()).appendTo('body').one(animateEndEventNames, function() {
			$modal.trigger('afterOpen');
		}).css({
			opacity: settings.opacityIn,
			zIndex: settings.zIndexIn
		});
		$('body, html').css('overflow', 'hidden');

		return $modal;
	};

	$.fn.animatedModal = function(options) {
		return $(this).each(function() {
			var $elm = $(this);
			$elm.on('click', function(e) {
				e.preventDefault();
				if ($elm.data('animatedModal') === true) {
					return;
				}
				$elm.data('animatedModal', true);
				$elm.trigger('beforeOpen');
				$.animatedModal(options).on({
					afterOpen: function() {
						$elm.trigger('afterOpen');
					},
					beforeClose: function() {
						$elm.trigger('beforeClose');
					},
					afterClose: function() {
						$elm.data('animatedModal', false);
						$elm.trigger('afterClose');
					}
				});
			});
		});
	};
}(window, jQuery));



