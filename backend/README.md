# SnipVibe Backend

A comprehensive backend system for the SnipVibe short video clip generator application.

## Features

- **Video Processing**: FFmpeg-based video processing with platform-specific optimization
- **AI Integration**: OpenAI-powered content analysis and metadata generation
- **Credit System**: User credit management with Stripe payment integration
- **Queue System**: Redis-based job queue for video processing
- **Multi-Database**: PostgreSQL for relational data, MongoDB for video metadata
- **Cloud Storage**: AWS S3 integration for video storage
- **Authentication**: JWT-based authentication system
- **Rate Limiting**: API rate limiting and security middleware

## Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- FFmpeg installed locally
- AWS S3 bucket
- Stripe account
- OpenAI API key

### Installation

1. Clone and setup:
```bash
cd backend
npm install
```

2. Environment setup:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start databases:
```bash
docker-compose up -d
```

4. Run migrations:
```bash
npm run migrate
```

5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### Video Processing
- `POST /api/videos/process/link` - Process video from URL
- `POST /api/videos/process/upload` - Process uploaded video
- `GET /api/videos/:id/status` - Get processing status
- `GET /api/videos/:id/download` - Download processed video
- `DELETE /api/videos/:id` - Delete video

### User Management
- `GET /api/users/credits` - Get user credits
- `POST /api/users/credits/purchase` - Purchase credits
- `GET /api/users/videos` - Get user videos
- `GET /api/users/subscription` - Get subscription info

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhooks

## Architecture

### Video Processing Flow
1. User submits video URL or uploads file
2. System validates input and checks credits
3. Job queued in Redis for processing
4. Worker downloads/processes video with FFmpeg
5. AI analyzes content for optimal clipping
6. Processed video uploaded to S3
7. Metadata generated and stored
8. User notified of completion

### Database Schema

**PostgreSQL (Relational Data)**
- Users table with authentication and credits
- Transactions table for credit history

**MongoDB (Video Metadata)**
- Video documents with processing status
- Flexible metadata storage

### Security Features
- JWT authentication
- Rate limiting
- Input validation
- Secure file uploads
- CORS protection
- Helmet security headers

## Configuration

### Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Databases
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=snipvibe
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
MONGODB_URI=mongodb://localhost:27017/snipvibe
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=snipvibe-videos

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-...

# FFmpeg (optional)
FFMPEG_PATH=/usr/local/bin/ffmpeg
FFPROBE_PATH=/usr/local/bin/ffprobe
```

## Deployment

### Production Setup

1. **Infrastructure**:
   - Load balancer for API servers
   - Separate worker instances for video processing
   - Managed databases (RDS, MongoDB Atlas)
   - Redis cluster for queue management

2. **Monitoring**:
   - Application logs with Winston
   - Queue monitoring
   - Error tracking
   - Performance metrics

3. **Security**:
   - Environment-specific secrets
   - Network security groups
   - SSL/TLS certificates
   - Regular security updates

### Docker Deployment

```bash
# Build image
docker build -t snipvibe-backend .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## Development

### Testing
```bash
npm test
```

### Code Structure
```
src/
├── database/
│   ├── connections.js
│   ├── models/
│   └── migrations/
├── routes/
│   ├── auth.js
│   ├── videos.js
│   ├── users.js
│   └── webhooks.js
├── services/
│   ├── videoProcessor.js
│   └── aiService.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
└── utils/
    └── logger.js
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

MIT License - see LICENSE file for details