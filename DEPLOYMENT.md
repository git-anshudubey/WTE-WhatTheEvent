# Deployment Guide

## 1. Enviroment Secrets Management
Managing sensitive keys (`DB_URI`, `STRIPE_SECRET_KEY`) is critical for security.

### Best Practices
- **Never commit `.env` files** to GitHub. They are ignored by `.gitignore`.
- **Local Development**: Use a `.env` file in `server/` and `client/`.
- **Production (Docker)**: Pass environment variables via the host system or a secure manager, NOT the Dockerfile.
- **Production (Cloud)**: Use the platform's Dashboard (e.g., Render "Environment" tab) to securely inject variables.

---

## 2. Docker Deployment (Self-Hosted / VPS)
This method is best for DigitalOcean Droplets, AWS EC2, or a home server.

### Prerequisites
- Docker & Docker Compose installed.
- A registered domain name (e.g., `example.com`).

### Steps
1.  **Clone & Configure**:
    ```bash
    git clone <repo_url>
    cd event-management-system
    cp server/.env.example server/.env
    # Edit .env with production values
    ```

2.  **Run with Docker Compose**:
    ```bash
    docker-compose up -d --build
    ```

### Domain & SSL (HTTPS)
To secure your application with a custom domain and HTTPS using Certbot and Nginx on the host:

1.  **Point Domain**: Add an 'A' record in your DNS provider pointing `example.com` to your VPS IP.
2.  **Install Nginx & Certbot on Host**:
    ```bash
    sudo apt update
    sudo apt install nginx certbot python3-certbot-nginx
    ```
3.  **Proxy Configuration**:
    Edit `/etc/nginx/sites-available/default`:
    ```nginx
    server {
        server_name example.com;
        location / {
            proxy_pass http://localhost:80; # Points to Client Container
        }
        location /api/ {
            proxy_pass http://localhost:5000; # Points to Server Container
        }
    }
    ```
4.  **Enable SSL**:
    ```bash
    sudo certbot --nginx -d example.com
    ```

---

## 3. Cloud Platform Deployment (PaaS)
Best for Render, Railway, Heroku, or Vercel.

### Server (Backend)
1.  **Create Web Service**: Connect your GitHub repo.
2.  **Root Directory**: `server`.
3.  **Environment Variables**:
    - `NODE_ENV`: production
    - `DB_URI`: Your MongoDB Atlas Connection String.
    - `JWT_SECRET`: A long random string.
    - `STRIPE_SECRET_KEY`: Your Stripe Live Secret Key.
    - `CLIENT_URL`: The URL of your deployed frontend.

### Client (Frontend)
1.  **Create Static Site**: Connect your GitHub repo.
2.  **Root Directory**: `client`.
3.  **Build Command**: `npm install && npm run build`.
4.  **Publish Directory**: `dist`.
5.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed backend.

---

## 4. CI/CD Pipeline
The `.github/workflows/main.yml` file automated testing.
- **Linting**: Checks for code errors in Client and Server.
- **Build**: Verifies the frontend builds successfully.
- **Trigger**: Runs on every push to `main`.
