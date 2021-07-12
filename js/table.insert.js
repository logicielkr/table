function del(obj) {
	$(obj).parent().parent().find("input").each(function() {
		if($(this).attr("type") != "hidden" && $(this).attr("type") != "button") {
			if($(obj).attr("value") == "삭제") {
				$(this).attr("disabled", true);
			} else {
				$(this).attr("disabled", false);
			}
		}
	});
	$(obj).parent().parent().find("select").each(function() {
		if($(obj).attr("value") == "삭제") {
			$(this).attr("disabled", true);
		} else {
			$(this).attr("disabled", false);
		}
	});
	if($(obj).attr("value") == "삭제") {
		$(obj).attr("value", "취소");
	} else {
		$(obj).attr("value", "삭제");
	}
}
$(document).ready(function() {
	$("table#graha_column td.graha_column\\.del input").click(function(event) {
		del(this);
	});
});
function check_submit(form, msg) {
	if(typeof(_check) == "function" && !_check(form)) {
		return false;
	}
	if(confirm(msg)) {
		$("table#graha_column input[disabled]").add("table#graha_column select[disabled]").each(function() {
			$(this).val("");
			$(this).attr("disabled", false);
		});
		return true;
	} else {
		return false;
	}
}