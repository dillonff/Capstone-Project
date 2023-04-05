DROP TABLE IF EXISTS firendship;
DROP TABLE IF EXISTS chatlog;
DROP TABLE IF EXISTS file;
DROP TABLE IF EXISTS usergroup;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;




CREATE TABLE role
(role_id BIGINT UNSIGNED PRIMARY KEY,
role_name VARCHAR(20) NOT NULL
);



CREATE TABLE users
(user_id BIGINT UNSIGNED PRIMARY KEY,
user_name VARCHAR(20) NOT NULL,
gmt_create  DATETIME
);

CREATE TABLE usergroup 
(group_id BIGINT UNSIGNED PRIMARY KEY,
group_name VARCHAR(20) NOT NULL,
gmt_create  DATETIME,
members VARCHAR(20)
);

CREATE TABLE firendship 
(user_id BIGINT UNSIGNED,
friend_id BIGINT UNSIGNED,
group_id BIGINT UNSIGNED,
CONSTRAINT fk_user_1 FOREIGN KEY (user_id) REFERENCES users(user_id),
CONSTRAINT fk_user_2 FOREIGN KEY (friend_id) REFERENCES users(user_id),
CONSTRAINT fk_group_1 FOREIGN KEY (group_id) REFERENCES usergroup(group_id)
);





CREATE TABLE chatlog 
(message_id BIGINT UNSIGNED PRIMARY KEY,
sender_id BIGINT UNSIGNED,
group_id BIGINT UNSIGNED,
gmt_create  DATETIME,
content VARCHAR(500) NOT NULL,
CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(user_id),
CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES usergroup(group_id)
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
CONSTRAINT fk_sender_1 FOREIGN KEY (sender_id) REFERENCES users(user_id),
CONSTRAINT fk_receiver_1 FOREIGN KEY (receiver_id) REFERENCES users(user_id),
CONSTRAINT fk_group_2 FOREIGN KEY (group_id) REFERENCES usergroup(group_id),
CONSTRAINT checktype CHECK('filetype'='image' OR 'filetype'='file')
)
