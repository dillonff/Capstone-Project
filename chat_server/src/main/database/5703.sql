DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS file;
DROP TABLE IF EXISTS channel;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS workspace;




CREATE TABLE users
(user_id BIGINT UNSIGNED PRIMARY KEY,
user_name VARCHAR(20) NOT NULL,
gmt_create  DATETIME
);

CREATE TABLE channel 
(channel_id BIGINT UNSIGNED PRIMARY KEY,
channel_name VARCHAR(20) NOT NULL,
gmt_create  DATETIME,
members VARCHAR(20)
);





CREATE TABLE message 
(message_id BIGINT UNSIGNED PRIMARY KEY,
sender_id BIGINT UNSIGNED,
channel_id BIGINT UNSIGNED,
gmt_create  DATETIME,
content VARCHAR(500) NOT NULL
);


CREATE TABLE file 
(file_id BIGINT UNSIGNED PRIMARY KEY,
group_id BIGINT UNSIGNED,
sender_id BIGINT UNSIGNED,
receiver_id BIGINT UNSIGNED,
file_type VARCHAR(20) NOT NULL,
send_time VARCHAR(20) NOT NULL,
file_content VARCHAR(200) NOT NULL,
gmt_create  DATETIME,
CONSTRAINT checktype CHECK('filetype'='image' OR 'filetype'='file')
);

CREATE TABLE workspace
(workspace_id BIGINT UNSIGNED PRIMARY KEY,
workspace_name VARCHAR(20) NOT NULL,
gmt_created DATETIME
)
