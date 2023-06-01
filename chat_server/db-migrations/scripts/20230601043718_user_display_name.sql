-- // user display name
-- Migration SQL that makes the change goes here.

alter table chat_user add column display_name varchar(32) not null default '' comment 'user display name';

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_user drop column display_name;
