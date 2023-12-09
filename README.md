Project Overview

Welcome to the Samixx Skilly Backend repository! This project serves as the backend for a service-oriented platform where users can offer and request services from one another. The system facilitates communication and transactions between service providers and users.

Key Features
- User Authentication: Users can sign up, log in, and authenticate their identity.
- Service Creation: Verified users can create services they are willing to offer.
- Service Requests: Users can request services from other verified users who have created services.
- Email Verification: Users must verify their email address to create services, enhancing trust and security.
- Transaction Confirmation: Service providers can mark a service as completed, and users are contacted for confirmation.

How to Use
1. Clone the Repository: `git clone [repository-url]`
2. Install Dependencies: `npm install`
3. Setup Environment Variables: Set up required environment variables, including `JWT_SECRET_KEY` for authentication.
5. Run the Server: `npm run dev`
6. Explore Endpoints: Utilize various endpoints for user authentication, service management, and transaction confirmation.

Note

This project assumes that users and service providers have communicated externally to complete service transactions. Additionally, email verification is crucial for users who wish to provide services.

Feel free to explore, contribute, and customize this backend to suit your needs!

THE API END-POINTS ARE BELOW

User Authentication
1. Register User
- Endpoint: `POST /register`
- Input:
  - `firstName`: User's first name.
  - `secondName`: User's second name.
  - `bio`: User's biography.
  - `email`: User's email address.
  - `password`: User's password.
  - `profilePicture`: User's profile picture.
  - `phoneNumber`: User's phone number.
- Output:
  - Success:
    - HTTP 201 Created
    - `{ message: "You've been registered successfully" }`
  - Failure:
    - HTTP 400 Bad Request (User with the same email already exists)
    - `{ message: "A user already exists with this email address" }`
    - HTTP 500 Internal Server Error (for unexpected errors)

2. Login User
- Endpoint: `POST /login`
- Input:
  - `email`: User's email address.
  - `password`: User's password.
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Login Successful", token: <jwt_token> }`
  - Failure:
    - HTTP 404 Not Found (User not found)
    - `{ message: "No User Exists With The Email" }`
    - HTTP 400 Bad Request (Invalid password)
    - `{ message: "You've Provided An Invalid Password" }`
    - HTTP 500 Internal Server Error (for unexpected errors)

3. Email Verification
- Endpoint: `POST /send-email-verify-code`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Password for email verification successfully sent to <email>" }`
  - Failure:
    - HTTP 500 Internal Server Error (for unexpected errors)

4. Verify User Email
- Endpoint: `PATCH /verify-user/:passCode`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Code verified successfully" }`
  - Failure:
    - HTTP 401 Unauthorized
    - `{ message: "Invalid or expired passCode" }`
    - HTTP 500 Internal Server Error (for unexpected errors)

5. Delete User Account
- Endpoint: `DELETE /`
- Input: (Requires authentication)
  - `password`: User's password.
- Output:
  - Success:
    - HTTP 204 No Content
    - `{ message: "You've successfully deleted the account" }`
  - Failure:
    - HTTP 401 Unauthorized
    - `{ message: "You've provided a wrong password!!" }`
    - HTTP 500 Internal Server Error (for unexpected errors)

Service Management
1. Create Service
- Endpoint: `POST /create-service`
- Input: (Requires authentication)
  - `serviceName`: Name of the service.
  - `serviceDescription`: Description of the service.
  - `serviceCost`: Cost of the service.
  - `serviceLocation`: Location of the service.
  - `serviceTag`: Tag associated with the service.
- Output:
  - Success:
    - HTTP 201 Created
    - `{ message: "Service created successfully", data: <newServiceData> }`
  - Failure:
    - HTTP 401 Unauthorized (User not verified)
    - `{ message: "You've not verified your email address so you cannot create a service" }`
    - HTTP 500 Internal Server Error (for unexpected errors)

2. Get All Services
- Endpoint: `GET /get-services`
- Output:
  - Success:
    - HTTP 200 OK
    - Array of service objects
  - Failure:
    - HTTP 500 Internal Server Error (for unexpected errors)

3. Get Service by ID
- Endpoint: `GET /getservice/:serviceid`
- Output:
  - Success:
    - HTTP 200 OK
    - Object containing service details
  - Failure:
    - HTTP 500 Internal Server Error (for unexpected errors)

