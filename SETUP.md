# Mass SMS Application - Setup Guide

## Quick Start

This guide will help you set up the Mass SMS application for development and production.

## Prerequisites

- **Node.js**: 18.17.0 or higher
- **npm** or **yarn**: Package manager
- **PostgreSQL**: 14+ (or Neon PostgreSQL for serverless)
- **Git**: Version control
- **Twilio Account**: For SMS sending capabilities

## Environment Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/lordjson8/mass-sms-app.git
cd mass-sms-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

#### Database Configuration

```env
# For Neon PostgreSQL (recommended for serverless)
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]"

# For local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/mass_sms_db"
```

**Getting Neon PostgreSQL connection string:**
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Paste it in `.env.local`

#### NextAuth Configuration

```env
# Generate a secure random string
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Your application URL
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET on different systems:**

- **macOS/Linux**:
  ```bash
  openssl rand -base64 32
  ```

- **Windows (PowerShell)**:
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
  ```

#### Twilio Configuration

Sign up at [twilio.com](https://www.twilio.com/) and get:

```env
TWILIO_ACCOUNT_SID="your-account-sid-here"
TWILIO_AUTH_TOKEN="your-auth-token-here"
TWILIO_PHONE_NUMBER="+1234567890"  # Your Twilio phone number
```

**Finding Twilio Credentials:**
1. Log in to [Twilio Console](https://console.twilio.com)
2. Copy Account SID and Auth Token from the dashboard
3. Go to Phone Numbers → Manage → Active Numbers
4. Copy your assigned phone number

### Step 4: Initialize the Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

If you want to create initial data, edit `prisma/seed.ts` and run:

```bash
npx prisma db seed
```

### Step 5: Create a Superadmin User

You need to manually create the first superadmin user. Connect to your database:

```bash
npx prisma studio
```

Or use SQL directly:

```sql
INSERT INTO "users" (id, email, "passwordHash", role, "isActive", "createdAt", "updatedAt")
VALUES (
  'user-id-here',
  'admin@example.com',
  '$2a$10$...',  -- bcrypt hash of 'password'
  'SUPERADMIN',
  true,
  NOW(),
  NOW()
);
```

**Generate bcrypt hash using Node.js:**

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password', 10, (err, hash) => console.log(hash));"
```

### Step 6: Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

**Default login credentials:**
- Email: `admin@example.com`
- Password: `password`

## Database Schema

### Users Table
Stores user accounts with roles and activation status.

### Categories Table
Organizes contacts into logical groups created by users.

### Contacts Table
Phone numbers linked to categories with uniqueness constraints.

### SMS Logs Table
Tracks all SMS messages with delivery status and Twilio metadata.

### Activity Logs Table
Audit trail of all user actions with IP and user agent.

## Features Walkthrough

### 1. Authentication
- Credential-based login (email + password)
- JWT session management
- Role-based access control (Superadmin, Admin)

### 2. Contact Management
- Add individual contacts
- Bulk import via CSV
- Organize by categories
- Edit/delete functionality

### 3. SMS Sending
- Compose messages with character counter
- Send to all contacts or specific categories
- Real-time Twilio integration
- Message validation

### 4. Delivery Tracking
- View all sent SMS messages
- Track delivery status (Pending, Sent, Delivered, Failed)
- Filter by date range, status, or category
- Twilio webhook integration for real-time updates

### 5. Activity Logs
- Complete audit trail
- Track user actions with timestamps
- Monitor system security events
- IP address and user agent logging

### 6. User Management (Superadmin)
- Create new admin users
- Deactivate/activate accounts
- View all user activity
- Role-based permissions

## API Endpoints

### Authentication
```
POST   /api/auth/callback/credentials
GET    /api/auth/session
GET    /api/auth/signin
GET    /api/auth/signout
```

### Contacts
```
GET    /api/contacts              # List contacts
POST   /api/contacts              # Create or bulk import
PATCH  /api/contacts/:id          # Update contact
DELETE /api/contacts/:id          # Delete contact
```

### Categories
```
GET    /api/categories            # List categories
POST   /api/categories            # Create category
PATCH  /api/categories/:id        # Update category
DELETE /api/categories/:id        # Delete category
```

### SMS
```
POST   /api/sms/send              # Send SMS
POST   /api/sms/status            # Webhook: Update delivery status
GET    /api/sms/status/:twilioSid # Check SMS status
```

### Users (Superadmin)
```
GET    /api/users                 # List users
POST   /api/users                 # Create admin user
PATCH  /api/users/:id             # Update user
DELETE /api/users/:id             # Deactivate user
```

### Logs
```
GET    /api/logs/sms              # SMS delivery logs
GET    /api/logs/activity         # Activity logs
```

## Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Public auth pages
│   ├── (protected)/       # Protected pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home redirect
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Auth-specific components
│   ├── contacts/         # Contact management components
│   ├── sms/              # SMS sending components
│   └── shared/           # Shared components
├── lib/                   # Utilities and config
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── twilio.ts         # Twilio client
│   ├── validators.ts     # Zod schemas
│   └── utils.ts          # Helper functions
├── types/                # TypeScript types
├── middleware.ts         # Route protection
└── styles/              # Global styles

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Database seed (optional)
```

### Running Tests

```bash
# Unit tests
npm run test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your Vercel URL)
   - `NEXTAUTH_SECRET`
   - Twilio credentials
4. Deploy

### Railway

1. Connect GitHub repository
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy

### Docker

```dockerfile
# See Dockerfile for complete setup
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
```

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**

- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- For Neon: Ensure IP whitelist is configured

### Authentication Issues

**Error: "Invalid credentials"**

- Verify user exists in database
- Check password hash is correct
- Ensure `NEXTAUTH_SECRET` is set

### Twilio Integration

**Error: "Twilio credentials invalid"**

- Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
- Confirm `TWILIO_PHONE_NUMBER` is correct
- Check Twilio account has SMS capability

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use strong passwords** - Minimum 8 characters
3. **Enable 2FA** - For Twilio and database accounts
4. **Rotate secrets regularly** - Regenerate NEXTAUTH_SECRET periodically
5. **Monitor activity logs** - Review for suspicious activity
6. **Keep dependencies updated** - Run `npm audit fix` regularly
7. **Use HTTPS in production** - Required for NextAuth
8. **Rate limit SMS endpoint** - Prevent abuse

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT - See LICENSE file for details
