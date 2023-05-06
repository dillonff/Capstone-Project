-- // create file table
-- Migration SQL that makes the change goes here.

-- table to store file information

create table chat_file (
                           id bigint unsigned not null auto_increment comment 'file id',
                           filename varchar(128) not null comment 'filename',
                           path varchar(128) not null comment 'file storage path',
                           size bigint unsigned not null comment 'file size',
                           uploader_id bigint unsigned not null comment 'uploader id referring to chat_user',
                           status tinyint unsigned not null comment 'file status: 0 - uploading, 1 - uploaded',
                           is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                           gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                           gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                           primary key (id),
                           index idx_uploader_id (uploader_id),
                           index idx_gmt_create (gmt_create)
) default charset=utf8mb4 comment 'file information';

-- //@UNDO
-- SQL to undo the change goes here.

drop table chat_file;

