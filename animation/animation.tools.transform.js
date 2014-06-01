tools.transform = {};

tools.setTransformFigure = function() {
	var dlElement = $(tools.nowSelectElement);
	var offsetParentPos = dlElement.offsetParent().offset();
	var pos = dlElement.position();
	var width = dlElement.innerWidth();
	var height = dlElement.innerHeight();
	var style = dlElement.attr("style");
	var top = pos.top;
	var left = pos.left;
	var figure = tools.rotateArea;
	
	dlElement.parent().append(figure);
	figure.attr("style", style);
	

	function setPos(pos) {
		figure.css(pos, ((parseFloat(dlElement.css(pos)) || 0) - 20) + "px");
	}
	
	figure.addClass("show");
	if(dlElement.css("right") === "auto")
		setPos("left");
	else
		setPos("right");

	if(dlElement.css("bottom") === "auto")
		setPos("top");
	else
		setPos("bottom");
				
	
	figure.css("margin", dlElement.css("margin"));

	
	figure.css("width", width+"px");
	figure.css("height", height+"px");

}
tools.moveTransformOrigin = function(e) {
	
}


tools.setTranslate = function(x, y) {
	if(!tools.nowSelectElement)
		return;
		
		
	var layer = tools.getLayer();
	var motion = tools.getMotion(tools.nowTime);
	motion.tx = parseFloat(x) + "px";
	motion.ty = parseFloat(y) + "px";
	motion.fill = "add";
	layer.addMotion(motion);
}
tools.addTranslate = function(x, y) {

}

tools.transform.rotate = function(e) {
	var info = e.dragInfo;
	var layer = tools.getLayer();
	
	var motion = tools.getNowMotion();	
	
	var origin = motion.origin;
	var dlElement = tools.nowSelectElement;
	//var style = dlElement.css();
	origin = origin || "50% 50%";
	
	var dimensionType = ["px", "em", "%"]
	
	function _abspx(a, p100) {
		var v = parseFloat(a);
		if(p100 && a.indexOf("%") > -1)
			return v * p100 / 100;
		else
			return v;
	}
	var arrOrign = origin.split(" ");
	var left = _abspx(arrOrign[0], dlElement.dimension("width"));
	var left = _abspx(arrOrign[1], dlElement.dimension("height"));
	
	
}
tools.transform.scale = function(e) {

	var info = e.dragInfo;
	var btn = $(e.dragElement);
	var classes = btn.getClass();
	var pos = classes[0];
	var bPosS = pos.indexOf("s") != -1;
	var bPosW = pos.indexOf("w") != -1;
	var bPosE = pos.indexOf("e") != -1;
	var bPosN = pos.indexOf("n") != -1;
	
	var is_transform = !!tools.selectedMenu.transform;
	var is_shift = !!tools.key.is_shift;
	console.debug("SCALE", bPosE);

}
tools.setOrigin = function(e) {
	var motion = tools.getMotion(tools.nowTime);
	var figure = tools.figure;
	var dlElement = tools.nowSelectElement;
	
	
	var origin = motion.origin;

	var style = dlElement.css();
	origin = origin || "50% 50%";
	if(!origin || origin === "none")
		return;
	
/*
	motion.origin = motion.origin || origin;
	motion.fill = "add";
	
	tools.getLayer().addMotion(motion);
*/
	
	figure.css("-webkit-transform-origin", origin);
	origin = origin.split(" ");
	figure.find(".origin").css("left", origin[0]);
	figure.find(".origin").css("top", origin[1]);
}