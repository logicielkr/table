CREATE SCHEMA graha_table;
ALTER TABLE graha_table SET SCHEMA graha_table;
ALTER TABLE graha_column SET SCHEMA graha_table;
alter SEQUENCE "graha_table$graha_table_id" SET SCHEMA graha_table;
alter SEQUENCE "graha_column$graha_column_id" SET SCHEMA graha_table;
alter table graha_table.graha_table alter column graha_table_id set default nextval('graha_table.graha_table$graha_table_id'::regclass);
alter table graha_table.graha_column alter column graha_column_id set default nextval('graha_table.graha_column$graha_column_id'::regclass);

