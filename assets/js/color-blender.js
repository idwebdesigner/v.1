

var baseColor, colorCount, colorCtrls;

baseColor = "#ffffff";
colorCount = 3;
colorCtrls = new Array(colorCount);


/**
	Calculate color of overlaps and inserts them into labels on the page

	@return null
*/
function calculateBlends() {
	for(var i = 0; i < colorCount; i++) {
		var bottomCtrl, topCtrl, label;

		label = colorCtrls[i].secondaryLabel;

		//Second color is above first, until last/first overlap.
		if(i < colorCount - 1) {
			bottomCtrl = colorCtrls[i];
			topCtrl = colorCtrls[i + 1];
		} else {
			bottomCtrl = colorCtrls[0];
			topCtrl = colorCtrls[i];
		}

		var apparentColorHex = bottomCtrl.apparentColor;
		var blendColorRgb = topCtrl.rgbColor;
		var opacity = topCtrl.slider.value;

		if(apparentColorHex && blendColorRgb && opacity) {
			var calculatedColor = addColor(apparentColorHex, rgbToHex(blendColorRgb.r, blendColorRgb.g, blendColorRgb.b), opacity);
			label.innerHTML = calculatedColor + " (overlap)";
		}
	}
}

//Initialize colored circles and labels
function initColor(ctrl) {

	//Calculate rgba value from color picker and slider
	var hexColor = ctrl.picker.value;
	var rgb = hexToRgb(hexColor);
	var a = ctrl.slider.value;
	var rgbaString = "rgba("+rgb.r+","+rgb.g+","+rgb.b+","+a+")";
	ctrl.rgbColor = rgb;
	ctrl.apparentColor = addColor(baseColor, hexColor, a);

	//Set circle to chosen color
	ctrl.circle.style.background = rgbaString;

	//Display the color value in the element
	ctrl.display.innerHTML = ctrl.slider.value;
	ctrl.primaryLabel.innerHTML = 
		hexColor.toUpperCase() + " (" + a + " opacity)<br>" +
		ctrl.apparentColor.toUpperCase() + " (calculated)";
}

// Handle color/opacity change
function colorChanged() {
	initColor(this.ctrl);
	calculateBlends();
}


/**
	Converts a hex string to rgb object.
	http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

	@param string hex color

	@return object object with r, g, and b properties
*/
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        toString: function() {
        	return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        }
    } : null;
}

/**
	Converts r, g and b color values into a hex string.

	@param float number for red value 0-1
	@param float number for green value 0-1
	@param float number for blue value 0-1

	@return string a hex color string
*/
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
	Calculates the resulting color when `base` color is overlaid with `overlap` color of a given opacity.

	@param string base    six-digit hexidecimal color value of the "bottom" color
	@param string overlap six-digit hexidecimal color value of the "top" color
	@param float  opacity alpha/opacity of the top color (0.0 - 1.0)

	@return string resulting hex color
*/
function addColor(base, overlap, opacity) {
	base    = hexToRgb(base);
	overlap = hexToRgb(overlap);
	return rgbToHex(
		addColorComponent(base.r, overlap.r, opacity), 
		addColorComponent(base.g, overlap.g, opacity),
		addColorComponent(base.b, overlap.b, opacity)
	); 
}

/**
	Calculates resulting component color value when overlaying one color with
	another.

	@param int   baseComp    either the r, g or b value of the base rgb color.
	@param int   overlapComp either the r, g or b value of the overlaid rgb color.
	@param float opacity     the opacity of the overlaying color between 0-1

	@return int resulting color component
*/
function addColorComponent(baseComp, overlapComp, opacity) {
	return Math.floor(overlapComp * opacity) + Math.floor((1 - opacity) * baseComp);
}


/**
	Initialize controls, events and calculations to get this party started.
*/
function init() {

	//Init controls
	for(var i = 0; i < colorCount; i++) {
		colorCtrls[i] = 
		{
			picker: document.getElementById("color"   + (i+1)),
			slider: document.getElementById("alpha"   + (i+1)),
			display: document.getElementById("display" + (i+1)),
			circle: document.getElementById("circle"  + (i+1)),
			primaryLabel: document.getElementById("circle" + (i+1) + "-label-primary"),
			secondaryLabel: document.getElementById("circle" + (i+1) + "-label-secondary"),
			rgbColor: null,
			apparentColor: null
		}   

		colorCtrls[i].picker.ctrl = colorCtrls[i];
		colorCtrls[i].slider.ctrl = colorCtrls[i];
	}

	//Hook up event listeners
	for(var i = 0; i < colorCount; i++) {
		colorCtrls[i].picker.addEventListener("change", colorChanged, false);
		colorCtrls[i].slider.addEventListener("change", colorChanged, false);
		initColor(colorCtrls[i]);
	}
	calculateBlends();
}

//Let's go!!
init();

