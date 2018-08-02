// ==========================================================================
//
// HTML5 History
// Enables linking to each modal
//
// ==========================================================================
;(function (document, window, $) {
	'use strict';

	// Variable containing id of last value set by fancyBox
	// It will be used to determine if fancyBox needs to close after history change is detected
	var currentPicId = null;

	// Get info about gallery name and current index from url
    function parseUrl() {
		var activePic = window.location.pathname.match(/pic-\d+/);

		if (activePic && activePic.length) {
			var picId = activePic[0].replace('/', '')
		}

        return {
			picId: picId
        };
    }

	// Trigger click evnt on links to open new fancyBox instance
	function triggerFromUrl( url ) {
		if (!url) {
			url = parseUrl();
		}
        if ( url && url.picId ) {
            $( "[data-pic-id=" + url.picId + "]" ).trigger( 'click' );
        }
	}

	// Get gallery name from current instance
	function getGallery( instance ) {
		var opts;

		if ( !instance ) {
			return false;
		}

		opts = instance.current ? instance.current.opts : instance.opts;
		return opts.$orig ? opts.$orig.data( 'fancybox' ) : ( opts.hash || '' );
	}

	// Star when DOM becomes ready
    $(function() {

		// Small delay is used to allow other scripts to process "dom ready" event
		setTimeout(function() {
            // Check if this module is not disabled
			if ( !$.fancybox.defaults.history ) {
				return;
			}
			
			$(window).on('hashchange.fb', function() {
		        var url = parseUrl();

				if ( $.fancybox.getInstance() ) {
					if ( currentPicId && currentPicId !== url.picId )  {
						currentPicId = null;
						$.fancybox.close();
					}

				} else if ( url.picId ) {
		            triggerFromUrl( url );
		        }

		    });

			// Update hash when opening/closing fancyBox
		    $(document).on({
				'onInit.fb' : function( e, instance ) {
					var url     = parseUrl();
					currentPicId = url.picId;

				}, 'beforeShow.fb' : function( e, instance, current ) {
                    var gallery = getGallery( instance );
		            // Update window hash
		            if ( gallery && gallery !== '' ) {;
						var path = window.location.pathname.replace(currentPicId, '');
                        currentPicId = current.opts.picId;
						var url = path + (path.endsWith('/') ? '' : '/') + currentPicId + window.location.search;
						if ( "pushState" in history ) {
		                    history.pushState( '', document.title, url);
						} else {
							window.location.hash = currentPicId;
						}
		            }

		        }, 'beforeClose.fb' : function( e, instance, current ) {
					var gallery  = getGallery( instance );
		            if ( gallery ) {
		                if ( "pushState" in history ) {
		                    history.pushState( '', document.title, window.location.pathname.replace('/' + currentPicId, '') + window.location.search );
		                } else {
							window.location.hash = ''
						}
		            }
					currentPicId = null;
		        }
			});
		}, 50);
	});
	$.fancybox.triggerFromUrl = triggerFromUrl;
}(document, window, window.jQuery));
