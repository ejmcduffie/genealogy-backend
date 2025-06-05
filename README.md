# AncestryChain: Genealogy Verification Backend

A production-ready, enterprise-grade backend API service for a genealogy verification platform. This system verifies GEDCOM files against government documents, issues NFTs for verified users, and supports multiple payment methods.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Development Environment](#development-environment)
  - [Production Environment](#production-environment)
- [Services](#services)
- [Configuration](#configuration)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Architecture Overview

The system follows a microservices architecture with the following components:

### Services

- **API Gateway**: Entry point for all client requests
- **Auth Service**: User authentication and management
- **GEDCOM Service**: GEDCOM file processing
- **Verification Service**: Document verification logic
- **Payment Service**: Payment processing
- **NFT Service**: NFT minting and rewards
- **Storage Service**: ArDrive integration
- **ZKP Service**: Aleo zero-knowledge proofs

### Workers

- **Verification Worker**: Asynchronous verification processing
- **Payment Worker**: Payment processing worker

### Infrastructure

- **MongoDB**: Database with replica set for reliability
- **Redis**: Caching and queue management
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization

## Prerequisites

- Docker Engine 20.10.0+
- Docker Compose 2.0.0+
- Node.js 20.x (for local development)
- Git

## Project Structure

```
ancestry-chain/
├── services/
│   ├── auth-service/           # User authentication & management
│   ├── gedcom-service/         # GEDCOM file processing
│   ├── verification-service/   # Document verification logic
│   ├── payment-service/        # Payment processing
│   ├── nft-service/           # NFT minting & rewards
│   ├── storage-service/       # ArDrive integration
│   └── zkp-service/           # Aleo zero-knowledge proofs
├── workers/
│   ├── verification-worker/    # Async verification processing
│   └── payment-worker/        # Payment processing worker
├── shared/
│   ├── database/              # MongoDB models & migrations
│   ├── middleware/            # Common middleware
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript definitions
├── monitoring/
│   └── prometheus.yml         # Prometheus configuration
├── mongo-init-scripts/
│   ├── init-mongo.sh          # MongoDB initialization script
│   └── init-replica-set.js    # Replica set configuration
├── Dockerfile                 # Main Dockerfile
├── docker-compose.yml         # Main Docker Compose configuration
├── docker-compose.dev.yml     # Development overrides
├── docker-compose.prod.yml    # Production overrides
├── .env                       # Environment variables
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## Getting Started

### Development Environment

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ancestry-chain
   ```

2. Create a .env file based on the .env.example template
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

3. Start the development environment
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

   This will start all services in development mode with hot reloading enabled.

### Production Environment

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ancestry-chain
   ```

2. Create a .env file based on the .env.example template
   ```bash
   cp .env.example .env
   # Edit the .env file with your production configuration
   ```

3. Start the production environment
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

   This will start all services in production mode with optimized settings.

## Services

### API Gateway

The API Gateway is the entry point for all client requests. It routes requests to the appropriate services and handles authentication.

- **Port**: 3000
- **Endpoints**:
  - `/api/v1/auth`: Authentication endpoints
  - `/api/v1/gedcom`: GEDCOM file endpoints
  - `/api/v1/verification`: Verification endpoints
  - `/api/v1/payment`: Payment endpoints
  - `/api/v1/nft`: NFT endpoints
  - `/health`: Health check endpoint

### Auth Service

The Auth Service handles user authentication and management.

- **Endpoints**:
  - `/register`: Register a new user
  - `/login`: Login an existing user
  - `/refresh`: Refresh an access token
  - `/profile`: Get user profile
  - `/health`: Health check endpoint

### GEDCOM Service

The GEDCOM Service handles GEDCOM file processing.

- **Endpoints**:
  - `/upload`: Upload a GEDCOM file
  - `/parse`: Parse a GEDCOM file
  - `/status/:id`: Get the status of a GEDCOM file
  - `/health`: Health check endpoint

### Verification Service

The Verification Service handles document verification logic.

- **Endpoints**:
  - `/verify`: Verify a GEDCOM file
  - `/status/:id`: Get the status of a verification
  - `/health`: Health check endpoint

### Payment Service

The Payment Service handles payment processing.

- **Port**: 3001 (for webhook callbacks)
- **Endpoints**:
  - `/create`: Create a payment
  - `/status/:id`: Get the status of a payment
  - `/webhook`: Webhook endpoint for payment providers
  - `/health`: Health check endpoint

### NFT Service

The NFT Service handles NFT minting and rewards.

- **Endpoints**:
  - `/mint`: Mint an NFT
  - `/status/:id`: Get the status of an NFT
  - `/rewards`: Get user rewards
  - `/health`: Health check endpoint

### Storage Service

The Storage Service handles ArDrive integration for permanent storage.

- **Endpoints**:
  - `/upload`: Upload a file to ArDrive
  - `/status/:id`: Get the status of an upload
  - `/health`: Health check endpoint

### ZKP Service

The ZKP Service handles Aleo zero-knowledge proofs.

- **Endpoints**:
  - `/prove`: Generate a zero-knowledge proof
  - `/verify`: Verify a zero-knowledge proof
  - `/health`: Health check endpoint

## Configuration

### Environment Variables

The system uses environment variables for configuration. These are defined in the .env file. See .env.example for a template.

### Docker Compose

The system uses Docker Compose for orchestration. The main configuration is in docker-compose.yml, with overrides for development and production in docker-compose.dev.yml and docker-compose.prod.yml respectively.

### MongoDB

MongoDB is configured as a replica set for reliability. The initialization script in mongo-init-scripts/init-replica-set.js sets up the replica set and creates the necessary users and databases.

### Redis

Redis is used for caching and queue management. It is configured with persistence enabled.

## Testing

### Unit Tests

Each service has its own unit tests. To run them:

```bash
cd services/<service-name>
npm test
```

### Integration Tests

Integration tests are available in the tests directory. To run them:

```bash
npm run test:integration
```

### Docker Tests

To test the Docker setup:

```bash
./test-docker-build.sh    # Test building Docker images
./test-docker-compose.sh  # Test Docker Compose configuration
./test-health-checks.sh   # Test health checks
```

## Monitoring

### Prometheus

Prometheus is used for metrics collection. It is configured in monitoring/prometheus.yml.

- **Port**: 9090
- **URL**: http://localhost:9090

### Grafana

Grafana is used for metrics visualization. It is configured with dashboards for all services.

- **Port**: 3002
- **URL**: http://localhost:3002
- **Default credentials**: admin/admin_password (configurable in .env)

## Deployment

### Local Deployment

For local deployment, use Docker Compose:

```bash
docker-compose up -d
```

### Production Deployment

For production deployment, use Docker Compose with the production override:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Cloud Deployment

For cloud deployment, you can use Docker Compose or Kubernetes. For Kubernetes, you will need to create Kubernetes manifests based on the Docker Compose configuration.

## Troubleshooting

### Common Issues

#### MongoDB Connection Issues

If you encounter MongoDB connection issues, check that the replica set is properly initialized:

```bash
docker-compose exec mongodb mongosh --eval "rs.status()"
```

#### Redis Connection Issues

If you encounter Redis connection issues, check that Redis is running and the password is correct:

```bash
docker-compose exec redis redis-cli -a $REDIS_PASSWORD ping
```

#### Service Health Checks

If a service is not starting, check its health check:

```bash
docker-compose ps
docker-compose logs <service-name>
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License.
