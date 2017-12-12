(function ( $ ) {
$.fn.drawer = function( options ) {
	var defaults = {
		'trigger': '',
		'fixed': false
	};

	var settings = $.extend( {}, defaults, options );

	function wrapFixed() {
		var currentPos;
		if ($('body').is('.fixed')) {
      currentPos = $('body').attr('data-scroll');
      $( settings.fixed ).attr('style', '');
      $('body').removeClass('fixed');
      // TweenLite.to(window, 0, { scrollTo: { y: currentPos }});
      $('html, body').animate({ scrollTop: currentPos }, 0);
    } else {
      currentPos = $(window).scrollTop();
      $('body').attr('data-scroll', currentPos).addClass('fixed');
      $( settings.fixed ).css({
        'position': 'fixed',
        'top': -currentPos,
        'z-index': -1
      });
    }
	}
	
	return this.each( function() {
		var $this = $(this);
		var $drawerTarget = $this;
		if ( !$('.drawerInner')[0] ) {
    	$drawerTarget.wrapInner( '<div class="drawerInner"></div>' );
    	$drawerTarget.prepend( '<div class="drawerBg"></div>' );
		}
    var $drawerInner = $('.drawerInner');
    var $drawerBg = $('.drawerBg');
		$drawerInner.css({ 'height': $(window).height() });
		$( settings.trigger + ', .drawerBg' ).on('click', function(e) {
      e.preventDefault();
	    if (!$drawerTarget.is('.open') ) {
	      $drawerTarget.addClass('open');
	      if ( settings.fixed != false ) {
	      	wrapFixed();
	      }
	      $drawerTarget.stop(true, false).fadeIn(0, function() {
	        $drawerBg.stop(true, false).fadeIn(300,function() {
	          $drawerInner.animate({ 'left': 0 });
	        });
	      });
	    } else {
	      var contentsPos = $('body').attr('data-scroll');
	      $drawerInner.animate({ 'left': '-100%' }, 500, function() {
	      	$drawerTarget.removeClass('open');
	        if ( settings.fixed != false ) {
	        	wrapFixed();
	        }
	        $drawerBg.stop(true, false).fadeOut(300, function() {
	          $drawerTarget.stop(true, false).fadeOut(0);
	        });
	      });
	    }
    });
	});
};
}( jQuery ));