# Url shortener

 URL shortening application built for URL shortening and tracking analytics on shortened URLs. It utilizes the Express framework for handling HTTP requests, Mongoose for MongoDB interactions, and various other
 libraries for additional functionality.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/nolan-projects/modular-services.git
    ```

2. **Install dependencies:**

    ```bash
    pnpm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the necessary environment variables. You can use the provided `.env.example` file as a template.

5. **Start the application:**

    ```bash
    pnpm dev
    ```

    The application should now be running locally on [http://localhost:8000](http://localhost:8000).

## Usage

The application provides URL shortening functionality and allows tracking analytics on the shortened URLs. It includes the following features:

- **URL Shortening:** Create short URLs for long original URLs.
- **URL Expiration:** Set expiration dates for URLs.
- **URL Analytics:** View analytics data for shortened URLs, including total visitors and unique visitors.
- **URL Deletion:** Delete a shortened URL.

## Folder Structure

The project has the following folder structure:

- `src`: Contains the source code of the application.
  - `controllers`: Handles the application's business logic.
  - `middlewares`: Contains middleware functions used in the application.
  - `models`: Defines Mongoose models for MongoDB.
  - `routes`: Defines routes for the Express application.
  - `services`: Contains various services used in the application.
- `dist`: Contains the compiled TypeScript files (generated when building the project).

## Configuration

Configuration is managed through environment variables. Ensure that the required environment variables are set in the `.env` file.

**Example `.env` file:**

```dotenv
NODE_ENV=development
PORT=8000
MONGODB_URI=your_mongo_uri
COOKIE_DOMAIN=localhost
SESSION_SECRET=u1ai!@89A
# name of the cookie that will be used for authentication
AUTH_COOKIE_NAME=my-app-auth-cookie-name
# comma separated list of origins
CORS_ORIGINS=http://localhost:8000
OPENAI_API_KEY=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
TWILIO_ACCOUNT_SID=ACb90a62a2cf5ba4eae89ac903feb61674
TWILIO_AUTH_TOKEN=2cff438ffb515f2c40419c403d5edfb8
TWILIO_MOBILE=+16122840913
SHORT_URL_DOMAIN=http://localhost:8000
```

## API Endpoints
1. Shorten URL
POST /short: Create a short URL.

Request Body:
```
{
  "original_url": "https://example.com",
  "expiration_date": "2023-12-31",
  "title": "Example Title",
  "description": "Example Description"
}
```
Response:
```
{
  "short_url": "http://localhost:3000/abc123",
  "short_id": "abc123"
}
```
2. Get Short URLs by App ID
   GET /appid: Get all URLs created by App ID.

3. Delete Short URL
DELETE /delete/:shortId: Delete a short URL by short ID.

4. Update Short URL
PUT /update/:shortId: Update a short URL by short ID.

Request Body (fields to update):
```
{
  "expiration_date": "2023-12-31",
  "title": "Updated Title",
  "description": "Updated Description"
}
```
Response:
```
{
  "expiration_date": "2023-12-31",
  "title": "Updated Title",
  "description": "Updated Description"
}
```
5. Redirect to Original URL
GET /:shortId: Redirect to the original URL.

6. Get URL Analytics
GET /log/:short_id: Get analytics data for a shortened URL.

Response:
```
{
  "url_details": {
    "original_url": "https://example.com",
    "short_id": "abc123",
    "expiration_date": "2023-12-31",
    "starting_date": "2023-01-01T00:00:00.000Z",
    "title": "Example Title",
    "description": "Example Description",
    "status": "active",
    "short_url": "http://localhost:8000/abc123",
    "stats": {
      "total_visitors": 10,
      "unique_visitors": 5
    }
  }
}
```

7. Get All Visitors
GET /log/visitors/:short_id: Get information on all visitors for a shortened URL.

Query Parameters:

page: Page number for pagination (default is 1).
Response:
```
[
  {
    "url_id": "abc123",
    "ip_address": "127.0.0.1",
    "visit_time": "2023-01-01T12:00:00.000Z",
    "referrer": "https://referrer.com"
  },
  // ...
]
```
## Testing
Run tests using:
```
pnpm test
```
