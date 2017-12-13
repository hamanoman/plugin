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
		slideAction : function( target, trigger, direction, fixedTarget ) {
			var $this = $(target);
			var $drawerTarget = $this;
			if ( !$('.drawerInner')[0] ) {
	    	$drawerTarget.wrapInner( '<div class="drawerInner" data-direction="' + direction + '"></div>' );
				$('.drawerInner').prepend('<div class="drawerInner_cover"></div>');
	    	$drawerTarget.prepend( '<div class="drawerBg"></div>' );
			}
	    var $drawerInner = $('.drawerInner');
	    var $drawerBg = $('.drawerBg');
			$drawerInner.css({ 'height': $(window).height() });
			$( trigger + ', .drawerBg, .drawerInner > .drawerInner_cover' ).on('click', function(e) {
	      e.preventDefault();
		    if (!$drawerTarget.is('.open') ) {
		      $drawerTarget.addClass('open');
		      if ( fixedTarget != false ) {
		      	methods.wrapFixed( fixedTarget );
		      }
		      $drawerTarget.stop(true, false).fadeIn(0, function() {
		        $drawerBg.stop(true, false).fadeIn(300,function() {
							console.log(direction);
		          $drawerInner.addClass( 'view' ).on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd',function(){
								return;
							});
		        });
		      });
		    } else {
		      var contentsPos = $('body').attr('data-scroll');
					$drawerInner.removeClass( 'view' ).one('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd',function(){
					//ここに処理を記述
						$drawerTarget.removeClass('open');
						if ( fixedTarget != false ) {
							methods.wrapFixed( fixedTarget );
						}
						$drawerBg.stop(true, false).fadeOut(300, function() {
							$drawerTarget.stop(true, false).fadeOut(0);
						});
					});
		    }
	    });
		},

		// 要素フェード
		fadeAction : function() {
			console.log();
		}
	}
	$.fn.drawer = function( options ) {
		var defaults = {
			'trigger': '',      // トリガー
			'action': 'slide',
			'direction': 'right',
			'fixed': false,      // 画面固定要素
			'bgColor': '#000',   // 背景色
			'speed': 300         // スピード
		};

		var settings = $.extend( {}, defaults, options );

		return this.each( function() {
			// 引数で処理変える
			if ( settings.action == 'slide' ) {
				methods.slideAction( this, settings.trigger, settings.direction, settings.fixed );
			}
			if ( settings.action == 'fade' ) {
				methods.fadeAction( this, settings.trigger, settings.fixed );
			}
		});
	};
}( jQuery ));