4. Delete Service
- Endpoint: `DELETE /deleteservice/:serviceid/:userid`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Service deleted successfully." }`
  - Failure:
    - HTTP 403 Forbidden (User not allowed to delete the service)
    - `{ message: "Unauthorized: You are not allowed to delete this service." }`
    - HTTP 404 Not Found (Service not found)
    - `{ message: "Service not found." }`
    - HTTP 500 Internal Server Error (for unexpected errors)

Service Requests
1. Make Service Request
- Endpoint: `POST /make-request/:serviceid`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 201 Created
    - `{ message: "Request made successfully", data: <newRequestData> }`
  - Failure:
    - HTTP 401 Unauthorized (User not verified)
    - `{ message: "You've not verified your email address so you cannot make a request" }`
    - HTTP 404 Not Found (Service not found)
    - `{ message: "Service not found." }`
    - HTTP 500 Internal Server Error (for unexpected errors)

2. Accept Service Request
- Endpoint: `PATCH /accept-request/:requestId`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Request Status Updated Successfully" }`
  - Failure:
    - HTTP 401 Unauthorized (User not allowed to change request status)
    - `{ message: "You're Not Authorized to change the status of this request!!" }`
    - HTTP 500 Internal Server Error (for unexpected errors)

3. Reject Service Request
- Endpoint: `PATCH /reject-request/:requestId`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Request Status Updated Successfully" }`
  - Failure:
    - HTTP 401 Unauthorized (User not allowed to change request status)
    - `{ message: "You're Not Authorized to change the status of this request!!" }`
    - HTTP 500 Internal Server Error (for unexpected errors)

4. Complete Service Request
- Endpoint: `PATCH /complete-request/:requestId`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Request Status Updated Successfully, The User Would also need to confirm that the request has been completed before it is fully complete" }`
  - Failure:
    - HTTP 401 Unauthorized (User not allowed to change request status)
    - `{ message: "You're Not Authorized to change the status of this request!!" }`
    - HTTP 

500 Internal Server Error (for unexpected errors)

5. User Confirmation for Service Completion
- Endpoint: `POST /user-complete-request/:requestID`
- Input: (Requires authentication)
  - `userResponse`: Boolean indicating user's response to service completion.
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "You've Successfully Finished The Transaction. We Hope To See You Again On Our Platform" }`
  - Failure:
    - HTTP 500 Internal Server Error (for unexpected errors)

6. Get Pending Requests
- Endpoint: `GET /get-pending-requests`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ pendingRequests: <array_of_pending_requests> }`
  - Failure:
    - HTTP 500 Internal Server Error (for unexpected errors)

7. Get Accepted Requests
- Endpoint: `GET /get-accepted-requests`
- Input: (Requires authentication)
- Output:
  - Success:
    - HTTP 200 OK
    - `{ acceptedRequests: <array_of_accepted_requests> }`
  - Failure:
    - HTTP 500 Internal Server Error (for unexpected errors)

8. Get Rejected Requests
- Endpoint: `GET /get-rejected-requests`
- Input: (Requires authentication)
- Output:
    - Success:
      - HTTP 200 OK
      - `{ rejectedRequests: <array_of_rejected_requests> }`
    - Failure:
      - HTTP 500 Internal Server Error (for unexpected errors)

9. Get Completed Requests
- Endpoint: `GET /get-completed-requests`
- Input: (Requires authentication)
- Output:
    - Success:
      - HTTP 200 OK
      - `{ completedRequests: <array_of_completed_requests> }`
    - Failure:
      - HTTP 500 Internal Server Error (for unexpected errors)

Setup
1. Connect to Database
- Endpoint: `POST /connect-db`
- Output:
  - Success:
    - HTTP 200 OK
    - `{ message: "Connected to the database" }`
  - Failure:
    - HTTP 500 Internal Server Error (for unexpected errors)

Usage
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the server.
4. Use the provided endpoints for user authentication and service management.
Note: Ensure that you have the required environment variables set, such as `JWT_SECRET_KEY`, `MONGODB_URI`, `BRAVO_SMTP_AKI_KEY`, `PORT` and database connection details.
