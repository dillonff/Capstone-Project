-- // workspace_member index on type and member id
-- Migration SQL that makes the change goes here.

-- remove duplicate columns
delete t1
from
    chat_workspace_member t1,
    chat_workspace_member t2
where
    t1.id < t2.id
    and t1.type = t2.type
    and t1.member_id = t2.member_id
    and t1.workspace_id = t2.workspace_id;

alter table chat_workspace_member add unique index idx_type_member_workspace_id (type, member_id, workspace_id);

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_workspace_member drop index idx_type_member_workspace_id;
