# Development Guide

## Getting Started with Development

### 1. Setting Up the Development Environment

After cloning the repository and installing dependencies:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 2. Database Migrations

When you modify the Prisma schema:

```bash
# Create migration
npm run db:migrate

# Or push changes directly (development only)
npm run db:push

# View database UI
npx prisma studio
```

### 3. Adding New Features

#### Adding a New Contact Field

1. Update `prisma/schema.prisma`:
   ```prisma
   model Contact {
     // ... existing fields
     customField  String?
   }
   ```

2. Create migration:
   ```bash
   npm run db:migrate -- --name add_custom_field
   ```

3. Update validator in `src/lib/validators.ts`

4. Update components and API routes

### 4. Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: ESLint + Prettier
- **CSS**: Tailwind CSS with dark mode support
- **Components**: React functional components with hooks

### 5. Testing

#### Unit Tests
```bash
npm run test
```

#### Integration Tests
```bash
npm run test:integration
```

### 6. Common Development Tasks

#### Check for TypeScript errors
```bash
npx tsc --noEmit
```

#### Format code
```bash
npm run lint -- --fix
```

#### Check dependencies for vulnerabilities
```bash
npm audit
```

## API Development

### Creating a New Endpoint

1. Create route file: `src/app/api/[resource]/route.ts`
2. Define validators in `src/lib/validators.ts`
3. Implement handler with proper error handling
4. Add activity logging
5. Document in API section

### Example: Creating a Category

```typescript
// src/lib/validators.ts
export const categorySchema = z.object({
  name: z.string().min(2),
});

// src/app/api/categories/route.ts
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({}, { status: 401 });
  
  const data = await request.json();
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({}, { status: 400 });
  
  const category = await prisma.category.create({
    data: { ...parsed.data, createdBy: (session.user as any).id },
  });
  
  await logActivity(/* ... */);
  
  return NextResponse.json(category, { status: 201 });
}
```

## Component Development

### Creating a New Component

1. Create file in appropriate directory: `src/components/[feature]/[component].tsx`
2. Export as default
3. Use TypeScript for props
4. Follow component naming conventions

### Example: Contact Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validators';

interface ContactFormProps {
  categories: { id: string; name: string }[];
  onSubmit: (data: ContactInput) => Promise<void>;
}

export default function ContactForm({ categories, onSubmit }: ContactFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
```

## Database Seeding

### Create Seed Data

Create `prisma/seed.ts`:

```typescript
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPERADMIN',
    },
  });
  
  console.log('Seeded admin user:', admin);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
```

Run seed:
```bash
npx prisma db seed
```

## Performance Optimization

### Database Queries
- Use `select` to fetch only needed fields
- Batch queries with `Promise.all()`
- Add indexes for frequently filtered fields

### Frontend
- Use React.memo for expensive components
- Implement pagination for large lists
- Lazy load images and heavy components

### Build Size
```bash
# Analyze bundle size
NEXT_ANALYZE=true npm run build
```

## Debugging

### Enable Debug Logs

```env
# .env.local
DEBUG=*
```

### Use Prisma Studio

```bash
npx prisma studio
```

### VSCode Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Start with debugging:
```bash
node --inspect-brk ./node_modules/.bin/next dev
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## Contributing

When contributing:

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push to your fork
5. Create Pull Request with description

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub Release
