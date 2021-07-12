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

/**
 * 테이블정보
 * @author HeonJik, KIM
 * @see LoadFromDBProcessorImpl
 * @version 0.9
 * @since 0.9
 */

public class TableInfo {
	private String tableSchema;
	public void setTableSchema(String tableSchema) {
		this.tableSchema = tableSchema;
	}
	public String getTableSchema() {
		return this.tableSchema;
	}
	private String tableName;
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getTableName() {
		return this.tableName;
	}
	private String tableComments;
	public void setTableComments(String tableComments) {
		this.tableComments = tableComments;
	}
	public String getTableComments() {
		return this.tableComments;
	}
	public TableInfo() {
	}
}