# ALT project for data share

Steps to run this project:

1. Run `npm i` command
2. Create a `.env` in the root projet folder
3. Setup database settings and PORT variable inside `.env` file
    to use the docker-compose.yml, add on .env : 
```
    # Port d'execution
    PORT = 3000
    # db Infos
    HOST_db = localhost
    PORT_db = 3306
    NAME_db = typeorm_db
    USER_db = user
    PASSWORD_db = password
```
4. inside the root projet folder run : `docker-compose up`
5. Run `npm run dev` command

