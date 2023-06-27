# AsCloud

Open source cloud storage service based on a service infrastructure

## Current Features

- File upload
- File download
- File encryption
- Local server support, so you can add it to your home network
- Ability to access your files directly on the app

## Planned Features

- Customizable storage limit
- Email push notifications to ensure you're aware of the activity on your account

## Table of Contents

- [AsCloud](#ascloud)
  - [Current Features](#current-features)
  - [Planned Features](#planned-features)
  - [Table of Contents](#table-of-contents)
- [Setup](#setup)
  - [Requirements](#requirements)
  - [Setting up the configuration](#setting-up-the-configuration)
  - [Running the code](#running-the-code)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Extra information](#extra-information)
  - [Browsers tested in](#browsers-tested-in)
  - [Operative systems tested in](#operative-systems-tested-in)
- [License](#license)

<br>
<br>

# Setup

Ensure that you have the requirements, installed dependencies, and have set the environment variables before you run the code

## Requirements

- Node >v18.13.0
- MongoDB >4.4
- Linux, macOS or WSL (Recommended)
- NPM >8.19.3

## Setting up the configuration

Go to the [shared](/shared/) folder, rename the [config.example.ts](/shared/config.example.ts) to `config.ts`, open the file in a text editor and edit the file to accommodate to your environment

## Running the code

Each folder has their build and run instructions

- [web-client](/web-client/README.md)
- [file-server](/file-server/README.md)

<br>
<br>

# Technologies Used
If you want to edit the code, you may want to be familiar with the following programming languages and libraries

## Frontend
- TSX
- Next.js
- Redux
- SCSS

<br>

## Backend
- TypeScript
- Node.js
- Express.js
- Mongoose
- Passport.js

<br>
<br>

# Extra information


## Browsers tested in

![Brave](https://img.shields.io/badge/Brave-FB542B?style=for-the-badge&logo=Brave&logoColor=white) ![Edge](https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=Microsoft-edge&logoColor=white) ![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white) ![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white) ![Opera](https://img.shields.io/badge/Opera-FF1B2D?style=for-the-badge&logo=Opera&logoColor=white)

<br>

## Operative systems tested in

![Debian](https://img.shields.io/badge/Debian-D70A53?style=for-the-badge&logo=debian&logoColor=white) ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white) ![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white) ![Kali](https://img.shields.io/badge/Kali-268BEE?style=for-the-badge&logo=kalilinux&logoColor=white)

<br>
<br>

# License

Copyright 2023 Fernando Rivera

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
