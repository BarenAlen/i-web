(function ($) {
	jQuery.fn.preloaderImg = function() {
		$(this).before('<div class="preloader"></div>');
		$(this).load( function() {
			$(this).prev().fadeOut(400, function() {
				$(this).remove();
			});
		});
		if (this.complete) $(this).load();
	};
	jQuery.fn.center = function (position) {
		$(this).css({
			position: position,
			top: 50 + '%',
			left: 50 + '%',
			marginTop: -(this.outerHeight() / 2),
			marginLeft: -(this.outerWidth() / 2),
		});

		return $(this);
	};
})(jQuery);

//Карусель.
function carousel(el, target) {
	var $jcarousel = $(el);

	$jcarousel.each(function () {
		if ($(this).find('.jcarousel-items__item').length > target + 1) {
			var prev = $(this).find('.js-jcarousel-prev'),
				next = $(this).find('.js-jcarousel-next');

			$(this).find('.js-jcarousel').jcarousel({
				animation: 1000,
				wrap: 'circular',
			});
			prev
				.jcarouselControl({
					target: '-=' + target,
				});
			next
				.jcarouselControl({
					target: '+=' + target,
				});
			prev.show();
			next.show();
		}
	})
}

//Окончания слов при числительных
function getCorrectCounter($num, $str1, $str2, $str3) {
	$val = $num % 100;

	if ($val > 10 && $val < 20) return $num + ' ' + $str3;
	else {
		$val = $num % 10;
		if ($val == 1) return $num + ' ' + $str1;
		else if ($val > 1 && $val < 5) return $num + ' ' + $str2;
		else return $num + ' ' + $str3;
	}
}

//Прелоадер для изображений.
function preloaderImg(el) {
	$(el).find('img').each( function() {
		$(this).before('<div class="preloader"></div>');
		$(this).load( function() {
			$(this).prev().fadeOut(400, function() {
				$(this).remove();
			});
		});
		if (this.complete) $(this).load();
	});
}

//Прелоадер для изображений.
function preloaderSmallImg(el) {
	$(el).find('.thumbnails-items__item').find('img').each( function() {
		$(this).before('<div class="preloader"></div>');
		$(this).load( function() {
			$(this).prev().fadeOut(400, function() {
				$(this).remove();
			});
		});
		if (this.complete) $(this).load();
	});
}

//Размеры окна
function getViewportSize() {
	var a = document.documentElement,
		d = document.body,
		b = document.compatMode == "CSS1Compat",
		c = window.opera,
		e = b && c ? window.innerWidth : b && !c ? a.clientWidth : d.clientWidth;
		a = b && c ? window.innerHeight : b && !c ? a.clientHeight : d.clientHeight;
	return [e, a]; //ширина и высота видимой части
}

function sizeWindowGallery() {
	$('.page').css({
		overflow: 'hidden',
		width: pageWidth,
	});

	$('.js-overlay').css({
		width: getViewportSize()[0],
		height: getViewportSize()[1],
		top: $(document).scrollTop(),
	});
}

//Карусель в всплывающей галерее.
function galleryCarousel(el, stage, thumbnails, counter) {
	var connector = function(itemThumbnails, carouselStage) {
		return carouselStage.jcarousel('items').eq(itemThumbnails.index());
	};

	var carouselStage 		= stage.jcarousel();
	var	carouselThumbnails 	= thumbnails.jcarousel();
	var itemCurrent 		= el.index();
	var itemCount 			= $('.js-portfolio-items').find('.js-gallery-open').length - 1;

	carouselThumbnails.jcarousel('items').each(function() {
		var item = $(this);

		var target = connector(item, carouselStage);

		item
			.on('jcarouselcontrol:active', function() {
				carouselThumbnails.jcarousel('scrollIntoView', this);
				item.addClass('active');
			})
			.on('jcarouselcontrol:inactive', function() {
				item.removeClass('active');
			})
			.jcarouselControl({
				target: target,
				carousel: carouselStage
			});
	});

	$('.js-prev-stage')
		.on('click', function(e) {e.stopPropagation()})
		.on('jcarouselcontrol:inactive', function() {
			if (!itemCurrent) $(this).addClass('inactive');
			$(this).on(
				'click',
				function() {
					$(this).closest('.js-gallery').find('.js-prev-model').click();
				})
		})
		.on('jcarouselcontrol:active', function() {
			$(this).removeClass('inactive');
		})
		.jcarouselControl({
			target: '-=1'
		});
	$('.js-next-stage')
		.on('click', function(e) {e.stopPropagation()})
		.on('jcarouselcontrol:inactive', function() {
			if (itemCount == itemCurrent) $(this).addClass('inactive');
			$(this).on(
				'click',
				function() {
					$(this).closest('.js-gallery').find('.js-next-model').click();
				})
		})
		.on('jcarouselcontrol:active', function() {
			$(this).removeClass('inactive');
		})
		.jcarouselControl({
			target: '+=1'
		});

	$('.js-prev-thumbnails')
		.on('jcarouselcontrol:inactive', function() {
			$(this).addClass('inactive');
		})
		.on('jcarouselcontrol:active', function() {
			$(this).removeClass('inactive');
		})
		.jcarouselControl({
			target: '-=3'
		});
	$('.js-next-thumbnails')
		.on('jcarouselcontrol:inactive', function() {
			$(this).addClass('inactive');
		})
		.on('jcarouselcontrol:active', function() {
			$(this).removeClass('inactive');
		})
		.jcarouselControl({
			target: '+=3'
		});

	counter.text(getCorrectCounter(carouselThumbnails.jcarousel('items').length, 'макет', 'макета', 'макетов'));
}

