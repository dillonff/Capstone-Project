-- // channel org table
-- Migration SQL that makes the change goes here.

create table chat_channel_organization (
                                           id bigint unsigned not null auto_increment comment 'entry id',
                                           channel_id bigint unsigned not null comment 'channel id',
                                           organization_id bigint unsigned not null comment 'organization id',
                                           is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                           gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                           gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                           primary key (id),
                                           unique index uk_channel_organization_id (channel_id, organization_id),
                                           index idx_organization_id (organization_id)
) default charset=utf8mb4 comment 'stores organizations in a specific channel';


-- //@UNDO
-- SQL to undo the change goes here.

drop table chat_channel_organization;
