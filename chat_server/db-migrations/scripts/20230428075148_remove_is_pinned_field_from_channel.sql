-- // remove is_pinned field from channel
-- Migration SQL that makes the change goes here.

-- is_pinned is not useful, should be moved to chat_channel_member
alter table chat_channel drop column is_pinned;


-- //@UNDO
-- SQL to undo the change goes here.
alter table chat_channel add column is_pinned tinyint(1) unsigned not null default 0 comment '0-not pinned, 1-pinned';

