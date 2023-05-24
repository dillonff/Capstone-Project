-- // add is_pinned field to chat_channel_member
-- Migration SQL that makes the change goes here.

alter table chat_channel_member add column is_pinned tinyint(1) unsigned not null default 0 comment '0 - channel not pinned, 1 - channel pinned';

-- //@UNDO
-- SQL to undo the change goes here.
alter table chat_channel_member drop column is_pinned;

