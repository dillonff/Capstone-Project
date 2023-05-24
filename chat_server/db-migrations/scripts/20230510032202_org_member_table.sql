-- // org member table
-- Migration SQL that makes the change goes here.

create table chat_organization_member (
                                          id bigint unsigned not null auto_increment comment 'entry id',
                                          user_id bigint unsigned not null comment 'member user id referring to chat_user',
                                          organization_id bigint unsigned not null comment 'org id referring to chat_organization',
                                          display_name varchar(32) not null default '' comment 'display name of this org member',
                                          is_auto_join_channel tinyint(1) unsigned not null default 0 comment 'if the user should auto joins the channel when the org joins a channel',
                                          is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                          gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                          gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                          primary key (id),
                                          unique index uk_user_id_organization_id (user_id, organization_id),
                                          index idx_organization_id (organization_id)
) default charset=utf8mb4 comment 'organization info';

-- //@UNDO
-- SQL to undo the change goes here.

drop table chat_organization_member;
