var data_type = [
	{type_name:"varchar", postgresql:"character varying"},
	{type_name:"int", postgresql:"integer"},
	{type_name:"timestamp", postgresql:"timestamp with time zone"},
	{type_name:"date", postgresql:"date"},
	{type_name:"char", postgresql:"character"},
	{type_name:"text", postgresql:"text"},
	{type_name:"long", postgresql:"bigint"},
	{type_name:"float", postgresql:"real"},
	{type_name:"boolean", postgresql:"boolean"}
];

function getDataType(type_name, db_vendor) {
	for(var i = 0; i < data_type.length; i++) {
		if(type_name == data_type[i].type_name) {
			if(db_vendor == "postgresql") {
				return data_type[i].postgresql;
			}
		}
	}
}
function is_graha_style_key(column_name) {
	if($("table#graha_table td.is_graha_style_key").text() == "t" && column_name == $("table#graha_table td.table_name").text() + "_id") {
		return true;
	}
	return false;
}
function is_graha_style_pseudo_column(column_name) {
	if($("table#graha_table td.is_graha_style_pseudo_column").text() == "t") {
		if(
			column_name == "insert_date"
			|| column_name == "insert_id"
			|| column_name == "insert_ip"
			|| column_name == "update_date"
			|| column_name == "update_id"
			|| column_name == "update_ip"
		) {
			return true;
		}
	}
	return false;
}
function getSchemaName() {
	if($("table#graha_table td.schema_name").text() != "") {
		return $("table#graha_table td.schema_name").text() + ".";
	} else {
		return "";
	}
}
$(document).ready(function() {
	var ddl_scripts = "";
	var comments_scripts = "";
	if($("table#graha_table td.is_graha_style_key").text() == "t") {
		ddl_scripts += "CREATE SEQUENCE ";
		ddl_scripts += getSchemaName() + "\"" + $("table#graha_table td.table_name").text() + "$" + $("table#graha_table td.table_name").text() + "_id\";\n\n";
	}
	if($("table#graha_table td.table_comments").text() != "") {
		comments_scripts += "comment on table ";
		comments_scripts += getSchemaName() + "" + $("table#graha_table td.table_name").text() + " is '" + $("table#graha_table td.table_comments").text() + "';\n\n";
	}

	ddl_scripts += "create table ";
	ddl_scripts += getSchemaName() + $("table#graha_table td.table_name").text() + "(\n";
	if($("table#graha_table td.is_graha_style_key").text() == "t") {
		ddl_scripts += "\t" + $("table#graha_table td.table_name").text() + "_id integer NOT NULL DEFAULT nextval('" + $("table#graha_table td.table_name").text() + "$" + $("table#graha_table td.table_name").text() + "_id'::regclass),\n";
		comments_scripts += "COMMENT ON COLUMN ";
		comments_scripts += getSchemaName() + "" + $("table#graha_table td.table_name").text() + "." + $("table#graha_table td.table_name").text() + "_id IS '고유번호';\n";
	}
	$("table#graha_column tbody tr").each(function() {
		if(is_graha_style_key($(this).find("td.column_name").text())) {
		} else if(is_graha_style_pseudo_column($(this).find("td.column_name").text())) {
		} else {
			if($(this).find("td.length").text() != "") {
				ddl_scripts += "\t" + $(this).find("td.column_name").text() + " " + getDataType($(this).find("td.data_type").text(), "postgresql") + "(" + $(this).find("td.length").text() + "),\n";
			} else {
				ddl_scripts += "\t" + $(this).find("td.column_name").text() + " " + getDataType($(this).find("td.data_type").text(), "postgresql") + ",\n";
			}
			if($(this).find("td.column_comments").text() != "") {
				comments_scripts += "COMMENT ON COLUMN ";
				comments_scripts += getSchemaName() + "" + $("table#graha_table td.table_name").text() + "." + $(this).find("td.column_name").text() + " IS '" + $(this).find("td.column_comments").text() + "';\n";
			}
		}
	});
	if($("table#graha_table td.is_graha_style_pseudo_column").text() == "t") {
		ddl_scripts += "\tinsert_date timestamp with time zone,\n";
		ddl_scripts += "\tinsert_id character varying(50),\n";
		ddl_scripts += "\tinsert_ip character varying(15),\n";
		ddl_scripts += "\tupdate_date timestamp with time zone,\n";
		ddl_scripts += "\tupdate_id character varying(50),\n";
		ddl_scripts += "\tupdate_ip character varying(15),\n";
		
		comments_scripts += "COMMENT ON COLUMN " + getSchemaName() + "" + $("table#graha_table td.table_name").text() + ".insert_date IS '작성일시';\n";
		comments_scripts += "COMMENT ON COLUMN " + getSchemaName() + "" + $("table#graha_table td.table_name").text() + ".insert_id IS '작성자ID';\n";
		comments_scripts += "COMMENT ON COLUMN " + getSchemaName() + "" + $("table#graha_table td.table_name").text() + ".insert_ip IS '작성자IP';\n";
		comments_scripts += "COMMENT ON COLUMN " + getSchemaName() + "" + $("table#graha_table td.table_name").text() + ".update_date IS '최종수정일시';\n";
		comments_scripts += "COMMENT ON COLUMN " + getSchemaName() + "" + $("table#graha_table td.table_name").text() + ".update_id IS '최종수정자ID';\n";
		comments_scripts += "COMMENT ON COLUMN " + getSchemaName() + "" + $("table#graha_table td.table_name").text() + ".update_ip IS '최종수정자IP';\n";
	}
	ddl_scripts += "\tCONSTRAINT " + $("table#graha_table td.table_name").text() + "_pkey PRIMARY KEY (";
	if($("table#graha_table td.is_graha_style_key").text() == "t") {
		ddl_scripts += $("table#graha_table td.table_name").text() + "_id";
	} else {
		var idx = 0;
		$("table#graha_column tbody tr").each(function() {
			if($(this).find("td.is_primary_key").text() == "t") {
				if(idx > 0) {
					ddl_scripts += ", ";
				}
				ddl_scripts += $(this).find("td.column_name").text();
				idx++;
			}
		});
	}
	ddl_scripts += ")\n";
	ddl_scripts += ") WITH ( OIDS=FALSE );\n";

	$("table#graha_table td.ddl_scripts").text(ddl_scripts + "\n" + comments_scripts);
});