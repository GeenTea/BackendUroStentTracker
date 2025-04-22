
```markdown
# Backend UroStentTracker

The **Backend UroStentTracker** is a Node.js and Express.js-based server application designed to manage patient data for stent tracking.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Backend UroStentTracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the server in development mode, run:
```bash
npm start
```

The server will run on `http://localhost:3000`.

## API Endpoints

### 1. `GET /`
Returns a message to verify the server is running.

**Example Response:**
```json
"From backend"
```

### 2. `POST /login`
Authenticates a user.

**Request Body:**
```json
{
  "username": "example",
  "password": "password123"
}
```

**Example Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": { ... }
}
```

### 3. `POST /main-menu`
Checks if the user is logged in.

**Example Response:**
- If logged in:
  ```json
  {
    "status": "success",
    "message": "User is logged in",
    "user": { ... }
  }
  ```
- If not logged in:
  ```json
  {
    "status": "error",
    "message": "User is not logged in"
  }
  ```

### 4. `POST /logout`
Logs the user out.

**Example Response:**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

### 5. `POST /add-patient`
Adds a new patient.

**Request Body:**
```json
{
  "number": "12345",
  "fname": "John",
  "lname": "Doe",
  "consultant_name": "Dr. Smith",
  "stent_insertion_date": "2023-01-01",
  "scheduled_removal_date": "2023-06-01"
}
```

**Example Response:**
```json
{
  "status": "success",
  "message": "Patient added successfully"
}
```

### 6. `GET /patient`
Retrieves a list of all patients.

**Example Response:**
```json
[
  {
    "patient_id": 1,
    "hospital_number": "12345",
    "fname": "John",
    "lname": "Doe",
    "consultant_name": "Dr. Smith",
    "stent_insertion_date": "2023-01-01",
    "scheduled_removal_date": "2023-06-01"
  }
]
```

### 7. `POST /edit-patient/:patient_id`
Edits a patient's details.

**Request Body:**
```json
{
  "hospital_number": "12345",
  "fname": "John",
  "lname": "Doe",
  "consultant_name": "Dr. Smith",
  "stent_insertion_date": "2023-01-01",
  "scheduled_removal_date": "2023-06-01"
}
```

**Example Response:**
```json
{
  "status": "success",
  "message": "Patient updated successfully"
}
```

### 8. `DELETE /delete-patient/:patient_id`
Deletes a patient by their ID.

**Example Response:**
```json
{
  "status": "success",
  "message": "Patient deleted successfully"
}
```

## Database Configuration

The application uses MySQL. Ensure you have a database named `urostenttracker` with the following tables:

- `users`
- `patient`

## Dependencies

- `express`
- `mysql2`
- `cors`
- `express-session`
- `nodemon`
- and others (see [package.json](package.json)).

## License

This project is licensed under the ISC License.
```

Add this content to your readme.md file.