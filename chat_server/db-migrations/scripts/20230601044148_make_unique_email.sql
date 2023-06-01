-- // make unique email
-- Migration SQL that makes the change goes here.

update
    chat_user cu join chat_user cu2 on (cu.email = '' or cu.email = cu2.email) and cu.id <> cu2.id
set
    cu.email = concat('user-id-', cu.id, '@auto-generated.email.chat.app');

alter table chat_user add unique index uk_email (email);

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_user drop index uk_email;
