NEYDRA Architecture
Core Logic
Frontend: HTML5/JS (No Frameworks).
Backend: PHP (Session/Auth) + Python (AI/Crypto).
Database: MySQL (Relational Data).
Workflow
User pays USDT to Smart Contract.
subscription_manager.py detects blockchain event.
DB updates users table subscription_plan column.
auth.js calls api/validate_subscription.php.
PHP returns plan status, JS redirects or unlocks.