//Всплывающая галерея.
function galleryCreate(el) {
	var id = el.attr('id'),
		title = el.find('.js-portfolio-item-title').text(),
		link = el.find('.js-portfolio-item-site').html(),
		stageImages = '',
		thumbnails = '',
		detail;

	var $galleryItem = $('<div class="overlay js-overlay js-close-gallery"' + 'data-id="'+ id + '">' +
						'<div class="gallery js-gallery">' +
							'<div class="gallery__title">'+
								'<a href ="#0" class="next-model js-next-model">Следующий проект</a>' +
								'<a href ="#0" class="prev-model js-prev-model">Предыдущий проект</a>' +
								'<a href ="#0" class="back js-close-gallery">Вернуться в портфолио</a>' +
								'<a href ="#0" class="close-gallery js-close-gallery" "title="Закрыть">&#215;</a>' +
							'</div>' +
							'<div class="gallery__stage-wrap">' +
								'<div class="prev-stage js-prev-stage"></div>' +
								'<div class="next-stage js-next-stage"></div>' +
								'<div class="item-title text"></div>' +
								'<div class="carousel-stage js-carousel-stage">' +
									'<ul class="js-stage-items stage-items"></ul>' +
								'</div>' +
								'<div class="gallery-item-detail text"></div>' +
							'</div>' +
							'<div class="gallery__thumbnails-wrap">' +
								'<div class="carousel-thumbnails-counter js-carousel-thumbnails-counter"></div>' +
								'<div class="prev-thumbnails js-prev-thumbnails"></div>' +
								'<div class="next-thumbnails js-next-thumbnails"></div>' +
								'<div class="carousel-thumbnails js-carousel-thumbnails">' +
									'<ul class="js-thumbnails-items thumbnails-items"></ul>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>');

	$galleryItem.appendTo('.js-gallery-wrap');

	$.ajax({
		url: '/portfolio/portfolio-items.php',
		type: 'POST',
		data: 'id=' + id,
		success: function(responseData) {
			responseData = JSON.parse(responseData);

			if (!responseData.error.length) {
				detail = responseData.textDetail;

				for (var i = 0; i < responseData.stageImage.length; i++) {
					stageImages += '<li class="stage-items__item"><img ' + responseData.stageImage[i] + '></li>';
					thumbnails += '<li class="thumbnails-items__item shadow-hover"><img ' + responseData.thumbnail[i] + '></li>';
				}

				$galleryItem.find('.js-stage-items').html(stageImages);
				//$galleryItem.find('.js-thumbnails-items').html(thumbnails);

			} else {
				console.log('Ошибка.');
			}
		},
		complete: function() {
			$galleryItem.find('.item-title').html('<p class="h1">' + title + '</p>' + link);
			$galleryItem.find('.gallery-item-detail').html(detail);

			$galleryItem.find('.js-thumbnails-items').html(thumbnails);
			preloaderSmallImg($galleryItem.find('.js-gallery'));

			galleryCarousel(el, $galleryItem.find('.js-carousel-stage'), $galleryItem.find('.js-carousel-thumbnails'), $galleryItem.find('.js-carousel-thumbnails-counter'));
		}
	});

	$galleryItem.on(
		'click',
		function() {
			$('.js-scroll-top').show();
			$(this).hide();
			$('.page').css({
				overflow: 'auto',
				width: 'auto',
			});
		});
	$galleryItem.find('.js-close-gallery').on(
		'click',
		function() {
			$('.js-scroll-top').show();
			$(this).closest('.js-overlay').hide();
			$('.page').css({
				overflow: 'auto',
				width: 'auto',
			});
		});
	$galleryItem.find('.js-gallery').on(
		'click',
		function(e) {
			e.stopPropagation();
		});

	$galleryItem.find('.js-next-model').on(
		'click',
		function() {
			var $nextItem,
				$nextGalleryItem,
				nextId,
				itemCount = $('.js-portfolio-items').find('.js-gallery-open').length;

			if (el.index() == itemCount - 1) {
				$nextItem = $('.js-portfolio-items').find('.js-gallery-open:first');
			} else {
				$nextItem = el.next();
			}
			nextId = $nextItem.attr('id');
			$nextGalleryItem = $('.js-gallery-wrap').find('[data-id=' + nextId + ']');

			$('.js-gallery-wrap').find('.js-overlay').hide();

			if (!$nextGalleryItem.length) {
				galleryCreate($nextItem);
			} else {
				$nextGalleryItem.show();

				sizeWindowGallery();
			}
		});
	$galleryItem.find('.js-prev-model').on(
		'click',
		function() {
			var $prevItem,
				prevId,
				$prevGalleryItem,
				itemCount = $('.js-portfolio-items').find('.js-gallery-open').length;

			if (el.index() == 0) {
				$prevItem = $('.js-portfolio-items').find('.js-gallery-open:last');
			} else {
				$prevItem = el.prev();
			}

			prevId = $prevItem.attr('id');
			$prevGalleryItem = $('.js-gallery-wrap').find('[data-id=' + prevId + ']');

			$('.js-gallery-wrap').find('.js-overlay').hide();

			if (!$prevGalleryItem.length) {
				galleryCreate($prevItem);
			} else {
				$prevGalleryItem.show();

				sizeWindowGallery();
			}
		});

	sizeWindowGallery();
}

