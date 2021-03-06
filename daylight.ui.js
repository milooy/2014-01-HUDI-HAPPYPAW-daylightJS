daylight.ui = daylight.UI = {};
daylight.UI.drag = {};
daylight.UI.resize = {};
daylight.UI.textedit = {};
daylight.UI.drag.dragstart = function(e) {
	var dlDragTarget = $(".day-drag").has(e.dragElement, true);
	e.dragInfo.otop = parseFloat(dlDragTarget.css("top")) || 0;
	e.dragInfo.oleft = parseFloat(dlDragTarget.css("left")) || 0;
}
daylight.UI.drag.drag = function(e) {
	var dlDragTarget = $(".day-drag").has(e.dragElement, true);
	if(dlDragTarget.size() === 0)
		return;
	dlDragTarget.css("left", e.dragInfo.oleft + e.dragX);
	dlDragTarget.css("top", e.dragInfo.otop + e.dragY);
	
}
daylight.UI.drag.dragend = function(e) {
}
daylight.UI.resize.dragstart = function(e) {
	var dlResizeTarget = $(".day-resize").has(e.dragElement, true);
	if(dlResizeTarget.size() === 0)
		return;
	var i, length = dlResizeTarget.size(),
		dlRemoveTarget;

	//day-resize 안에 day-reisze가 있는 경우.
	while(dlResizeTarget.size() > 1) {
		for(i = 0; i < length; ++i) {
			dlRemoveTarget = dlResizeTarget.has(dlResizeTarget.get(i));
			if(dlRemoveTarget.size() > 0)
				break;
		}
		//removeLength = dlRemoveTarget.size();
		dlRemoveTarget.each(function() {
			dlResizeTarget.subtract(this);
		});
		length = dlResizeTarget.size();
	}
	
	var dlDragElement = daylight(e.dragElement);

	console.debug("resize");
	e.dragInfo.dlResizeTarget = dlResizeTarget;
	e.dragInfo.owidth = dlResizeTarget.css("width");
	e.dragInfo.oheight = dlResizeTarget.css("height");
	e.dragInfo.otop = dlResizeTarget.css("top");
	e.dragInfo.oleft = dlResizeTarget.css("left");
	e.dragInfo.obottom = dlResizeTarget.css("bottom");
	e.dragInfo.oright = dlResizeTarget.css("right");
	e.dragInfo.pos = dlDragElement.attr("data-direction");	
	
}
daylight.UI.resize.drag = function(e) {
	if(!e.dragInfo.dlResizeTarget)
		return;
		
	var dlResizeTarget = e.dragInfo.dlResizeTarget;

	if(dlResizeTarget.size() === 0)
		return;


	while(dlResizeTarget.size() > 1) {
		for(i = 0; i < length; ++i) {
			dlRemoveTarget = dlResizeTarget.has(dlResizeTarget.get(i));
			if(dlRemoveTarget.size() > 0)
				break;
		}
		//removeLength = dlRemoveTarget.size();
		dlRemoveTarget.each(function() {
			dlResizeTarget.subtract(this);
		});
		
		length = dlResizeTarget.size();
	}
	
	var info = e.dragInfo;
	var pos = info.pos;
	var properties = {};
	
	var bPosS = pos.indexOf("s") != -1;
	var bPosW = pos.indexOf("w") != -1;
	var bPosE = pos.indexOf("e") != -1;
	var bPosN = pos.indexOf("n") != -1;
	
	var width = parseFloat(info.owidth);
	var height = parseFloat(info.oheight);
	
	if(bPosE) {
		if(info.oright !== "auto")
			properties.right = parseFloat(info.oright) - e.dragX;
			
		width = width + e.dragX;
		properties.width = width;
	}
	
	if(bPosS) {
		if(info.obottom !== "auto")
			properties.bottom = parseFloat(info.obottom) + e.dragY;
			
		height = height + e.dragY;
		properties.height = height;
	}
	
	if(bPosN) {
		if(info.obottom === "auto")
			properties.top = (parseFloat(info.otop) || 0) + e.dragY;
	
		properties.height = height - e.dragY;
	}
	
	if(bPosW) {
		if(info.oright === "auto")
			properties.left = (parseFloat(info.oleft) || 0) + e.dragX;
	
		width = width - e.dragX;
		properties.width = width;
	}
	
	for(var property in properties) {
		dlResizeTarget.css(property, properties[property] + "px");
	}
	
	dlResizeTarget.trigger("resize", {direction:{n:bPosN, s:bPosS, w:bPosW, e:bPosE}});	
}
daylight.UI.resize.dragend = function(e) {
	if(!e.dragInfo.dlResizeTarget)
		return;
		
	e.dragInfo.dlResizeTarget.trigger("endresize");
}
daylight.ui.textedit.setText = function(dlTarget, text) {
	var sPrefix = dlTarget.attr("data-edit-complete-prefix") || "";
	var sSuffix = dlTarget.attr("data-edit-complete-suffix") || "";
	var sText = sPrefix + text + sSuffix;
	dlTarget.attr("data-text", text);
	dlTarget.html(sText);
}
$(document).ready(function() {
	$("body").drag();
	
	var is_drag_start = false;
	var otop, oleft;
	$("body").on("dragstart", function(e) {
	
		e.stopPropagation();
		
		var dlElement = $(e.dragElement);
		if(dlElement.hasClass("day-drag-draggable"))
			daylight.UI.drag.dragstart(e);
		else if(dlElement.hasClass("day-resize-draggable"))
			daylight.UI.resize.dragstart(e);

	});
	$("body").on("drag", function(e) {
		e.stopPropagation();
		
		var dlElement = $(e.dragElement);
		if(dlElement.hasClass("day-drag-draggable"))
			daylight.UI.drag.drag(e);
		else if(dlElement.hasClass("day-resize-draggable"))
			daylight.UI.resize.drag(e);
	});
	$("body").on("dragend", function(e) {
		e.stopPropagation();
		
		var dlElement = $(e.dragElement);
		if(dlElement.hasClass("day-drag-draggable"))
			daylight.UI.drag.dragend(e);
		else if(dlElement.hasClass("day-resize-draggable"))
			daylight.UI.resize.dragend(e);
	});
	//for daylight.css
	$(".navbar-toggle").click(function(e) {
		var dlElement = daylight(this);

		var selector = dlElement.attr("data-target");
		if(!selector)
			return;
			
		daylight(selector).toggleClass("collapse");
		return;
	});

	$("body").click(function(e) {
		if(!daylight.hasClass(e.target, "day-text-editable"))
			return;
			
		if(!daylight.hasClass(e.target, "day-mode-edit"))
			return;
		
		var dlTarget = $(e.target);
		dlTarget.removeClass("day-mode-edit");
		var dlTextEdit = dlTarget.find(".day-textedit");
		var oldVal = dlTarget.attr("data-text");
		var val = dlTextEdit.val();
		daylight.ui.textedit.setText(dlTarget, val);
		
		daylight.trigger(document, "editComplete", {editTarget: dlTarget, completeText: val, oldText: oldVal});
	})
	$("body").dblclick(function(e) {
		if(!daylight.hasClass(e.target, "day-text-editable"))
			return;
		
		var dlTarget = $(e.target);
		dlTarget.addClass("day-mode-edit");
		dlTarget.html('<input type="text" class="day-textedit" value="'+(dlTarget.attr("data-text") || "")+'"/>');
		
	});

});