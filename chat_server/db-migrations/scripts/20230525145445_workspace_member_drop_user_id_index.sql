-- // workspace member drop user id index
-- Migration SQL that makes the change goes here.

alter table chat_workspace_member drop index idx_user_id;

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_workspace_member add index idx_user_id (user_id);
