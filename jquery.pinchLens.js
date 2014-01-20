(function ($) {
	var PinchLens = function(element, options) {
		this.opts = $.extend( {}, $.fn.pinchLens.defaults, options );
		
		this.$img = $(element);

		this.scale = 1


		this.$lens = $("<div>").css({
			position: "absolute",
			overflow: "hidden",
			backgroundColor: "#555",
			border: 0,
			borderRadius: "100%"
		}).data('pinchLens', this)
		this.$lensImg = this.$img.clone().css({position: "absolute"}).data('pinchLens', this)
		this.$lens.append(this.$lensImg)
		this.$img.parent().append(this.$lens)
		

		this.setBGPosition = function() {
			imgOffset = this.$img.offset()
			lensOffset = this.$lens.offset()

			lensWidth = this.opts.size*this.scale
			lensHeight = this.opts.size*this.scale
			
			lensImgLeft	= - ( (lensOffset.left-imgOffset.left+lensWidth/2.0)*this.scale -lensWidth/2.0 )
			lensImgTop	= - ( (lensOffset.top -imgOffset.top +lensHeight/2.0)*this.scale -lensHeight/2.0 )
	
			this.$lens.css({ width: lensWidth+"px", height: lensHeight+"px" });
			this.$lensImg.css({
				left: lensImgLeft,
				top: lensImgTop,
				width: this.$img.width()*this.scale + 'px',
				height: this.$img.height()*this.scale + 'px'
			})				
		}

		this.setPosition = function(left, top) {
			left -= this.$lens.width()/2.0;
            top  -= this.$lens.height()/2.0;
            this.$lens.css({ left: left + 'px', top: top + 'px' });
			this.setBGPosition()
		}

		this.$img.load( function(e) {
			var that = $(e.target).data("pinchLens")
			_offset=that.$img.offset()
			that.setPosition(that.$img.width()/2+_offset.left,that.$img.height()/2+_offset.top)
		})



		var touchAdapter = function(f) {
			return function(e) {
				if(typeof e.originalEvent.touches != 'undefined') {
					e.preventDefault()
					touches=e.originalEvent.touches
					if(touches.length==1) {
        	    	    e.pageX = touches[0].pageX;
            		    e.pageY = touches[0].pageY;
            		    f(e)
            		}
            	} else {
            		f(e)
            	}
			}
		}

		this.offX, this.offY
		var _move = touchAdapter(function(e) {
			e.preventDefault();
			var that = $(e.target).data("pinchLens")
			that.setPosition(e.pageX-that.offX, e.pageY-that.offY)
		})
		this.$lens.on("mousedown touchstart",
			touchAdapter(function(e) {
				var that = $(e.target).data("pinchLens")
				that.offX = e.pageX-that.$lens.offset().left-that.$lens.width()/2.0
				that.offY = e.pageY-that.$lens.offset().top -that.$lens.height()/2.0
				that.$lens.on("mousemove touchmove", _move)
			})
		)
		this.$lens.on("mouseup touchend",   function(e) {
			var that = $(e.target).data("pinchLens")
			that.$lens.off("mousemove touchmove", _move)
		})


		_zoom = function(e) {
			var that = $(e.target).data("pinchLens")
			that.scale=e.scale
			that.scale=Math.max(1,that.scale)
			that.scale=Math.min(10,that.scale)

			x_now = that.$lens.offset().left+that.$lens.width()/2.0
			y_now = that.$lens.offset().top +that.$lens.height()/2.0

			dx=(e.pageX-x_now)/that.scale
			dy=(e.pageY-y_now)/that.scale

			that.setBGPosition()
			that.setPosition(x_now+dx, y_now+dy)
		}
		this.$img.add(this.$lens).on('mousewheel', function(e) {
			var that = $(e.target).data("pinchLens")
			e.preventDefault()
			e.scale=that.scale+e.deltaY/10.0
			_zoom(e)
		})
		this.$img.add(this.$lens).on("touchmove", function(e) {
			var that = $(e.target).data("pinchLens")
			touches=e.originalEvent.touches
            if(touches.length>=2) {
				e.preventDefault();

                e.pageX = (touches[0].pageX+touches[1].pageX)/2;
                e.pageY = (touches[0].pageY+touches[1].pageY)/2;

                dx = (touches[0].pageX-touches[1].pageX)
                dy = (touches[0].pageY-touches[1].pageY)
                delta = Math.sqrt(dx*dx+ dy*dy)
                e.scale = delta/that.opts.size

                _zoom(e)
            }
		})
	}

	$.fn.pinchLens = function(options) {
        return this.each(function() {
	        var element = $(this)
            if (element.data('pinchLens')) return
            var pinchLens = new PinchLens(this, options)
            element.data('pinchLens', pinchLens)
        })

    }

    $.fn.pinchLens.defaults = {
        size: 100
    }
})(jQuery);