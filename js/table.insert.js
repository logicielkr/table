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
$(window).on("load", function() {
/*
	if(!$("table#graha_column th.graha_column\\.column_name").is(':visible')) {
		$("table#graha_column td.graha_column\\.column_name input")
		.add("table#graha_column td.graha_column\\.column_comments input")
		.add("table#graha_column td.graha_column\\.length input")
		.add("table#graha_column td.graha_column\\.contents input")
		.each(function() {
			if($(this).val() == "") {
				if($(this).parent().hasClass("graha_column.column_name")) {
					$(this).val("속성ID을 입력하세요.");
				} else if($(this).parent().hasClass("graha_column.column_comments")) {
					$(this).val("속성명을 입력하세요.");
				} else if($(this).parent().hasClass("graha_column.length")) {
					$(this).val("길이를 입력하세요.");
				} else if($(this).parent().hasClass("graha_column.contents")) {
					$(this).val("비고를 입력하세요.");
				}
				$(this).addClass("label");
			}
			$(this).focus(function() {
				if($(this).hasClass("label")) {
					$(this).val("");
					$(this).removeClass("label");
				}
			});
			$(this).blur(function() {
				if($(this).val() == "") {
					if($(this).parent().hasClass("graha_column.column_name")) {
						$(this).val("속성ID을 입력하세요.");
					} else if($(this).parent().hasClass("graha_column.column_comments")) {
						$(this).val("속성명을 입력하세요.");
					} else if($(this).parent().hasClass("graha_column.length")) {
						$(this).val("길이를 입력하세요.");
					} else if($(this).parent().hasClass("graha_column.contents")) {
						$(this).val("비고를 입력하세요.");
					}
					$(this).addClass("label");
				}
			});
		});
	}
*/
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
/*
		if(!$("table#graha_column th.graha_column\\.column_name").is(':visible')) {
			$("table#graha_column td.graha_column\\.column_name input")
			.add("table#graha_column td.graha_column\\.column_comments input")
			.add("table#graha_column td.graha_column\\.length input")
			.add("table#graha_column td.graha_column\\.contents input")
			.each(function() {
				if($(this).hasClass("label")) {
					$(this).val("");
				}
			});
		}
*/
		return true;
	} else {
		return false;
	}
}