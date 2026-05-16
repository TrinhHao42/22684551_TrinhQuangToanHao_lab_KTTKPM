# Start all backend services in separate windows
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd user-service; node index.js" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd tour-service; node index.js" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd booking-service; node index.js" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd payment-service; node index.js" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd orchestrator-service; node index.js" -WindowStyle Normal

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd travel-ui; npm run dev" -WindowStyle Normal

Write-Host "All services starting... Please wait a few seconds for them to initialize." -ForegroundColor Green
Write-Host "Orchestrator: http://localhost:8080"
Write-Host "Frontend: http://localhost:5173 (or 3000 depending on Vite config)"
