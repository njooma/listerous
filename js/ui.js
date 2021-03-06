// constants
var buttonTexts = ["Hit me again",
					"Uno mas",
					"One more time",
					"I'll have another",
					"Keep 'em coming",
					"Moar plz",
					"Feed me",
					"Never enough",
					"To infinity & beyond"];
var delSep = "#";

// preloads (global)
delImage = new Image();
delHovImage = new Image();
delImage.src = "/graphics/x.png";
delHovImage.src = "/graphics/x_hover.png";

// fade in once loaded and fadeAllIn called
var resLoaded = false;
var dataLoaded = false;

$(window).load(function() {
	resLoaded = true;
	if (resLoaded && dataLoaded) $("#contents_wrapper").fadeIn(FADETIME);
});

function fadeAllIn() {
	dataLoaded = true;
	if (resLoaded && dataLoaded) $("#contents_wrapper").fadeIn(FADETIME);
};
// end fade in shit

/* add a new item with given id & val; focus - focus after add; select - select all text on click */
function displayItem(id, val, focus, select) {
	// hacky fix: I think clone takes longer on mobile, so let it catch up before fading
	var delayBase = 75;
	var delayTime = isMobile.any() ? delayBase : 0; 
	var localFadeTime = isMobile.any() ? FADETIME * 2 - delayBase : FADETIME * 2;
	// if it already exists... it was added from Firebase
	if ($("#"+id).length) {
		if (focus) {
			$("#"+id).find("input").focus();
			$("#"+id).find(".delete").hide().load(function() { $(this).delay(delayTime).fadeIn(localFadeTime); });
		}
		return;
	}
	// add a new element to the end of the list
	var $newEl = $($("#list_template").html());
	$newEl.attr("id", id).find(".list_entry").attr("value", val);
	$newEl.find(".delete").attr("id", "del" + delSep + id);
	if (focus) $newEl.find(".delete").hide();
	$("#list").append($newEl);
	// other UI updates
	updateButton();
	setActions($newEl, select);
	if ($(document).height() > $(window).height()) {
		// only scroll if appropriate
		window.scrollTo(0, document.body.scrollHeight);
	}
	if (focus) {
		$newEl.find("input").focus();
		$newEl.find(".delete").load(function() { $(this).delay(delayTime).fadeIn(localFadeTime); });
	}
	$newEl.show();
};

/* set up a newly added list element for user interaction; select whole text on click if "select" */
function setActions(el, select) {
	if (select) {
		// handle focus/click on list elements
	    el.find("input[type='text']").focus(function() {
			$(this).setSelection(0, 9999); // this doesn't work in IE!  
			return false;
	    }).mouseup(function() {	
	    	if (!$(this).is(":focus")) {
				$(this).setSelection(0, 9999);
			}
			return false;
	    });
    }
    // handle delete click, send event to data.js
    el.find("img.delete").click(function(e) {
    	var id = $(this).attr("id").split(delSep)[1];
	    $(document).trigger("delete_el", [id]);
    }).hover(function() {
    	// hover effects for X
    	$(this).attr("src", "/graphics/x_hover.png");
    }, function () {
	    $(this).attr("src", "/graphics/x.png");
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

/* animate removing an item from the list */
function deleteItem(id) {
    $("#" + id).stop().animate({ opacity: 0 }, FADETIME, function() {
	    $("#" + id).stop().animate( { height: "0px" }, FADETIME, function() {
		    $("#" + id).remove();
	    });
    });
};

/* change the text of item with id to value */
function updateItem(id, value) {
	var field = $("#" + id).find("input");
	if (field.val() != value) field.val(value);
};

/* get a new (random) button text for the button */
function updateButton() {
	// get a new text which differs from the current
	var newText = buttonTexts[Math.floor(Math.random()*buttonTexts.length)];
	while (newText == $("#new").html()) {
		newText = buttonTexts[Math.floor(Math.random()*buttonTexts.length)];
	}
	// set the text of the button
	$("#new").html(newText);
};