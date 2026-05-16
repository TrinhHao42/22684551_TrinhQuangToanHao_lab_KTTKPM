# Travel Booking System (Orchestration-Driven SOA)

This project demonstrates an Orchestration-Driven SOA architecture with 5 backend services and 1 frontend application.

## Architecture
- **Orchestrator Service** (Port 8080): Coordinates the entire booking flow.
- **User Service** (Port 8081): Manages user login and information.
- **Tour Service** (Port 8082): Manages tour listings and details.
- **Booking Service** (Port 8083): Handles the creation of booking records.
- **Payment Service** (Port 8084): Simulates payment processing (random success/fail).
- **Travel UI** (Port 3000): React frontend that interacts only with the Orchestrator.

## Flow: Booking a Tour
1. Frontend calls `Orchestrator: POST /book-tour`.
2. Orchestrator calls `User Service` to validate the user.
3. Orchestrator calls `Tour Service` to get price and details.
4. Orchestrator calls `Booking Service` to create a pending booking.
5. Orchestrator calls `Payment Service` to process payment.
6. Orchestrator returns the final result to the Frontend.

## How to Run
### Windows (PowerShell)
Run the `start_all.ps1` script in the root directory.

### Linux/macOS/Git Bash
Run the `start_all.sh` script:
```bash
chmod +x start_all.sh
./start_all.sh
```

### Manual Start
Or manually start each service in separate terminals:
cd user-service && node index.js
cd tour-service && node index.js
cd booking-service && node index.js
cd payment-service && node index.js
cd orchestrator-service && node index.js
cd travel-ui && npm run dev
```

## Default Login
- **Username**: `toanhao`
- **Password**: `password123`
