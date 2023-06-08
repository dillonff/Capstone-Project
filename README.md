# COMP5703-CS30-2

### How to run this project
0. Some videos
    * Youtube video of a quick walkthrough of these steps: [https://youtu.be/HKJ02G7cnmA](https://youtu.be/HKJ02G7cnmA)
    * Youtube video of project demo: [https://youtu.be/nrmIGLGXWmo](https://youtu.be/nrmIGLGXWmo)
1. Install the following software (higher version may work):
    * Java 17
    * Git
    * Mysql 8.0.30
    * Node.js 18.15.0 with npm
    * Maven 3.9.2 (not necessary if you use Intellij IDEA or run the nvmw command under chat_server which automatically installs maven)
2. Clone or download this repository.
3. Configurate Mysql properly, see the Database section below. Basically you need to create an appropriate database user, database scheme, and tables.
    * After setting up the database you need to run the database migration command. This will create desired tables. See 'Mybatis migration' section for details.
    * `cd chat_server`
    * `./migrate up`
4. Use Intellij IDEA to open `chat_server` directory and load maven changes to install dependencies, then it can be started.
    * If you want to run this project without Intellij, you can use this maven command:
    * `cd chat_server`
    * `./mvnw spring-boot:run`
5. Open a terminal, cd to `chat_webclient` directory and run `npm install`
6. run `npm start` to start the frontend

### Database
* mysql database is required for this application
* the username and password are comp5703 and comp5703, which has been written into configuration files. You should use a strong password in the production environment.
* comp5703 user must be created in the database, either use the db management tool to create the user or use the following sql:
* `create user 'comp5703'@'%' identified by 'comp5703';`
* `grant all privileges on *.* to 'comp5703'@'%';`
* when you can access the database using that username and password, you need to create the capstone schema, use db management tool or this sql:
* `create database capstone;`
* the project is integrated with mybatis migration. To create the desired database tables, see the following instruction in Mybatis migration section.

### Mybatis migration
* Youtube video of the general concept: [https://www.youtube.com/watch?v=c45AevIuYGk](https://www.youtube.com/watch?v=c45AevIuYGk)
* For more details, check [https://mybatis.org/migrations](https://mybatis.org/migrations)
* mybatis migration keeps track of a list of sql files that have been applied to the database, which is useful for managing database changes.
* files and directories:
    * `db-migrations`: base directory
    * `db-migrations/scripts`: conatains all sql migration scripts
    * `db-migrations/environments`: configuration files for such as db url and password
* In most cases what you need to know is how to run the `migrate up` command.
* a wrapper script under called `migrate.cmd` or `migrate` is created for Windows or *nix (such as Mac OS X or Linux) respectively under chat_server, which manages the migration.
* for Windows user, use cmd or powershell to cd to `chat_server` directory, then run `.\migrate.cmd` to execute the command
* for Mac user, use terminal to cd to chat_server directory, then run `./migrate` to execute the command.
* the following instruction will use `migrate` as the command, replace it with `.\migrate.cmd` or `./migrate` according to your OS.
* `migrate up` will apply all the unapplied sql files. Each time there is a database change, this command should be run.
* `migrate new "some description..."` will create a new migration file under `db-migrations/scripts`. Modify that file for any database changes such as create tables or alter tables.
* then let everyone know there is a new change, so that everyone can run `migrate up` to apply the changes.
* `migrate status` shows the migration status of what sql files has been applied.
* `migrate down` will revert a single change. Note that the undo section must be written properly to revert successfully.
* `migrate script id1 id2` generates the sql scripts that can migrate a schema from version id1 to id2

### Other docs
* `chat_server/api.md`
* `chat_server/protocol.md`
* `chat_server/db-migrations/README`
