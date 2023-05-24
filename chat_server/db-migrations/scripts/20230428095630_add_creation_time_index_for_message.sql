-- // add creation time index for message
-- Migration SQL that makes the change goes here.

-- index for the creation time as some queries need to filter by that
create index idx_gmt_create on chat_message (gmt_create);


-- //@UNDO
-- SQL to undo the change goes here.
alter table chat_message drop index idx_gmt_create;

