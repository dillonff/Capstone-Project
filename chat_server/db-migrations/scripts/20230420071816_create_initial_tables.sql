-- // First migration.
-- Migration SQL that makes the change goes here.

-- Please note:
-- 1. gmt_modified relies the current_timestamp() to automatically update, which requires setting mysql
--    connection timezone or server timezone to GMT so that it returns the correct time in GMT.
-- 2. id, is_deleted, gmt_create, gmt_modified have default values, do not set those values when inserting a row


create table chat_user (
                           id bigint unsigned not null auto_increment comment 'user id',
                           username varchar(32) not null comment 'user name',
                           password varchar(128) not null comment 'encrypted password',
                           is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                           gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                           gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                           primary key (id),
                           unique index uk_username (username(32))
) default charset=utf8mb4 comment 'user information';

create table chat_channel (
                              id bigint unsigned not null auto_increment comment 'channel id',
                              name varchar(32) not null comment 'channel name',
                              workspace_id bigint unsigned not null comment 'belonging workspace referring to chat_workspace',
                              is_public tinyint(1) unsigned not null default 0 comment '0-private, 1-public',
                              is_pinned tinyint(1) unsigned not null default 0 comment '0-not pinned, 1-pinned',
                              is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                              gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                              gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                              primary key (id),
                              index idx_workspace_id (workspace_id)
) default charset=utf8mb4 comment 'channel information';

create table chat_channel_member (
                                     id bigint unsigned not null auto_increment comment 'entry id',
                                     channel_id bigint unsigned not null comment 'channel id referring to chat_channel',
                                     user_id bigint unsigned not null comment 'user id referring to chat_user',
                                     last_read_message_id bigint unsigned not null comment 'the newest message id that was read by the user',
                                     is_mentioned tinyint(1) unsigned not null default 0 comment '0-not mentioned, 1-mentioned',
                                     is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                     gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                     gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                     primary key (id),
                                     index idx_channel_id (channel_id),
                                     index idx_user_id (user_id)
) default charset=utf8mb4 comment 'channel members';

create table chat_message (
                              id bigint unsigned not null auto_increment comment 'message id',
                              content varchar(4096) not null comment 'message text content',
                              channel_id bigint unsigned not null comment 'belonging channel id',
                              sender_id bigint unsigned not null comment 'sender id referring to chat_user',
                              is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                              gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                              gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                              primary key (id),
                              index idx_channel_id (channel_id),
                              index idx_sender_id (sender_id)
) default charset=utf8mb4 comment 'chat message information';

create table chat_workspace (
                                id bigint unsigned not null auto_increment comment 'workspace id',
                                name varchar(32) not null comment 'workspace name',
                                is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                primary key (id)
) default charset=utf8mb4 comment 'workspace information';

create table chat_workspace_member (
                                       id bigint unsigned not null auto_increment comment 'entry id',
                                       workspace_id bigint unsigned not null comment 'workspace id referring to chat_workspace',
                                       user_id bigint unsigned not null comment 'workspace member id referring to chat_user',
                                       is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                       gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                       gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                       primary key (id),
                                       index idx_workspace_id (workspace_id),
                                       index idx_user_id (user_id)
) default charset=utf8mb4 comment 'workspace members';


-- //@UNDO
-- SQL to undo the change goes here.

drop table chat_user;
drop table chat_channel;
drop table chat_channel_member;
drop table chat_message;
drop table chat_workspace;
drop table chat_workspace_member;

