## Running on development mode

On a terminal, run the following command
```bash
$ npm run dev
``` 

Then you can access the site at the specified port

<br>

## Running on production mode

On a console, run the following command:
```bash
$ npm run start
``` 

This will automatically build and run the server on production mode


## Building the Docker image

For this, you first have to copy the [shared](../shared/) folder into this folder, the on a console, run the following command:
```bash
$ docker compose up --build
``` 