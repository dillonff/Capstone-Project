-- // create org table
-- Migration SQL that makes the change goes here.

create table chat_organization (
                                   id bigint unsigned not null auto_increment comment 'org id',
                                   name varchar(32) not null comment 'org simple name',
                                   full_name varchar(64) not null comment 'org full name',
                                   email varchar(255) not null comment 'org contact email',
                                   description varchar(1024) not null comment 'org description',
                                   is_deleted tinyint(1) unsigned not null default 0 comment '0-not deleted, 1-deleted',
                                   gmt_create datetime(3) not null default (utc_timestamp(3)) comment 'creation time',
                                   gmt_modified datetime(3) not null default (utc_timestamp(3)) on update current_timestamp(3) comment 'modification time',
                                   primary key (id),
                                   unique index uk_email (email)
) default charset=utf8mb4 comment 'organization info';


-- //@UNDO
-- SQL to undo the change goes here.

drop table chat_organization;
