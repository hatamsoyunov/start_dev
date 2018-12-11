// ==========================================================================
// Public Vars
// ==========================================================================
// mobile flag
var is_mobile = false;
var mobile_breackpoint = 992;

if ($('body').width() <= mobile_breackpoint) {
	is_mobile = true;
} else {
	is_mobile = false
}

$(window).on('resize', function() {
	if ($('body').width() <= mobile_breackpoint) {
		is_mobile = true;
	} else {
		is_mobile = false
	}
})



// ==========================================================================
// Base functions
// ==========================================================================

// Popup
var mfp_popup = function(popup_id, source) {
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
		mainClass: 'my-mfp-zoom-in',
		callbacks: {
			open: function() {
				$('.source').val(source);
			}
		}
	});
}

$(document).ready(function() {

	// Phone input mask
	$('input[type="tel"]').inputmask({
		mask: '+7 (999) 999-99-99',
		showMaskOnHover: false
	});


	// E-mail Ajax Send
	$("form").submit(function() {
		var form = $(this);
		$.ajax({
			type: "POST",
			url: "mail/mail.php",
			data: form.serialize()
		}).done(function() {
			
			if (form.hasClass('popup_form')) {
				form.find('.form_result').addClass('success');
			} else {
				mfp_popup('#success');
			}

			setTimeout(function() {
				if (form.hasClass('popup_form')) {
					form.find('.form_result').removeClass('success');
				}

				$.magnificPopup.close();
				form.trigger("reset");
			}, 3000);

		});
		return false;
	});


	// Open popup
	$('.js_popup').click(function(event) {
		event.preventDefault();
		var id = $(this).attr('href');
		var source = $(this).attr('data-source') + ' (' + $(this).html() +')';

		mfp_popup(id, source);
	});


	// mobile menu toggle
	$('.js_menu').click(function() {

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



// ==========================================================================
// Ready Functions
// ==========================================================================
$(document).ready(function() {

	

});