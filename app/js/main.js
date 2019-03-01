// ==========================================================================
// Public Vars
// ==========================================================================
// mobile flag
var isMobile = false;
var mobileBreackpoint = 992;

if ($('body').width() <= mobileBreackpoint) {
	isMobile = true;
} else {
	isMobile = false
}

$(window).on('resize', function() {
	if ($('body').width() <= mobileBreackpoint) {
		isMobile = true;
	} else {
		isMobile = false
	}
})



// ==========================================================================
// Base functions
// ==========================================================================

// Popup
var mfpPopup = function(popupID, source) {
	$.magnificPopup.open({
		items: {src: popupID},
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
		mainClass: 'my-mfp-zoom-in',
		callbacks: {
			open: function() {
				$('.source').val(source);
			}
		}
	});
}


// ==========================================================================
// Ready Functions
// ==========================================================================
$(document).ready(function() {

	// Phone input mask
	$('input[type="tel"]').inputmask({
		mask: '+7 (999) 999-99-99',
		showMaskOnHover: false
	});


	// E-mail Ajax Send
	$('form').submit(function() {
		var form = $(this);
		$.ajax({
			type: 'POST',
			url: 'mail/mail.php',
			data: form.serialize()
		}).done(function() {
			
			if (form.hasClass('popup-form')) {
				form.find('.form-result').addClass('form-result--success');
			} else {
				mfpPopup('#success');
			}

			setTimeout(function() {
				if (form.hasClass('popup-form')) {
					form.find('.form-result').removeClass('form-result--success');
				}

				$.magnificPopup.close();
				form.trigger('reset');
			}, 3000);

		});
		return false;
	});


	// Open popup
	$('.js-popup').click(function(event) {
		event.preventDefault();
		var id = $(this).attr('href');
		var source = $(this).attr('data-source') + ' (' + $(this).html() +')';

		mfpPopup(id, source);
	});


	// mobile menu toggle
	$('.js-menu').click(function() {

		$(this).toggleClass('active');
		$('#menu').toggleClass('opened');
	});

});



// ==========================================================================
// Load functions
// ==========================================================================
$(window).on('load', function() {

	// 

});