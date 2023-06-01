-- // set default display_name
-- Migration SQL that makes the change goes here.

update chat_user set display_name = username where display_name = '';

-- //@UNDO
-- SQL to undo the change goes here.


