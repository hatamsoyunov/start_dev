var isMobile = false;

if ($('body').width() <= 992) {
	isMobile = true;
} else {
	isMobile = false
}

$(window).on('resize', function() {
	if ($('body').width() <= 992) {
		is_mobile = true;
	} else {
		is_mobile = false
	}
});

var mfp_popup = function(popup_id) {
	$.magnificPopup.open({
		items: {src: popup_id},
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
		mainClass: 'my-mfp-zoom-in'
	});
}


$(window).on('load', function() {

	// Load function

});

$(document).ready(function() {

	$('.js_callback').click(function(event) {
		event.preventDefault();

		mfp_popup($(this).attr('href'));
	});

	// Slider Callback
	$('#format_slider').owlCarousel({
		loop: true,
		margin: 0,
		items: 1,
		nav: true,
		dots: false,
		navText: ['',''],
		autoHeight: true,
		onInitialized: store_format,
	});

	function store_format(event) {
		var el = event.target;
	};

	// disable submit button
	$('label.js_iagree').click(function() {
		if( !$(this).siblings('input#us_iagree').prop("checked") ){
			$(this).closest('form').find('.button').removeClass('disabled').prop('disabled', false);
		} else {
			$(this).closest('form').find('.button').addClass('disabled').prop('disabled', true);
		}
	});

	// Phone input mask
	$('input[type="tel"]').inputmask({
			mask: '+7 (999) 999-99-99',
			showMaskOnHover: false
	});

	//E-mail Ajax Send
	$("form").submit(function() {
		var form = $(this);
		$.ajax({
			type: "POST",
			url: "php/mail.php",
			data: form.serialize()
		}).done(function() {
			
			if (form.attr('id') === 'callback_form') {
				form.find('.form_result').addClass('active');
			} else {
				$.magnificPopup.close();
				mfp_popup('#success');
			}

			setTimeout(function() {
				if (form.attr('id') === 'callback_form') {
					form.find('.form_result').removeClass('active');
				}

				$.magnificPopup.close();
				form.trigger("reset");
			}, 3000);

		});
		return false;
	});

	// Zoom_img
	// $('[data-fancybox="images"]').fancybox({
	// 	buttons: ["slideShow", "zoom", "close"],
	// 	animationEffect: "zoom",
	// 	transitionEffect: "slide",
	// 	image: {
	// 		preload: true
	// 	},
	// 	afterLoad : function(instance, current) {
	// 		var pixelRatio = window.devicePixelRatio || 1;

	// 		if ( pixelRatio > 1.5 ) {
	// 			current.width  = current.width  / pixelRatio;
	// 			current.height = current.height / pixelRatio;
	// 		}
	// 	}
	// });


});


