-- // fix incorrect comment of file usage_type
-- Migration SQL that makes the change goes here.

-- this fixed the incorrect comment in 20230523145954_file_usage_table.sql

alter table chat_file_usage modify column usage_type tinyint unsigned not null comment 'file usage type: 1-workspace, 2-channel, 3-message';

-- //@UNDO
-- SQL to undo the change goes here.

-- no undo
