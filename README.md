# COMP5703-CS30-2

### How to run this
* Use Intellij IDEA to open chat_server and load maven changes, then it can be started
* make sure you have nodejs and npm installed
* cd to chat_webclient and run `npm install`
* run `npm start` to start the frontend

### Database
* mysql database is required for this application
* the username and password are comp5703 and comp5703, which has been written into configuration files
* comp5703 user must be created in the database, either use the db management tool to create the user or use the following sql:
* `create user 'comp5703'@'%' identified by 'comp5703'`
* `grant all privileges on *.* to 'comp5703'@'%'`
* when you can access the database using that username and password, you need to create the capstone schema, use db management tool or this sql:
* `create database capstone`
* the project is integrated with mybatis migration. To create the desired database table, see the following instruction

### Mybatis migration
* Youtube video of the general concept: [https://www.youtube.com/watch?v=c45AevIuYGk](https://www.youtube.com/watch?v=c45AevIuYGk)
* For more details, check [https://mybatis.org/migrations](https://mybatis.org/migrations)
* in most cases what you need to know is how to run the `migrate up` command.
* mybatis migration keeps track of a list of sql files that have been applied to the database, which is useful for managing database changes.
* a script under called `migrate.cmd` or `migrate` is created under chat_server, which manages the migration.
* for Windows user, use cmd or powershell to cd to chat_server, then run `.\migrate.cmd` to execute the command
* for Mac user, use terminal to cd to chat_server directory, then run `./migrate` to execute the command.
* the following instruction will use `migrate` as the command, replace it with `.\migrate.cmd` or `./migrate` according to your OS.
* `migrate up` will apply all the unapplied sql files. Each time there is a database change, this command should be run.
* `migrate new "some description..."` will create a new migration file under db-migrations/scripts. Modify that file for any database changes such as create tables or alter tables.
* then let everyone know there is a new change, so that everyone can run `migrate up` to apply the changes.
* `migrate status` shows the migration status of what sql files has been applied.
* `migrate down` will revert a single change. Note that the undo section must be written properly to revert successfully.
