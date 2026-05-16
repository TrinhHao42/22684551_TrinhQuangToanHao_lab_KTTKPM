Microservices + Event-driven demo

Services:
- api-gateway (Express proxy)
- user-service (Express, MariaDB)
- food-service (Express, MariaDB)
- order-service (Express, MariaDB, RabbitMQ producer)
- payment-service (RabbitMQ consumer -> producer)
- notification-service (RabbitMQ consumer -> Redis)

Run:
- docker-compose up --build

API:
- POST /api/users/register
- POST /api/users/login
- GET /api/foods
- POST /api/orders  { user_id, food_id, amount }
- GET /api/orders

Notifications stored in Redis list 'notifications'
