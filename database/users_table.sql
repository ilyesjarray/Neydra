CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    wallet_address VARCHAR(100) NOT NULL,
    plan_type ENUM('STANDARD', 'PREMIUM', 'ULTRA') NOT NULL,
    amount_usd DECIMAL(10, 2) NOT NULL,
    subscription_status ENUM('pending', 'active', 'denied') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
