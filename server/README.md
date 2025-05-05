# RubyAMS Backend API

This is the backend API for the Ruby Academic Management System. It provides endpoints for managing courses, students, bidding, and voting.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=8080
   DATABASE_URL=postgresql://username:password@localhost:5432/rubyams
   CORS_ORIGIN=http://localhost:3000
   ```

3. Run the server:
   ```
   npm start
   ```

## API Documentation

### Courses API

- **GET /api/courses/:id** - Get a course by ID
- **GET /api/courses/semester/:semester** - Get all courses for a semester
- **GET /api/courses/name/:name** - Get courses by name
- **GET /api/courses/student/:studentId** - Get courses registered by a student
- **GET /api/courses/student/:studentId/incoming** - Get incoming courses for a student
- **POST /api/courses** - Create a new course
- **POST /api/courses/semester/:semester/start** - Start courses for a semester

### Students API

- **GET /api/students** - Get all students (paginated)
- **GET /api/students/:id** - Get a student by ID
- **GET /api/students/nft-address/:nftAddress** - Get a student by NFT address
- **GET /api/students/search/nft-address/:nftAddress** - Search students by partial NFT address
- **GET /api/students/student-number/:studentNumber** - Get a student by student number
- **GET /api/students/:id/courses** - Get courses registered by a student
- **POST /api/students** - Create a new student
- **PUT /api/students/:id** - Update a student
- **DELETE /api/students/:id** - Delete a student

### Bids API

- **GET /api/bids/:bidder** - Get bids by bidder
- **GET /api/bids/:txHash** - Get a bid by transaction hash
- **POST /api/bids** - Place a new bid

### Votes API

- **GET /api/votes/voter/:voter** - Get votes by voter
- **GET /api/votes/txHash/:txHash** - Get a vote by transaction hash
- **POST /api/votes/votes** - Cast a new vote