# URL Shortener

A fast, simple, and reliable URL shortening service built with TypeScript, Angular, and Spring Boot Java. Live at [usho.pro](https://usho.pro)

## Features

- **Quick URL Shortening**: Convert long URLs into short, memorable codes
- **Configurable Expiration**: Choose expiration periods from 1 to 90 days
- **One-Click Copy**: Easily copy shortened URLs with a single click
- **Fast Redirection**: Efficient URL validation and redirection system
- **Smart Caching**: Recent and Most used URLs are cached in memory for faster access
- **Automatic Cleanup**: Expired URLs are automatically removed from the system

## Tech Stack

### Frontend (42.6% TypeScript, 1.9% JavaScript)
- Angular
- TypeScript
- Angular Material CDK
- Reactive Forms

### Backend (40.6% Java)
- Spring Boot
- Spring Data JPA
- Lombok
- Apache Commons URL Validator
- PostgreSQL Database

### Styling (11.3% CSS, 1.8% HTML)
- Custom CSS
- Responsive Design

### Infrastructure (1.8% Dockerfile)
- Docker support for containerization
- Environment-based configuration

## How It Works

1. **URL Submission**
    - Users input a URL and select an expiration period
    - Frontend validates the URL format
    - Request is sent to the backend API

2. **URL Processing**
    - Backend validates the URL
    - Generates a unique code (3-8 characters)
    - Stores URL data with expiration date
    - Returns shortened URL to user

3. **URL Redirection**
    - When accessing a shortened URL, the system:
        - Validates the code
        - Checks expiration
        - Redirects to original URL if valid
        - Shows error message if invalid/expired

4. **Performance Optimization**
    - Recently accessed URLs are cached in memory
    - Most used URLs are cached in memory
    - Automatic cleanup of expired URLs
    - Efficient code generation algorithm

## API Endpoints

### POST `/api/url/shorten`
Create a new shortened URL
```json
{
  "url": "https://example.com",
  "expires": "2025-03-20"
}
```

### GET `/api/url/validate/{code}`
Validate and retrieve URL information for redirection

## Local Development

1. **Prerequisites**
    - Node.js and npm
    - Java JDK 17 or higher
    - Maven

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ng serve
   ```

3. **Backend Setup**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

## Production Deployment

The application can be containerized using the included Dockerfile. The live version is hosted at [usho.pro](https://usho.pro).

## Features Highlights

- Minimum code length: 3 characters
- Maximum code length: 8 characters
- Support for up to 10,000 cached URLs in memory
- Automatic case normalization for codes
- Cross-origin support for API endpoints
- Responsive web design

## License

This project is the intellectual property of Tyler Wade. All rights reserved.

---
Created and maintained by [Tyler Wade](https://tylerwade.net)