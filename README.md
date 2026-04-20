# TrueFit Store

Modern fashion e-commerce website.

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Supabase
Go to your Supabase project → SQL Editor → Run this:

```sql
-- Products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price integer not null,
  category text,
  description text,
  sizes text[],
  colors text[],
  images text[],
  created_at timestamp with time zone default now()
);

-- Messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  name text,
  phone text,
  message text,
  created_at timestamp with time zone default now()
);

-- Allow public read for products
alter table products enable row level security;
create policy "Public can read products" on products for select using (true);
create policy "Anyone can insert products" on products for insert with check (true);
create policy "Anyone can delete products" on products for delete using (true);

-- Allow public insert for messages
alter table messages enable row level security;
create policy "Anyone can insert messages" on messages for insert with check (true);
create policy "Anyone can read messages" on messages for select using (true);
```

### 3. Create .env file
Copy .env.example to .env and fill in your Supabase credentials:
- Go to Supabase → Settings → API
- Copy Project URL and anon/public key

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
- Push code to GitHub
- Connect GitHub repo to Vercel
- Add environment variables in Vercel dashboard
- Deploy!

## Admin Panel
URL: `/tf-admin-x9k2`
Password: `truefit2026admin`

**KEEP THIS SECRET — Don't share the URL**
