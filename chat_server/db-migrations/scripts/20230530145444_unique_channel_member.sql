-- // unique channel member
-- Migration SQL that makes the change goes here.

delete t1
from
    chat_channel_member t1,
    chat_channel_member t2
where
    t1.id < t2.id
    and t1.channel_id = t2.channel_id
    and t1.user_id = t2.user_id
;


alter table chat_channel_member add unique index uk_channel_user_id (channel_id, user_id);

-- //@UNDO
-- SQL to undo the change goes here.

alter table chat_channel_member drop index uk_channel_user_id;
