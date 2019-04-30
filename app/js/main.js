// ==========================================================================
// Responsive
// ==========================================================================
var isMobile = false;
var mobileBreackpoint = 992;

if ($('body').width() <= mobileBreackpoint) {
	isMobile = true;
} else {
	isMobile = false;
}

$(window).on('resize', function () {
	if ($('body').width() <= mobileBreackpoint) {
		isMobile = true;
	} else {
		isMobile = false;
	}
});


// ==========================================================================
// Common functions
// ==========================================================================

// Popup
var mfpPopup = function (popupID, source) {
	$.magnificPopup.open({
		items: {
			src: popupID
		},
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		closeMarkup: '<button type="button" class="mfp-close">&times;</button>',
		mainClass: 'mfp-fade-zoom',
		// callbacks: {
		// 	open: function() {
		// 		$('.source').val(source);
		// 	}
		// }
	});
};

// mobile menu toggle
$('.js-menu').click(function () {

	$(this).toggleClass('is-active');
	$('.menu').toggleClass('opened');
});

// Phone input mask
$('input[type="tel"]').inputmask({
	mask: '+7 (999) 999-99-99',
	showMaskOnHover: false
});


// E-mail Ajax Send
$('form').submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var formData = {};
	formData.data = {};

	// Serialize
	form.find('input, textarea').each(function () {
		var name = $(this).attr('name');
		var title = $(this).attr('data-name');
		var value = $(this).val();

		formData.data[name] = {
			title: title,
			// value: value
		};

		if (name === 'subject') {
			formData.subject = {
				// value: value
			};
			delete formData.data.subject;
		}
	});

	$.ajax({
		type: 'POST',
		url: 'mail/mail.php',
		dataType: 'json',
		data: formData
	}).done(function (data) {

		if (data.status === 'success') {
			if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
				form.find('.form-result').addClass('form-result--success');
			} else {
				mfpPopup('#success');
			}

			setTimeout(function () {
				if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
					form.find('.form-result').removeClass('form-result--success');
				}
				$.magnificPopup.close();
				form.trigger('reset');
			}, 3000);

		} else {
			alert('Ajax result: ' + data.status);
		}

	});
	return false;
});


// Open popup
$('.js-popup').click(function (event) {
	event.preventDefault();
	var popupID = $(this).attr('href');

	mfpPopup(popupID);
});





// ==========================================================================
// Ready Functions
// ==========================================================================
$(document).ready(function () {

	//

});



// ==========================================================================
// Load functions
// ==========================================================================
$(window).on('load', function () {

	// 

});