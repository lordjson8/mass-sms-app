# Mass SMS Web Application

Enterprise-grade mass SMS platform with role-based access, contact management, delivery reporting, and audit trails.

## 🚀 Features

### Core Functionality
- **Role-Based Access**: Superadmin and Admin user management
- **Contact Management**: Organize phone numbers by categories with bulk CSV import
- **SMS Sending**: Send to all contacts or filtered by category
- **Delivery Tracking**: Real-time SMS status reporting (Pending, Sent, Delivered, Failed)
- **Activity Logs**: Complete audit trail of all user actions
- **Analytics Dashboard**: SMS statistics and insights

### Security
- Password hashing with bcrypt
- JWT sessions via NextAuth.js
- Role-based route protection middleware
- Rate limiting on SMS endpoints
- Input validation and sanitization
- Activity logging for compliance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credential-based login
- **SMS Service**: Twilio API
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Twilio account with API credentials
- NextAuth secret key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lordjson8/mass-sms-app.git
   cd mass-sms-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your configuration:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_URL`: Your application URL
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `TWILIO_ACCOUNT_SID`: From Twilio Console
   - `TWILIO_AUTH_TOKEN`: From Twilio Console
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number

4. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth configuration
│   │   ├── contacts/       # Contact CRUD endpoints
│   │   ├── sms/            # SMS sending and webhooks
│   │   ├── users/          # User management (superadmin)
│   │   └── logs/           # Activity and SMS logs
│   ├── (auth)/
│   │   └── login/          # Login page
│   ├── (protected)/
│   │   ├── dashboard/      # Dashboard
│   │   ├── contacts/       # Contact management
│   │   ├── send-sms/       # SMS composition
│   │   ├── reports/        # Delivery reports
│   │   ├── activity-logs/  # Audit trail
│   │   └── users/          # User management (superadmin)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home redirect
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── auth/               # Authentication components
│   ├── contacts/           # Contact management components
│   ├── sms/                # SMS sending components
│   └── shared/             # Shared components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   ├── twilio.ts           # Twilio initialization
│   ├── validators.ts       # Zod schemas
│   └── utils.ts            # Utility functions
├── middleware.ts           # Route protection middleware
├── types/
│   └── index.ts            # TypeScript types
└── styles/
    └── globals.css         # Global styles

prisma/
└── schema.prisma           # Database schema
```

## 📊 Database Schema

### Tables
- **users**: User accounts with roles (SUPERADMIN, ADMIN)
- **categories**: Contact categories organized by creator
- **contacts**: Phone numbers linked to categories
- **sms_logs**: SMS delivery tracking with status
- **activity_logs**: Audit trail of all user actions

## 📡 API Routes

### Authentication
- `POST /api/auth/callback/credentials` - NextAuth credential flow
- `GET /api/auth/session` - Get current session

### Contacts
- `GET /api/contacts` - List contacts (with filters)
- `POST /api/contacts` - Add contact or bulk import CSV
- `PATCH /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### SMS
- `POST /api/sms/send` - Send SMS message
- `POST /api/sms/status` - Twilio webhook for delivery updates
- `GET /api/sms/status/:twilioSid` - Check SMS status

### Users (Superadmin)
- `GET /api/users` - List users
- `POST /api/users` - Create admin user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### Logs
- `GET /api/logs/sms` - SMS delivery logs
- `GET /api/logs/activity` - Activity logs

## 🔐 Security Features

1. **Password Security**: Bcrypt hashing with salt rounds
2. **Session Management**: Secure JWT tokens via NextAuth
3. **Route Protection**: Middleware-based authorization
4. **Role-Based Access**: Function-level permission checks
5. **Input Validation**: Zod schemas on all endpoints
6. **Rate Limiting**: SMS endpoint throttling
7. **Audit Logging**: Every action logged with user context

## 🔄 Workflow

1. **Superadmin** creates Admin users
2. **Any Admin** can:
   - Manage contacts (add, edit, delete, import CSV)
   - Create contact categories
   - Send SMS to individuals or categories
   - View delivery reports
   - Monitor activity logs
3. **System** tracks all actions and SMS delivery status
4. **Twilio Webhook** updates delivery status in real-time

## 🚀 Deployment

The application is ready to deploy on:
- **Vercel** (recommended for Next.js)
- **Railway**
- **Render**
- **AWS Lambda** (with serverless adapter)

## 📝 License

MIT
