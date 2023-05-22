-- // message org field
-- Migration SQL that makes the change goes here.

alter table chat_message add column organization_id bigint unsigned not null default 0 comment 'the message is sent on behalf of which org';

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_message drop column organization_id;
