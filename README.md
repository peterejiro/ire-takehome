# ire-takehome

# Running the app

The app assumes the following database credentials
database name = irecharge
database user = root
database password = root
database port 3306


To run the app,

run npm install,

npx sequelize-cli db:migrate

npm test (to run tests)

npm start (to run application)


The app serves on port 8000


any changes to database credentials should be done on the .env and /src/config/config.json file


