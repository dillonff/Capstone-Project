-- // drop channel member channel_id index
-- Migration SQL that makes the change goes here.

alter table chat_channel_member drop index idx_channel_id;

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_channel_member add index idx_channel_id (channel_id);
