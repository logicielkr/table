/*
 *
 * Copyright (C) HeonJik, KIM
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 * 
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the Free
 * Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 */

package kr.graha.sample.table;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.graha.post.interfaces.Processor;
import kr.graha.post.lib.Record;
import java.util.logging.Logger;
import java.util.logging.Level;
import kr.graha.helper.LOG;
import kr.graha.helper.DB;

import java.sql.SQLException;
import java.sql.Connection;
import java.util.List;

/**
 * 데이타베이스에서 물리적인 테이블 정보를 가져온다.(그라하(Graha) 전처리기/후처리기)
 * PostgreSQL 을 기준으로 작성되었다.
 * 이렇게 만들어야 하는 이유는 jndi 이름을 파라미터로 받아야 하기 때문이다.
 * 만약, 다른 jndi 에서 테이블 정보를 가져오지 않을 것이면, Graha XML 정의파일에 sql 을 기술하는 것이 Graha 의 철학에 부합한다.
 * 
 * @author HeonJik, KIM
 
 * @see kr.graha.post.interfaces.Processor
 
 * @version 0.9
 * @since 0.9
 */
public class LoadFromDBProcessorImpl implements Processor {
	
	private Logger logger = Logger.getLogger(this.getClass().getName());
	public LoadFromDBProcessorImpl() {
		
	}

/**
 * Graha 가 호출하는 메소드
 
 * @param request HttpServlet 에 전달된 HttpServletRequest
 * @param response HttpServlet 에 전달된 HttpServletResponse
 * @param params Graha 에서 각종 파라미터 정보를 담아서 넘겨준 객체
 * @param con 데이타베이스 연결(Connection)

 * @see javax.servlet.http.HttpServletRequest (Apache Tomcat 10 미만)
 * @see jakarta.servlet.http.HttpServletRequest (Apache Tomcat 10 이상)
 * @see javax.servlet.http.HttpServletResponse (Apache Tomcat 10 미만)
 * @see jakarta.servlet.http.HttpServletResponse (Apache Tomcat 10 이상)
 * @see kr.graha.post.lib.Record 
 * @see java.sql.Connection 
 */
	public void execute(HttpServletRequest request, HttpServletResponse response, Record params, Connection con) {
		Connection conn = null;
		try {
			if(!params.hasKey(Record.key(Record.PREFIX_TYPE_PARAM, "jndi"))) {
				params.put(Record.key(Record.PREFIX_TYPE_RESULT, "err"), "jndi parameter is empty!!!");
			} else {
				conn = DB.getConnection(params.getString(Record.key(Record.PREFIX_TYPE_PARAM, "jndi")));
				if(conn == null) {
					params.put(Record.key(Record.PREFIX_TYPE_RESULT, "err"), "fail database connection!!! check jndi parameter!!!");
				} else {
					TableInfo tableInfo = getTableInfo(conn, params.getString(Record.key(Record.PREFIX_TYPE_PARAM, "table_name")), params.getString(Record.key(Record.PREFIX_TYPE_PARAM, "jndi")), params.getString(Record.key(Record.PREFIX_TYPE_PARAM, "schema_name")));
					List columns = getColumnInfo(conn, params.getString(Record.key(Record.PREFIX_TYPE_PARAM, "table_name")), params.getString(Record.key(Record.PREFIX_TYPE_PARAM, "jndi")), params.getString(Record.key(Record.PREFIX_TYPE_PARAM, "schema_name")));
					if(tableInfo != null && columns != null && columns.size() > 0) {
						if(tableInfo.getTableSchema() != null) {
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "table_schema"), tableInfo.getTableSchema());
						}
						params.put(Record.key(Record.PREFIX_TYPE_RESULT, "table_name"), tableInfo.getTableName());
						if(tableInfo.getTableComments() != null) {
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "table_comments"), tableInfo.getTableComments());
						}
						for(int i = 0; i < columns.size(); i++) {
							ColumnInfo columnInfo = (ColumnInfo)columns.get(i);
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "column_name." + (i + 1)), columnInfo.getColumnName());
							if(columnInfo.getColumnComments() != null) {
								params.put(Record.key(Record.PREFIX_TYPE_RESULT, "column_comments." + (i + 1)), columnInfo.getColumnComments());
							}
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "ordinal_position." + (i + 1)), columnInfo.getOrdinalPosition());
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "column_default." + (i + 1)), columnInfo.getColumnDefault());
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "is_nullable." + (i + 1)), columnInfo.getIsNullable());
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "data_type." + (i + 1)), columnInfo.getDataType());
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "character_maximum_length." + (i + 1)), columnInfo.getCharacterMaximumLength());
							params.put(Record.key(Record.PREFIX_TYPE_RESULT, "is_pk_column." + (i + 1)), columnInfo.getIsPkColumn());
						}
						params.put(Record.key(Record.PREFIX_TYPE_RESULT, "record_count"), columns.size());
					} else {
						params.put(Record.key(Record.PREFIX_TYPE_RESULT, "err"), "fail fetch table info!!!");
					}
				}
				DB.close(conn);
			}
		} catch (SQLException e) {
			if(logger.isLoggable(Level.SEVERE)) { logger.severe(LOG.toString(e)); }
			params.put(Record.key(Record.PREFIX_TYPE_RESULT, "err"), LOG.toString(e));
			params.put(Record.key(Record.PREFIX_TYPE_RESULT, "error_message"), e.getMessage());
			params.put(Record.key(Record.PREFIX_TYPE_RESULT, "error_code"), e.getErrorCode());
			params.put(Record.key(Record.PREFIX_TYPE_RESULT, "sql_state"), e.getSQLState());
		} finally {
			DB.close(conn);
		}
	}
	public TableInfo getTableInfo(Connection con, String table_name, String jndi, String schema_name) throws SQLException {
		String sql = null;
		sql = "select\n";
		sql += "	table_schema, table_name,\n";
		sql += "	obj_description((table_schema || '.' || table_name)::regclass) as table_comments\n";
		sql += "from information_schema.tables\n";
		sql += "where table_name = ?\n";
		if(schema_name != null && !schema_name.trim().equals("")) {
			sql += "	and table_schema = ?\n";
		}
		Object[] param = null;
		if(schema_name != null && !schema_name.trim().equals("")) {
			param = new Object[2];
			param[0] = table_name;
			param[1] = schema_name;
		} else {
			param = new Object[1];
			param[0] = table_name;
		}
		try {
			List result = DB.fetch(con, TableInfo.class, sql, param);
			if(result.size() > 0) {
				return (TableInfo)result.get(0);
			} else {
				return null;
			}
		} catch (SQLException e) {
			throw e;
		} finally {
		}
	}
	public List getColumnInfo(Connection con, String table_name, String jndi, String schema_name) throws SQLException {
		String sql = null;
		sql = "select \n";
		sql += "	column_name,\n";
		sql += "	col_description((table_schema || '.' || table_name)::regclass, ordinal_position) as column_comments,\n";
		sql += "	ordinal_position,\n";
		sql += "	column_default,\n";
		sql += "	is_nullable,\n";
		sql += "	data_type,\n";
		sql += "	character_maximum_length,\n";
		sql += "	(\n";
		sql += "		select count(*)\n"; 
		sql += "		from INFORMATION_SCHEMA.KEY_COLUMN_USAGE as key_col\n"; 
		sql += "			left join INFORMATION_SCHEMA.TABLE_CONSTRAINTS as const\n"; 
		sql += "				on const.constraint_type = 'PRIMARY KEY'\n";
		sql += "				and key_col.constraint_name = const.constraint_name\n";
		sql += "		where col.table_name = key_col.table_name\n";
		sql += "			and col.column_name = key_col.column_name\n";
		sql += "	)::integer as is_pk_column\n";
		sql += "from information_schema.columns as col\n";
		sql += "where table_name = ?\n";
		if(schema_name != null && !schema_name.trim().equals("")) {
			sql += "	and table_schema = ?\n";
		}
		sql += "order by ordinal_position\n";
		Object[] param = null;
		if(schema_name != null && !schema_name.trim().equals("")) {
			param = new Object[2];
			param[0] = table_name;
			param[1] = schema_name;
		} else {
			param = new Object[1];
			param[0] = table_name;
		}
		try {
			return DB.fetch(con, ColumnInfo.class, sql, param);
		} catch (SQLException e) {
			throw e;
		} finally {
		}
	}

}
