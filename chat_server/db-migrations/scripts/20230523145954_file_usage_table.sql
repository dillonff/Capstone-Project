-- // file usage table
-- Migration SQL that makes the change goes here.

create table chat_file_usage (
                                 id bigint unsigned not null auto_increment comment 'entry id',
                                 usage_type tinyint unsigned not null comment 'file usage type: 1-message, 2-channel, 3-workspace',
                                 usage_id bigint unsigned not null comment 'usage id based on usage type',
                                 file_id bigint unsigned not null comment 'file id referring to chat_file',
                                 is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                 gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                 gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                 primary key (id),
                                 unique index uk_usage_type_usage_id_file_id (usage_type, usage_id, file_id),
                                 index idx_file_id (file_id)
) default charset=utf8mb4 comment 'file usage information';

-- //@UNDO
-- SQL to undo the change goes here.

drop table chat_file_usage;
