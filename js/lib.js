(function ( $ ) {

	var methods = {
    // OPEN時 画面固定
		wrapFixed : function( fixedTarget ) {
			var currentPos;
			if ($('body').is('.fixed')) {
	      currentPos = $('body').attr('data-scroll');
	      $( fixedTarget ).attr('style', '');
	      $('body').removeClass('fixed');
	      // TweenLite.to(window, 0, { scrollTo: { y: currentPos }});
	      $('html, body').animate({ scrollTop: currentPos }, 0);
	    } else {
	      currentPos = $(window).scrollTop();
	      $('body').attr('data-scroll', currentPos).addClass('fixed');
	      $( fixedTarget ).css({
	        'position': 'fixed',
	        'top': -currentPos,
	        'z-index': -1
	      });
	    }
		},

    // 要素スライド(メソッド内で四方の条件分岐)
		// slide : function() {
    //
		// }

		// 要素フェード
		// fade : function() {
    //
		// }
	}
	$.fn.drawer = function( options ) {
		var defaults = {
			'trigger': '',      // トリガー
			'fixed': false,      // 画面固定要素
			'bgColor': '#000',   // 背景色
			'speed': 300         // スピード
		};

		var settings = $.extend( {}, defaults, options );

		return this.each( function() {
			// methodsに移動して引数で処理変える
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
		      	methods.wrapFixed( settings.fixed );
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
		        	methods.wrapFixed( settings.fixed );
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
