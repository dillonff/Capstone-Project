-- // workspace_member rename user_id for org
-- Migration SQL that makes the change goes here.


alter table chat_workspace_member rename column user_id to member_id;

-- //@UNDO
-- SQL to undo the change goes here.

delete from chat_workspace_member where type <> 0;
alter table chat_workspace_member rename column member_id to user_id;

