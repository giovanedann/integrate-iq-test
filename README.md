# Integrate IQ Engineer Test - Giovane

## Overview

This is a backend project designed to register data on a HubSpot account using an AWS mock API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Considerations](#considerations)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js on version 20.9.0 installed on your local machine.
- A private application API key to put in the environment file.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/giovane/integrate-iq-test.git
   ```

   or

   ```bash
   git clone git@github.com:giovanedann/integrate-iq-test.git
   ```

2. Navigate to the project directory:

   ```bash
   cd integrate-iq-test
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

Configure the project by creating a `.env` file in the project root and providing the following information:

```env
PORT=desired_port
AWS_BEARER_TOKEN=bearer_token_provided_on_test_pdf
AWS_API_URL=api_url_provided_on_test_pdf
HUBSPOT_ACCESS_TOKEN=your_private_application_api_key
```

## Usage

To run the project, use the following command:

```bash
npm run dev
```

This will start the backend server, and you can access the API at `http://localhost:PORT`.

### Important: the PORT is replaced by the env file PORT variable!

## Running the script
To run the script and create the users on your hubspot application, you will need to make a GET request to the following endpoint:

http://localhost:ENV_PORT/contacts/create-many

For that, you can use a REST client like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/download), or you can simply access [the following link](http://localhost:3001/contacts/create-many), after the server is started.

## Considerations
Controllers, services, and extra layers were not used in this project due to the context of the application (only 1 endpoint).
I kept it simple, with all centered on the index file, to avoid middlemans and stuff like that on the application.