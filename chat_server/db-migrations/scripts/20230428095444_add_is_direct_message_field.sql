-- // add is_direct_message field
-- Migration SQL that makes the change goes here.

-- add direct message flag
alter table chat_channel add column is_direct_message tinyint(1) unsigned not null default 0 comment '1 - this channel is for direct message, 0 - otherwise';


-- //@UNDO
-- SQL to undo the change goes here.
alter table chat_channel drop column is_direct_message;

