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
 * 컬럼정보

 * @author HeonJik, KIM
 
 * @see LoadFromDBProcessorImpl
 
 * @version 0.9
 * @since 0.9
 */

public class ColumnInfo {
	private String columnName;
	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}
	public String getColumnName() {
		return this.columnName;
	}
	private String columnComments;
	public void setColumnComments(String columnComments) {
		this.columnComments = columnComments;
	}
	public String getColumnComments() {
		return this.columnComments;
	}
	private Integer ordinalPosition;
	public void setOrdinalPosition(Integer ordinalPosition) {
		this.ordinalPosition = ordinalPosition;
	}
	public Integer getOrdinalPosition() {
		return this.ordinalPosition;
	}
	private String columnDefault;
	public void setColumnDefault(String columnDefault) {
		this.columnDefault = columnDefault;
	}
	public String getColumnDefault() {
		return this.columnDefault;
	}
	private String isNullable;
	public void setIsNullable(String isNullable) {
		this.isNullable = isNullable;
	}
	public String getIsNullable() {
		return this.isNullable;
	}
	private String dataType;
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public String getDataType() {
		return this.dataType;
	}
	private Integer characterMaximumLength;
	public void setCharacterMaximumLength(Integer characterMaximumLength) {
		this.characterMaximumLength = characterMaximumLength;
	}
	public Integer getCharacterMaximumLength() {
		return this.characterMaximumLength;
	}
	private Integer isPkColumn;
	public void setIsPkColumn(Integer isPkColumn) {
		this.isPkColumn = isPkColumn;
	}
	public Integer getIsPkColumn() {
		return this.isPkColumn;
	}
	public ColumnInfo() {
	}
}