-- // add token field
-- Migration SQL that makes the change goes here.
-- add token for API authentication
alter table chat_user add column token varchar(128) not null default '' comment 'user authentication token';

-- //@UNDO
-- SQL to undo the change goes here.
alter table chat_user drop column token;

