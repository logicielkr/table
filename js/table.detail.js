var data_type = [
	{
		type_name : "varchar",
		h2 : "CHARACTER VARYING",
		hsql : "CHARACTER VARYING",
		derby : "CHARACTER VARYING",
		sqlite : "VARCHAR",
		maria : "VARCHAR",
		oracle : "VARCHAR2",
		postgresql : "character varying"
	},
	{
		type_name : "int",
		h2 : "INTEGER",
		hsql : "INTEGER",
		derby : "INTEGER",
		sqlite : "INTEGER",
		maria : "INTEGER",
		oracle : "NUMBER(10)",
		postgresql : "integer"
	},
	{
		type_name : "timestamp",
		h2 : "TIMESTAMP WITH TIME ZONE",
		hsql : "TIMESTAMP WITH TIME ZONE",
		derby : "TIMESTAMP",
		sqlite : "DATETIME",
		maria : "TIMESTAMP",
		oracle : "TIMESTAMP WITH TIME ZONE",
		postgresql : "timestamp with time zone"		
	},
	{
		type_name : "date",
		h2 : "DATE",
		hsql : "DATE",
		derby : "DATE",
		sqlite : "DATE",
		maria : "DATE",
		oracle : "DATE",
		postgresql : "date"
	},
	{
		type_name : "char",
		h2 : "CHARACTER",
		hsql : "CHARACTER",
		derby : "CHAR",
		sqlite : "CHARACTER",
		maria : "CHAR",
		oracle : "CHAR",
		postgresql : "character"
	},
	{
		type_name : "text",
		h2 : "text",
		hsql : "LONGVARCHAR",
		derby : "LONG VARCHAR",
		sqlite : "TEXT",
		maria : "TEXT",
		oracle : "VARCHAR2(32767)",
		postgresql : "text"
	},
	{
		type_name : "long",
		h2 : "BIGINT",
		hsql : "BIGINT",
		derby : "BIGINT",
		sqlite : "BIGINT",
		maria : "BIGINT",
		oracle : "NUMBER(19)",
		postgresql : "bigint"
	},
	{
		type_name : "float",
		h2 : "REAL",
		hsql : "FLOAT",
		derby : "REAL",
		sqlite : "REAL",
		maria : "FLOAT",
		oracle : "FLOAT(23)",
		postgresql : "real"
	},
	{
		type_name : "double", 
		h2 : "DOUBLE PRECISION",
		hsql : "DOUBLE",
		derby : "DOUBLE PRECISION",
		sqlite : "DOUBLE",
		maria : "DOUBLE",
		oracle : "FLOAT(49)",
		postgresql : "double precision"
	},
	{
		type_name : "boolean",
		h2 : "BOOLEAN",
		hsql : "BOOLEAN",
		derby : "BOOLEAN",
		sqlite : "BOOLEAN",
		maria : "BOOLEAN",
		oracle : "CHAR(1)",
		postgresql : "boolean"
	}
];
function support(db_vendor, type) {
	if(type == "comment") {
		if(db_vendor == "sqlite") {
			return false;
		} else if(db_vendor == "derby") {
			return false;
		} else if(db_vendor == "maria") {
			return false;
		}
		return true;
	} else if(type == "sequence") {
		if(db_vendor == "sqlite") {
			return false;
		}
		return true;
	} else if(type == "schema") {
		if(db_vendor == "postgresql") {
			return true;
		}
	}
	return false;
}
function getDataType(type_name, db_vendor, length) {
	var dataType = null;
	for(var i = 0; i < data_type.length; i++) {
		if(type_name == data_type[i].type_name) {
			if(db_vendor == "h2") {
				dataType = data_type[i].h2;
			} else if(db_vendor == "hsql") {
				dataType = data_type[i].hsql;
				if(
					type_name == "varchar" &&
					(arguments.length <= 2 || length == "" || length == 0)
				) {
					dataType += "(8000)";
				}
			} else if(db_vendor == "derby") {
				dataType = data_type[i].derby;
				if(
					type_name == "varchar" &&
					(arguments.length <= 2 || length == "" || length == 0)
				) {
					dataType += "(32672)";
				}
			} else if(db_vendor == "sqlite") {
				dataType = data_type[i].sqlite;
			} else if(db_vendor == "maria") {
				dataType = data_type[i].maria;
				if(
					type_name == "varchar" &&
					(arguments.length <= 2 || length == "" || length == 0)
				) {
					dataType += "(255)";
				}
				
			} else if(db_vendor == "oracle") {
				dataType = data_type[i].oracle;
				if(
					type_name == "varchar" &&
					(arguments.length <= 2 || length == "" || length == 0)
				) {
					dataType += "(4000)";
				}
			} else if(db_vendor == "postgresql") {
				dataType = data_type[i].postgresql;
			}
		}
	}
	if(dataType != null && arguments.length > 2 && length > 0) {
		dataType += "(" + length + ")";
	}
	return dataType;
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
function getSchemaName(db_vendor) {
	if(support(db_vendor, "schema") && $("table#graha_table td.schema_name").text() != "") {
		return $("table#graha_table td.schema_name").text() + ".";
	} else {
		return "";
	}
}
function getDDLScript(db_vendor) {
	var ddl_scripts = "";
	var comments_scripts = "";
	if(support(db_vendor, "sequence") && $("table#graha_table td.is_graha_style_key").text() == "t") {
		ddl_scripts += "CREATE SEQUENCE ";
		ddl_scripts += getSchemaName(db_vendor);
		if(db_vendor != "maria") {
			ddl_scripts += "\"";
		}
		ddl_scripts += $("table#graha_table td.table_name").text() + "$" + $("table#graha_table td.table_name").text() + "_id";
		if(db_vendor != "maria") {
			ddl_scripts += "\"";
		}
		ddl_scripts += ";\n\n";
	} else if(support(db_vendor, "sequence")) {
		$("table#graha_column tbody tr td.column_name").each(function() {
			if(is_graha_style_key($(this).text())) {
			} else if(is_graha_style_pseudo_column($(this).text())) {
			} else {
				var is_seq = $(this).parent().find("td.is_sequence").text();
				if(is_seq == "t") {
					ddl_scripts += "CREATE SEQUENCE ";
					ddl_scripts += getSchemaName(db_vendor);
					if(db_vendor != "maria") {
						ddl_scripts += "\"";
					}
					ddl_scripts += $("table#graha_table td.table_name").text() + "$" + $(this).text() + "_id";
					if(db_vendor != "maria") {
						ddl_scripts += "\"";
					}
					ddl_scripts += ";\n\n";
				}
			}
		});
	}
	if(support(db_vendor, "comment") && $("table#graha_table td.table_comments").text() != "") {
		comments_scripts += "comment on table ";
		comments_scripts += getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + " is '" + $("table#graha_table td.table_comments").text() + "';\n\n";
	}

	ddl_scripts += "create table ";
	ddl_scripts += getSchemaName(db_vendor) + $("table#graha_table td.table_name").text() + "(\n";
	if($("table#graha_table td.is_graha_style_key").text() == "t") {
		ddl_scripts += "\t" + $("table#graha_table td.table_name").text() + "_id " + getDataType("int", db_vendor) + "";
		if(db_vendor == "postgresql") {
			ddl_scripts += " DEFAULT nextval('" + getSchemaName(db_vendor) + $("table#graha_table td.table_name").text() + "$" + $("table#graha_table td.table_name").text() + "_id'::regclass)";
		} else if(db_vendor == "h2") {
			ddl_scripts += " default " + getSchemaName(db_vendor) + "\"" + $("table#graha_table td.table_name").text() + "$" + $("table#graha_table td.table_name").text() + "_id\".nextval";
		} else if(db_vendor == "hsql") {
			ddl_scripts += " GENERATED BY DEFAULT AS SEQUENCE " + getSchemaName(db_vendor) + "\"" + $("table#graha_table td.table_name").text() + "$" + $("table#graha_table td.table_name").text() + "_id\"";
		} else if(db_vendor == "derby") {
			//nothing
		} else if(db_vendor == "sqlite") {
			ddl_scripts += " PRIMARY KEY AUTOINCREMENT";
		} else if(db_vendor == "maria") {
			//nothing
			//since "MariaDB 10.3.3" ("default (next value for s1)")
		} else if(db_vendor == "oracle") {
			//nothing
		}
		ddl_scripts += " NOT NULL";
		if(db_vendor == "maria") {
			ddl_scripts += " COMMENT '고유번호'";
		}
		ddl_scripts += "\n";
		if(support(db_vendor, "comment")) {
			comments_scripts += "COMMENT ON COLUMN ";
			comments_scripts += getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + "." + $("table#graha_table td.table_name").text() + "_id IS '고유번호';\n";
		}
	}
	var index = 0;
	if($("table#graha_table td.is_graha_style_key").text() == "t") {
		index++;
	}
	$("table#graha_column tbody tr td.column_name").each(function() {
		index++;
		if(is_graha_style_key($(this).text())) {
		} else if(is_graha_style_pseudo_column($(this).text())) {
		} else {
			var length, column_comments, data_type;
			if($(this).parent().find("td.length").length == 0) {
				length = $(this).parent().next().next().find("td.length").text();
				column_comments = $(this).parent().prev().find("td.column_comments").text();
				data_type = $(this).parent().next().find("td.data_type").text();
			} else {
				length = $(this).parent().find("td.length").text();
				column_comments = $(this).parent().find("td.column_comments").text();
				data_type = $(this).parent().find("td.data_type").text();
			}
			/*
			if(length != "" && length != "0") {
				ddl_scripts += "\t" + $(this).text() + " " + getDataType(data_type, db_vendor) + "(" + length + ")";
			} else {
				ddl_scripts += "\t" + $(this).text() + " " + getDataType(data_type, db_vendor) + "";
			}
			*/
			ddl_scripts += "\t";
			if(index > 1) {
				ddl_scripts += ", ";
			}
			ddl_scripts += $(this).text() + " " + getDataType(data_type, db_vendor, length) + "";
			if(db_vendor == "maria" && column_comments != "") {
				ddl_scripts += " COMMENT '" + column_comments + "'";
			}
			var is_pkey = $(this).parent().find("td.is_primary_key").text();
			var is_seq = $(this).parent().find("td.is_sequence").text();
			if(db_vendor == "sqlite") {
				if(is_pkey == "t") {
					ddl_scripts += " PRIMARY KEY";
					if(is_seq == "t") {
						ddl_scripts += " AUTOINCREMENT";
					}
				}
			} else {
				if(is_seq == "t") {
					if(db_vendor == "postgresql") {
						ddl_scripts += " DEFAULT nextval('" + getSchemaName(db_vendor) + $("table#graha_table td.table_name").text() + "$" + $(this).text() + "'::regclass)";
					} else if(db_vendor == "h2") {
						ddl_scripts += " default " + getSchemaName(db_vendor) + "\"" + $("table#graha_table td.table_name").text() + "$" + $(this).text() + "\".nextval";
					} else if(db_vendor == "hsql") {
						ddl_scripts += " GENERATED BY DEFAULT AS SEQUENCE " + getSchemaName(db_vendor) + "\"" + $("table#graha_table td.table_name").text() + "$" + $(this).text() + "\"";
					}
				}
			}
			ddl_scripts += "\n";
			if(support(db_vendor, "comment") && column_comments != "") {
				comments_scripts += "COMMENT ON COLUMN ";
				comments_scripts += getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + "." + $(this).text() + " IS '" + column_comments + "';\n";
			}
		}
	});
	if($("table#graha_table td.is_graha_style_pseudo_column").text() == "t") {
		ddl_scripts += "\t, insert_date " + getDataType("timestamp", db_vendor) + "";
		if(db_vendor == "maria") {
			ddl_scripts += " COMMENT '작성일시'";
		}
		ddl_scripts += "\n";
		ddl_scripts += "\t, insert_id " + getDataType("varchar", db_vendor, 50) + "";
		if(db_vendor == "maria") {
			ddl_scripts += " COMMENT '작성자ID'";
		}
		ddl_scripts += "\n";
		ddl_scripts += "\t, insert_ip " + getDataType("varchar", db_vendor, 15) + "";
		if(db_vendor == "maria") {
			ddl_scripts += " COMMENT '작성자IP'";
		}
		ddl_scripts += "\n";
		ddl_scripts += "\t, update_date " + getDataType("timestamp", db_vendor) + "";
		if(db_vendor == "maria") {
			ddl_scripts += " COMMENT '최종수정일시'";
		}
		ddl_scripts += "\n";
		ddl_scripts += "\t, update_id " + getDataType("varchar", db_vendor, 50) + "";
		if(db_vendor == "maria") {
			ddl_scripts += " COMMENT '최종수정자ID'";
		}
		ddl_scripts += "\n";
		ddl_scripts += "\t, update_ip " + getDataType("varchar", db_vendor, 15) + "";
		if(db_vendor == "maria") {
			ddl_scripts += " COMMENT '최종수정자IP'";
		}
		ddl_scripts += "\n";
		if(support(db_vendor, "comment")) {
			comments_scripts += "COMMENT ON COLUMN " + getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + ".insert_date IS '작성일시';\n";
			comments_scripts += "COMMENT ON COLUMN " + getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + ".insert_id IS '작성자ID';\n";
			comments_scripts += "COMMENT ON COLUMN " + getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + ".insert_ip IS '작성자IP';\n";
			comments_scripts += "COMMENT ON COLUMN " + getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + ".update_date IS '최종수정일시';\n";
			comments_scripts += "COMMENT ON COLUMN " + getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + ".update_id IS '최종수정자ID';\n";
			comments_scripts += "COMMENT ON COLUMN " + getSchemaName(db_vendor) + "" + $("table#graha_table td.table_name").text() + ".update_ip IS '최종수정자IP';\n";
		}
	}
	var exists_pk = false;
	if($("table#graha_table td.is_graha_style_key").text() == "t") {
		exists_pk = true;
	} else {
		$("table#graha_column tbody tr td.is_primary_key").each(function() {
			if($(this).text() == "t") {
				exists_pk = true;
			}
		});
	}
	if(exists_pk && db_vendor != "sqlite") {
		ddl_scripts += "\t, ";
		if(db_vendor == "postgresql" || db_vendor == "oracle") {
			ddl_scripts += "CONSTRAINT " + $("table#graha_table td.table_name").text() + "_pkey ";
		}
		
		ddl_scripts += "PRIMARY KEY (";
		if($("table#graha_table td.is_graha_style_key").text() == "t") {
			ddl_scripts += $("table#graha_table td.table_name").text() + "_id";
		} else {
			var idx = 0;
			$("table#graha_column tbody tr td.is_primary_key").each(function() {
				if($(this).text() == "t") {
					if(idx > 0) {
						ddl_scripts += ", ";
					}
					if($(this).parent().find("td.column_name").length == 0) {
						ddl_scripts += $(this).parent().prev().prev().prev().find("td.column_name").text();
					} else {
						ddl_scripts += $(this).parent().find("td.column_name").text();
					}
					idx++;
				}
			});
		}
		ddl_scripts += ")\n";
	}
	ddl_scripts += ")";
	if(exists_pk && db_vendor == "postgresql") {
		ddl_scripts += " WITH ( OIDS=FALSE )";
	}
	ddl_scripts += ";\n";
	if(support(db_vendor, "comment")) {
		return ddl_scripts + "\n" + comments_scripts;
	} else {
		return ddl_scripts;
	}
}
$(document).ready(function() {
//	$("table#graha_table td.ddl_scripts").text(ddl_scripts + "\n" + comments_scripts);
	$("table#ddl_scripts td.ddl_scripts_postgresql").text(getDDLScript("postgresql"));
	$("table#ddl_scripts td.ddl_scripts_oracle").text(getDDLScript("oracle"));
	
	$("table#ddl_scripts td.ddl_scripts_h2").text(getDDLScript("h2"));
	$("table#ddl_scripts td.ddl_scripts_hsql").text(getDDLScript("hsql"));
	$("table#ddl_scripts td.ddl_scripts_derby").text(getDDLScript("derby"));
	$("table#ddl_scripts td.ddl_scripts_sqlite").text(getDDLScript("sqlite"));
	$("table#ddl_scripts td.ddl_scripts_maria").text(getDDLScript("maria"));
	
	
	
	
});