//Подгрузка на странице портфолио
function ajaxLoadItem() {
	$('.js-load-item').on(
		'click',
		function(e) {
			var $link = $(this),
				count = $('.js-portfolio-items').find('.js-gallery-open').length - 1;

			$link.hide();

			var $hidden = $("#ids_portfolio");
			var $data = $hidden.val();

			$.ajax({
				url: $(this).attr('href'),
				type: "POST",
				data: "data=" + $data,
				success: function(responseData) {
					responseData = JSON.parse(responseData);
					$hidden.remove();
					$(responseData).appendTo('.js-portfolio-items');
					$link.parent().remove();
					$('.js-portfolio-items').find('.js-gallery-open:gt(' + count + ')').each( function() {
						$(this).find('img').preloaderImg();
					});
					ajaxLoadItem();
				},
			});

			e.preventDefault();
		});
}

function galleryOpen(el) {
	var id = $(el).attr('id'),
		$galleryItem = $('.js-gallery-wrap').find('[data-id=' + id + ']');
	$('.js-scroll-top').hide();
	if (!$galleryItem.length) {
		galleryCreate($(el));
	} else {
		$galleryItem.show();
		sizeWindowGallery();
	}
}

//Шаблон системного сообщения в модальном окне.
function modalSystemMessage(textMessage) {
	var message = $(
		'<div class="modal-system-message-overlay js-modal-system-message-close"></div>'+
			'<div class="modal-system-message">'+
			'<div class="modal-close js-modal-system-message-close" title="Закрыть">&#215;</div>'+ textMessage +'</div>');

	message.hide().appendTo('body').fadeIn(350);
	$('.modal-system-message').center('fixed');
	modalSystemMessageClose();
}

function modalSystemMessageClose() {
	$('.js-modal-system-message-close').on(
		'click',
		function (e) {
			if ($(this).hasClass('modal-system-message-overlay')) {
				$(this)
					.fadeOut(350, function () {
						$(this).remove();
					})
					.next().fadeOut(350, function () {
						$(this).remove();
					});
			} else {
				$(this)
					.parent().fadeOut(350, function () {
						$(this).remove();
					})
					.prev().fadeOut(350, function () {
						$(this).remove();
					});
			}

			e.preventDefault();
		});
}

function linkDefault(el) {
	$(el).find('a').on(
		'click',
		function(e) {
			e.stopPropagation();
		}
	);
}

