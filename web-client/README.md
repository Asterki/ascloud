## Environment Variables
The following variables must be stored in a file named `.env.local`, these variables are prone to change
| Variable             | Description                                             | Required | Default              |
|----------------------|---------------------------------------------------------|----------|----------------------|
|NEXT_PUBLIC_FILE_SERVER_HOST| The URL of the running file server                | true     |  No default          |


<br>

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