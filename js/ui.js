var button_texts = ["Hit me again",
					"Tap that",
					"Uno mas",
					"Moar thangz",
					"Think of other things"];
var del_sep = "#";

function displayItem(id, val, select) {
	if ($('#'+id).length) {
		if (select) $('#'+id).find("input").focus();
		return;
	}
	// add a new element to the end of the list
	var $newEl = $($("#list_template").html());
	$newEl.attr("id", id).find(".list_entry").attr("value", val);
	$newEl.find(".delete").attr("id", "del" + del_sep + id);
	$("#list").append($newEl);
	// other UI updates
	updateButton();
	if ($(document).height() > $(window).height()) {
		// only scroll if appropriate
		window.scrollTo(0, document.body.scrollHeight);
	}
	setActions($newEl);
	if (select) $newEl.find("input").focus();
};

function setActions(el) {
	// handle focus/click on list elements
    el.find("input[type='text']").focus(function() {
		this.setSelectionRange(0, 9999);    
		return false;
    }).bind("touchend", function() {
    	if (!$(this).is(":focus")) {
			this.setSelectionRange(0, 9999);
		}
		return false;
    }).mouseup(function() {	
    	if (!$(this).is(":focus")) {
			this.setSelectionRange(0, 9999);
		}
		return false;
    });
    // handle delete click, send event to data.js
    el.find("img.delete").click(function(e) {
    	var id = $(this).attr("id").split(del_sep)[1];
	    $(document).trigger("delete_el", [id]);
    });
    // handle value changed, send to data.js
    el.find("input").keyup(function() {
    	var id = el.attr("id");
    	var content = $(this).val();
    	if (id == "title_container") {
	    	$(document).trigger("update_title", [content]);
    	} else {
		    $(document).trigger("update_el", [id, content]);
	    }
    })
};

function deleteItem(id) {
    $("#" + id).stop().animate({ opacity: 0 }, 200, function() {
	    $("#" + id).stop().animate( { height: "0px" }, 200, function() {
		    $("#" + id).remove();
	    });
    });
};

function updateItem(id, value) {
	var field = $("#" + id).find("input");
	if (field.val() != value) field.val(value);
}

function loadButton() {
	$("#new").css("visibility", "visible");
	updateButton();
};

function updateButton() {
	$("#new").html(button_texts[Math.floor(Math.random()*button_texts.length)]);
};