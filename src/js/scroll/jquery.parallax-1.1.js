/*
Plugin: jQuery Parallax
Version 1.1
Author: Ian Lunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function( $ ){
	$.fn.parallax = function(xpos, adjuster, inertia, outerHeight) {

        function inView(pos, element){

            element.each(function(){ //for each selector, determine whether it's inview and run the move() function

                var element = $(this);
                var top = element.offset().top;

                if(outerHeight == true){
                    var height = element.outerHeight(true);
                }else{
                    var height = element.height();
                }

                //above & in view
                if(top + height >= pos && top + height - windowHeight < pos){
                    move(pos, height);
                }

                //full view
                if(top <= pos && (top + height) >= pos && (top - windowHeight) < pos && top + height - windowHeight > pos){
                    move(pos, height);
                }

                //below & in view
                if(top + height > pos && top - windowHeight < pos && top > pos){
                    move(pos, height);
                }
            });
        }

		var $window = $(window);
		var windowHeight = $(window).height();
		var pos = $window.scrollTop(); //position of the scrollbar
		var $this = $(this);
		
		//setup defaults if arguments aren't specified
		if(xpos == null){xpos = "50%"}
		if(adjuster == null){adjuster = 0}
		if(inertia == null){inertia = 0.1}
		if(outerHeight == null){outerHeight = true}
		
		height = $this.height();
		$this.css({'backgroundPosition': newPos(xpos, outerHeight, adjuster, inertia)}); 
		
		function newPos(xpos, windowHeight, pos, adjuster, inertia){
			return xpos + " " + Math.round((-((windowHeight + pos) - adjuster) * inertia)) + "px";
		}
		
		//function to be called whenever the window is scrolled or resized
		function move(pos, height){ 
				$this.css({'backgroundPosition': newPos(xpos, height, pos, adjuster, inertia)}); 
		}
		
		$window.bind('scroll', function(){ //when the user is scrolling...
			var pos = $window.scrollTop(); //position of the scrollbar
			inView(pos, $this);

            if (pos > 1900){
                $('.side-button').show();
            }
            else{
                $('.side-button').hide()
            }

            if (pos > 1000){
                $('.navigation-item__up').show();
            }
            else{
                $('.navigation-item__up').hide()
            }

            var teamPosition = parseInt($('#team').css('top'));

            // if (pos >= teamPosition && pos < (teamPosition + 960)){
            //     $('#contacts').css({position: 'fixed'});
            //     $('#contacts').css({bottom: 0});
            //     $('#contacts').css({top: 0});
            //     $('#contacts-bg').css('height','960px');
            // }
            // else if (pos >= (teamPosition + 960)){
            //     $('#contacts-bg').css('height','0');
            //     $('#contacts').css({position: 'absolute'});
            //     $('#contacts').css({top: (teamPosition + 960)});
            // }
            // else if (pos < teamPosition){
            //     $('#contacts').css({position: 'absolute'});
            //     $('#contacts').css({top: (teamPosition + 960)});
            // }
		})
    }
})( jQuery );
