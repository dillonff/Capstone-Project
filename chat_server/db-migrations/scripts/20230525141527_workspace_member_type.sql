-- // workspace member type to support org
-- Migration SQL that makes the change goes here.

alter table chat_workspace_member add column type tinyint unsigned not null default 0 comment 'member type: 0-user, 1-org, maybe more in the future';

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_workspace_member drop column type;