$(document).ready( function() {
	$('.page-footer').after('<div class="js-gallery-wrap"></div>');
	ajaxLoadItem();
	pageWidth = $(document).width();
	linkDefault('.js-portfolio-item-site');
	preloaderImg('.js-preloader');
	carousel('.jcarousel-wrap', 4);
	carousel('.jcarousel-wrap-certificates', 5);

	$('.js-certificates-show-all').on(
		'click',
		function() {
			$(this).closest('.jcarousel-wrap-certificates').slideToggle(500).next('.certificates').slideToggle(1000);
		}
	);

	$('.js-certificates-hide-all').on(
		'click',
		function() {
			$(this).closest('.certificates').slideToggle(500).prev('.jcarousel-wrap-certificates').slideToggle(1000);
		}
	);

	$('.js-question').on(
		'click',
		function() {
			$(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
			$(this).next().slideToggle(300);
		}
	);

	$('.js-jcarousel-slider')
		.jcarousel({
			animation: 'slow',
			wrap: 'circular'
		})
		.jcarouselAutoscroll({
			interval: 4000,
			target: '+=1',
			autostart: true
		});

	$('.js-jcarousel-pagination').jcarouselPagination({
			item: function(page) {
				return '<a href="#' + page + '" class="jcarousel-pagination__link"></a>';
			}
		})
		.on('jcarouselpagination:active', 'a', function () {
			$(this).addClass('active');
		})
		.on('jcarouselpagination:inactive', 'a', function () {
			$(this).removeClass('active');
		});

	$('.jcarousel-pagination__link:first').addClass('active');

	//Кнопка наверх
	$(window).scroll(function () {
		var scrollPos = $(this).scrollTop(),
			scrollOn = getViewportSize()[1] * 0.5,
			scrollTop = $('.js-scroll-top');

		if (scrollPos > scrollOn && !scrollTop.hasClass('js-scroll-top-active')) {
			scrollTop
				.addClass('js-scroll-top-active')
				.fadeIn('slow');
		} else if (scrollPos < scrollOn && scrollTop.hasClass('js-scroll-top-active')) {
			scrollTop
				.removeClass('js-scroll-top-active')
				.fadeOut('slow');
		}
	});

	$('.js-scroll-top').on(
		'click',
		function(e) {
			$('body, html').animate({
				scrollTop: 0,
			}, 500, 'swing');

			e.preventDefault();

		}
	);
	//Добавляем новые методы для валидации.
	$.validator.addMethod(
		'regexp',
		function(value, element, regexp) {
			var re = new RegExp(regexp);
			return this.optional(element) || re.test(value);
		}
	);

	//Валидация формы.
	$('.js-form-validate').each(function () {
		var url = $(this).attr('action')+'?ajax=Y',
			submitted = false,
			textMessage;

		$(this).validate({
			focusInvalid: false,
			submitHandler: function(form) {
				$.ajax({
					url: url,
					type: 'POST',
					data: $(form).serialize(),
					success: function(responseData) {
						responseData = JSON.parse(responseData);

						if (responseData['status'] == 'OK') {
							textMessage = '<p class="modal-system-message__title">Ваше сообщение отправлено!<p><p class="modal-system-message__text">Мы обязательно свяжемся c вами в ближайшее время.</p>';
							$(form).find('input[type=text]').each( function () {
								$(this).val('');
							})
						} else {
							textMessage = '<p class="modal-system-message__title">Ошибка!<p><p class="modal-system-message__text">'+responseData['message']+'</p>';
						}
						modalSystemMessage(textMessage);
					},
					error: function() {
						textMessage ='<p class="modal-system-message__title">Ошибка сети!</p><p class="modal-system-message__text">Пожалуйста повторите попытку чуть позже.</p>';
						modalSystemMessage(textMessage);
					}
				});
			},

			invalidHandler: function(form, validator) {
				submitted = true;
			},

			showErrors: function(errorMap, errorList) {
				textMessage = '<p class="modal-system-message__title">Ваше сообщение не отправлено!</p>';
				if (submitted) {
					var errorText = '';

					$.each(errorList, function(index) {
						errorText += this.message;
					});

					textMessage += errorText;
					modalSystemMessage(textMessage);
					submitted = false;
				}
			},
			rules: {
				PERSONAL_MOBILE: {
					required: true,
					regexp: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
				}
			},

			messages: {
				PERSONAL_MOBILE: {
					required: '<p class="modal-system-message__text">Поле "Телефон" обязательно для заполнения.</p>',
					regexp: '<p class="modal-system-message__text">Пожалуйста, введите телефон в следующем формате: <br> +7 900 123 45 67.</p>',
				}
			},
		});
	});

	//табуляция
	$(".tab__button").on("click", function(){
		if(!$(this).hasClass("tab__active"))
		{
			$(".tab__active").toggleClass("tab__active");

			$(this).toggleClass("tab__active");

			$(".tab__block_active").toggleClass("tab__block_active");
			$("." + $(this).data("tab")).toggleClass("tab__block_active");
		}
	});
});