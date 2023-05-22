-- // workspace org table
-- Migration SQL that makes the change goes here.

create table chat_workspace_organization (
                                           id bigint unsigned not null auto_increment comment 'entry id',
                                           workspace_id bigint unsigned not null comment 'workspace id',
                                           organization_id bigint unsigned not null comment 'organization id',
                                           is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                           gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                           gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                           primary key (id),
                                           unique index uk_workspace_organization_id (workspace_id, organization_id),
                                           index idx_organization_id (organization_id)
) default charset=utf8mb4 comment 'stores organizations in a specific workspace';

-- //@UNDO
-- SQL to undo the change goes here.

drop table chat_workspace_organization;
