CREATE SCHEMA graha_table;

CREATE SEQUENCE graha_table."graha_table$graha_table_id";

create table graha_table.graha_table(
	graha_table_id integer NOT NULL DEFAULT nextval('graha_table.graha_table$graha_table_id'::regclass),
	table_name character varying,
	table_comments character varying,
	contents text,
	jndi character varying,
	is_graha_style_key boolean,
	is_graha_style_pseudo_column boolean,
	schema_name character varying,
	gbn character varying,
	insert_date timestamp with time zone,
	insert_id character varying(50),
	insert_ip character varying(15),
	update_date timestamp with time zone,
	update_id character varying(50),
	update_ip character varying(15),
	CONSTRAINT graha_table_pkey PRIMARY KEY (graha_table_id)
) WITH ( OIDS=FALSE );

comment on table graha_table.graha_table is '테이블';

COMMENT ON COLUMN graha_table.graha_table.graha_table_id IS '고유번호';
COMMENT ON COLUMN graha_table.graha_table.table_name IS '테이블이름';
COMMENT ON COLUMN graha_table.graha_table.table_comments IS '테이블설명';
COMMENT ON COLUMN graha_table.graha_table.contents IS '비고';
COMMENT ON COLUMN graha_table.graha_table.jndi IS 'JNDI 이름';
COMMENT ON COLUMN graha_table.graha_table.is_graha_style_key IS 'Graha 스타일 Primary Key 사용여부';
COMMENT ON COLUMN graha_table.graha_table.is_graha_style_pseudo_column IS 'Graha 스타일 의사 컬럼 사용 여부';
COMMENT ON COLUMN graha_table.graha_table.schema_name IS '스키마이름';
COMMENT ON COLUMN graha_table.graha_table.gbn IS '업무구분';
COMMENT ON COLUMN graha_table.graha_table.insert_date IS '작성일시';
COMMENT ON COLUMN graha_table.graha_table.insert_id IS '작성자ID';
COMMENT ON COLUMN graha_table.graha_table.insert_ip IS '작성자IP';
COMMENT ON COLUMN graha_table.graha_table.update_date IS '최종수정일시';
COMMENT ON COLUMN graha_table.graha_table.update_id IS '최종수정자ID';
COMMENT ON COLUMN graha_table.graha_table.update_ip IS '최종수정자IP';

CREATE SEQUENCE graha_table."graha_column$graha_column_id";

create table graha_table.graha_column(
	graha_column_id integer NOT NULL DEFAULT nextval('graha_table.graha_column$graha_column_id'::regclass),
	column_comments character varying,
	column_name character varying,
	data_type character varying,
	length integer,
	is_primary_key boolean,
	is_sequence boolean,
	contents text,
	graha_table_id integer,
	insert_date timestamp with time zone,
	insert_id character varying(50),
	insert_ip character varying(15),
	update_date timestamp with time zone,
	update_id character varying(50),
	update_ip character varying(15),
	CONSTRAINT graha_column_pkey PRIMARY KEY (graha_column_id)
) WITH ( OIDS=FALSE );

comment on table graha_table.graha_column is '컬럼';

COMMENT ON COLUMN graha_table.graha_column.graha_column_id IS '고유번호';
COMMENT ON COLUMN graha_table.graha_column.column_comments IS '속성명';
COMMENT ON COLUMN graha_table.graha_column.column_name IS '속성ID';
COMMENT ON COLUMN graha_table.graha_column.data_type IS '자료형';
COMMENT ON COLUMN graha_table.graha_column.length IS '길이';
COMMENT ON COLUMN graha_table.graha_column.is_primary_key IS 'Key';
COMMENT ON COLUMN graha_table.graha_column.is_sequence IS 'SEQ';
COMMENT ON COLUMN graha_table.graha_column.contents IS '비고';
COMMENT ON COLUMN graha_table.graha_column.graha_table_id IS '테이블 고유번호';
COMMENT ON COLUMN graha_table.graha_column.insert_date IS '작성일시';
COMMENT ON COLUMN graha_table.graha_column.insert_id IS '작성자ID';
COMMENT ON COLUMN graha_table.graha_column.insert_ip IS '작성자IP';
COMMENT ON COLUMN graha_table.graha_column.update_date IS '최종수정일시';
COMMENT ON COLUMN graha_table.graha_column.update_id IS '최종수정자ID';
COMMENT ON COLUMN graha_table.graha_column.update_ip IS '최종수정자IP';
