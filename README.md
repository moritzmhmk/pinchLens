pinchLens
=========

A jQuery plugin that adds a magnifying lens to an image. Includes multitouch and scroll-wheel zooming support.

#Demo

[Demo](http://htmlpreview.github.io/?https://github.com/moritzmhmk/pinchLens/blob/master/index.html)

#Usage

Adding pinchLens to `$img`

	$img.pinchLens()
	
Or with options:

	$img.pinchLens(options)

where options looks like

	options = {
    	size: 50
	}

`size` - the size of the lens when zoom-level is one (default: 100)
