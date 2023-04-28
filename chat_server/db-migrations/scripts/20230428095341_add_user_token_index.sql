-- // add user token index
-- Migration SQL that makes the change goes here.

create index idx_token on chat_user (token(16));

-- //@UNDO
-- SQL to undo the change goes here.
alter table chat_user drop index idx_token;

