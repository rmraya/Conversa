// -*- coding: utf-8 -*-

/*

jQuery easyDrag v1.2 / 12.2017
par Gildas P. / www.gildasp.fr

infos, tuto, démos sur 
http://lab.gildasp.fr/easydrag/

*/

(function($) {

	var maxZ = 0;

    $.fn.easyDrag = function(params) {

    	if(params == "kill"){
    		this.each(function(){ var self = $(this);    		

    			var handle = self.data('handle');

				handle.off('mousedown', easyDrag_onMouseDown);
				handle.off('touchstart', easyDrag_onTouchStart);

    			// var prev = handle.data('prev_cursor');
    			// if(prev){
    			// 	handle.css('cursor', prev); // rétablit le curseur
    			// } else {
    				handle.css('cursor', '');
    			// }	   

	    		self.removeClass('easydrag_enabled');
    		});	    		

    	} else if(params == 'killall'){ // quelle que soit la cible...
    		$('.easydrag_enabled').easyDrag('kill'); // kill'em all !

    	} else {

    		params = $.extend({
	    		handle: '.handle', // cherche .handle s'il existe...
	    		axis: false, 
	    		container: false, 
	    		start: function(){},
	    		drag: function(){},
	    		stop: function(){},
	    		cursor: 'move', // mettre '' pour ne rien faire du tout
	    		ontop: true,
	    		clickable: true
	    	}, params);

    		// chaque objet un par un...
    		this.each(function(){ var self = $(this);

    			if(!self.hasClass('easydrag_enabled')){ // si pas déjà draggable...

	    			// poignée
	    			if(params.handle == 'this' || self.find(params.handle).length==0){
	    				var handle = self;
	    			} else {
	    				var handle = self.find(params.handle);
	    			}
	    			// handle.css('prev_cursor', handle.css('cursor')); // save le précédent curseur
	    			if(params.cursor != ''){ handle.css('cursor', params.cursor); } // curseur

	    			// save params
	    			handle.data(params);

	    			// boulet
	    			var boulet = self;
	    			boulet.addClass('easydrag_enabled'); // identifie les objets draggables

	    			// save couplage poignée-boulet
	    			boulet.data('handle', handle); // (override .handle...)
	    			handle.data('boulet', boulet);

					// z-index
					if(self.css('z-index')!='auto' && params.ontop){
						maxZ = Math.max(maxZ, self.css('z-index'));
					};

					// positionnement css
					if(self.css('position') != 'absolute' && self.css('position') != 'fixed'){
						if(self.css('left') == 'auto'){ self.css('left', '0'); } // sur android...
						if(self.css('top') == 'auto'){ self.css('top', '0'); }
						self.css('position', 'relative');
					}

					// mouse/touch events
					handle.on('mousedown', easyDrag_onMouseDown);
					handle.on('touchstart', easyDrag_onTouchStart);
    			}
    		});
    	}

    	return this;
    };

    var self, t, boulet, initItemX, initItemY, initEventX, initEventY, axis, container, refX, refY; // buffer

    // mouse
    function easyDrag_onMouseDown(event){ event.preventDefault();

		t = Date.now();

		// buffer
    	self = $(this);	
		boulet = self.data('boulet');
		initItemX = parseInt(boulet.css('left'));
		initItemY = parseInt(boulet.css('top'));
		axis = self.data('axis');
		container = self.data('container');
		initEventX = event.pageX;
		initEventY = event.pageY;

		if(container.length){
			refX = self.offset().left;
			refY = self.offset().top;
		}

		self.data('start').call(boulet);

		$(document).on('mousemove', easyDrag_onMouseMove);
		$(document).on('click', easyDrag_onMouseUp);

		// over the top !
		if(self.data('ontop')){ 
			maxZ++;
			boulet.css('z-index', maxZ);
		}
	}
	function easyDrag_onMouseMove(e){ e.preventDefault();

		self.data('drag').call(boulet); // drag event

		var nextX = initItemX + e.pageX-initEventX;
		var nextY = initItemY + e.pageY-initEventY;

		if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
		if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }

		easyDrag_contain();
	}
	function easyDrag_onMouseUp(e){		
		$(document).off('mousemove', easyDrag_onMouseMove);
		$(document).off('click', easyDrag_onMouseUp);

		self.data('stop').call(boulet); // stop event	

		// temps écoulé -> click ou pas click ?
		var d = Date.now() - t;
	
		if(d>300 || !self.data('clickable')){
			e.preventDefault(); 
			e.stopPropagation();
		}				
	}

	// touch
	function easyDrag_onTouchStart(event){ event.preventDefault();	

		t = Date.now();

		// buffer
    	self = $(this);	
		boulet = self.data('boulet');
		initItemX = parseInt(boulet.css('left'));
		initItemY = parseInt(boulet.css('top'));
		axis = self.data('axis');
		container = self.data('container');

		if(container.length){
			refX = self.offset().left;
			refY = self.offset().top;
		}

		var touch = event.originalEvent.changedTouches[0];
		initEventX = touch.pageX;
		initEventY = touch.pageY;

		self.data('start').call(boulet);

		$(document).on('touchmove', easyDrag_onTouchMove);
                // XMLmind: added.
		$(document).on('touchend', easyDrag_onTouchEnd);
                // XMLmind: commented out. 
                // touchmove's preventDefault ==> no mouse events.
		//$(document).on('click', easyDrag_onTouchEnd);

		// over the top !
		if(self.data('ontop')){ 
			maxZ++;
			boulet.css('z-index', maxZ);
		}
	}
	function easyDrag_onTouchMove(e){ e.preventDefault();

		self.data('drag').call(boulet); // drag event
		
		var touch = e.originalEvent.changedTouches[0];
		var nextX = initItemX + touch.pageX-initEventX;
		var nextY = initItemY + touch.pageY-initEventY;

		if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
		if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }

		easyDrag_contain();
	}
	function easyDrag_onTouchEnd(e){
		$(document).off('touchmove', easyDrag_onTouchMove);
                // XMLmind: added.
		$(document).off('touchend', easyDrag_onTouchEnd);
                // XMLmind: commented out. 
                // touchmove's preventDefault ==> no mouse events.
		//$(document).off('click', easyDrag_onTouchEnd);

		self.data('stop').call(boulet); // stop event	

		// temps écoulé -> click ou pas click ?
		var d = Date.now() - t;
	
		if(d>300 || !self.data('clickable')){
			e.preventDefault(); 
			e.stopPropagation();
		}							
	}

	// contrainte éventuelle...
    function easyDrag_contain(){
    	if(container.length){

    		// position actuelle...
			var cur_offset = boulet.offset();
			var container_offset = container.offset();

    		// horizontal
    		var limite1 = container_offset.left;
			var limite2 = limite1+container.width()-boulet.innerWidth();
			limite1 += parseInt(boulet.css('margin-left'));
			if(cur_offset.left<limite1){
				boulet.offset({left: limite1});
			} else if(cur_offset.left>limite2){
				boulet.offset({left: limite2});
			}

			// vertical
			var limite1 = container_offset.top;
			var limite2 = limite1+container.height()-boulet.innerHeight();
			limite1 += parseInt(boulet.css('margin-top'));
			if(cur_offset.top<limite1){
				boulet.offset({top: limite1});
			} else if(cur_offset.top>limite2){
				boulet.offset({top: limite2});
			}
    	}
    };

})(jQuery);
