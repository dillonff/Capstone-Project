-- // channel auto join flag
-- Migration SQL that makes the change goes here.

alter table chat_channel add column is_auto_join tinyint(1) not null default 0 comment 'decide if new workspace member should join this channel';

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_channel drop column is_auto_join;
