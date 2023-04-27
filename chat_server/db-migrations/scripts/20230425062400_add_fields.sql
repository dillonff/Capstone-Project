-- // add fields
-- Migration SQL that makes the change goes here.
alter table chat_user add column phone varchar(20) not null default '' comment 'user phone number';
alter table chat_user add column email varchar(20) not null default '' comment 'user email';


-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_user drop column phone;
alter table chat_user drop column email;
