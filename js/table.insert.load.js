function loadFromDB() {
	if(
		$("table#graha_table td.table_name input.table_name").val() == ""
		|| $("table#graha_table td.jndi input.jndi").val() == ""
	) {
		alert("테이블이름과 JNDI 이름을 필수항목입니다.");
	} else {
		if(confirm("DB에서 불러오기를 실행하면 입력한 정보가 삭제됩니다.  정말로 실행하시겠습니까?")) {
			var formData = null;
			formData = new FormData();
			formData.append("table_name", $("table#graha_table td.table_name input.table_name").val());
			formData.append("jndi", $("table#graha_table td.jndi input.jndi").val());
			if($("table#graha_table td.schema_name input.schema_name").val() != "") {
				formData.append("schema_name", $("table#graha_table td.schema_name input.schema_name").val());
			}
			var url = "load.xml";
			
			$.ajax({
				url: url,
				processData: false,
				contentType: false,
				type: 'POST',
				enctype: 'multipart/form-data',
				data: formData,
				success: function(result) {
					var obj = parse_graha_xml_document(result);
					if(obj.results.err) {
						alert("DB에서 불러오기 호출이 실패했습니다(" + obj.results.err + ")");
					} else {
						$("table#graha_column tr.graha").find("input").each(function() {
							if($(this).attr("type") != "button" && $(this).attr("type") != "hidden") {
								$(this).val("");
								if($(this).attr("type") == "checkbox") {
									$(this).attr("checked", false);
								}
							}
						});
						$("table#graha_column tr.graha").find("select").each(function() {
							$(this).val("");
						});
						
						$("table#graha_table td.table_comments input.table_comments").val(obj.results.table_comments);
						$("table#graha_table td.schema_name input.schema_name").val(obj.results.table_schema);
						if(obj.results.record_count) {
							var exists_graha_style_key = false;
							var exists_insert_date = false;
							var exists_insert_id = false;
							var exists_insert_ip = false;
							var exists_update_date = false;
							var exists_update_id = false;
							var exists_update_ip = false;

							var dataType = "";
							for(var i = 0; i < obj.results.record_count; i++) {
								if($("table#graha_column select[name='graha_column.data_type." + (i + 1) + "']").length == 0) {
									var last = $("table#graha_column tbody tr:last-child").clone();
									last.find("input").each(function() {
										var name = $(this).attr("name");
										$(this).attr("name", name.substring(0, name.lastIndexOf(".")) + "." + (i + 1));
										if($(this).attr("type") != "button") {
											$(this).val("");
											if($(this).attr("type") == "checkbox") {
												$(this).attr("checked", false);
											}
										}
									});
									last.find("td.graha_column\\.del input").click(function(event) {
										del(this);
									});
									last.find("select").each(function() {
										var name = $(this).attr("name");
										$(this).attr("name", name.substring(0, name.lastIndexOf(".")) + "." + (i + 1));
										$(this).val("");
									});
									last.appendTo($("table#graha_column tbody"));
								}
								$("table#graha_column td.graha_column\\.column_comments input[name='graha_column.column_comments." + (i + 1) + "'").val(obj.results["column_comments." + (i + 1)]);
								$("table#graha_column td.graha_column\\.column_name input[name='graha_column.column_name." + (i + 1) + "'").val(obj.results["column_name." + (i + 1)]);
								dataType = obj.results["data_type." + (i + 1)];
								if(dataType == "character varying") {
									dataType = "varchar";
								} else if(dataType == "integer") {
									dataType = "int";
								} else if(dataType == "character") {
									dataType = "char";
								} else if(dataType == "text") {
									dataType = "text";
								} else if(dataType == "bigint") {
									dataType = "long";
								} else if(dataType == "float") {
									dataType = "float";
								} else if(dataType == "double") {
									dataType = "double";
								} else if(dataType == "boolean") {
									dataType = "boolean";
								} else if(dataType == "date") {
									dataType = "date";
								} else if(dataType.indexOf(" ") > 0 && dataType.substring(0, dataType.indexOf(" ")) == "timestamp") {
									dataType = "timestamp";
								}
								$("table#graha_column td.graha_column\\.data_type select[name='graha_column.data_type." + (i + 1) + "'").val(dataType);
								if(obj.results["character_maximum_length." + (i + 1)] > 0 && (dataType == "varchar" || dataType == "char")) {
									$("table#graha_column td.graha_column\\.length input[name='graha_column.length." + (i + 1) + "'").val(obj.results["character_maximum_length." + (i + 1)]);
								}
								if(obj.results["column_default." + (i + 1)].indexOf("(") > 0 && obj.results["column_default." + (i + 1)].substring(0, obj.results["column_default." + (i + 1)].indexOf("(")) == "nextval") {
									$("table#graha_column td.graha_column\\.is_sequence input[name='graha_column.is_sequence." + (i + 1) + "'").attr("checked", true);
								}
								if(obj.results["is_pk_column." + (i + 1)] > 0) {
									$("table#graha_column td.graha_column\\.is_primary_key input[name='graha_column.is_primary_key." + (i + 1) + "'").attr("checked", true);
									if(obj.results["column_name." + (i + 1)] == obj.results.table_name + "_id") {
										exists_graha_style_key = true;
									}
								}
								if(obj.results["column_name." + (i + 1)] == "insert_date" && dataType == "timestamp") {
									exists_insert_date = true;
								} else if(obj.results["column_name." + (i + 1)] == "insert_id" && dataType == "varchar") {
									exists_insert_id = true;
								} else if(obj.results["column_name." + (i + 1)] == "insert_ip" && dataType == "varchar") {
									exists_insert_ip = true;
								} else if(obj.results["column_name." + (i + 1)] == "update_date" && dataType == "timestamp") {
									exists_update_date = true;
								} else if(obj.results["column_name." + (i + 1)] == "update_id" && dataType == "varchar") {
									exists_update_id = true;
								} else if(obj.results["column_name." + (i + 1)] == "update_ip" && dataType == "varchar") {
									exists_update_ip = true;
								}
							}
							if(exists_graha_style_key) {
								$("table#graha_table td.is_graha_style_key input.is_graha_style_key").attr("checked", true);
							}
							if(exists_insert_date && exists_insert_id && exists_insert_ip && exists_update_date && exists_update_id && exists_update_ip) {
								$("table#graha_table td.is_graha_style_pseudo_column input.is_graha_style_pseudo_column").attr("checked", true);
							}
							
						}
					}
				}
			}).always(function() {
				
			});
		}
	}
}
$(document).ready(function() {
	if($("form#insert input[name='query_id']").val() != "") {
		$("div.nav.top div.box.center").append($("<button type='button' onclick='loadFromDB()'>조회(DB)</button>"));
	}
});
