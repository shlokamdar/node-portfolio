# Static Portfolio with Email Integration

A modern portfolio website with a functional contact form (Name, Email, Message, optional attachment) that emails submissions via SMTP.

## Project Structure

```
static-portfolio/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # External CSS styles
├── js/
│   └── script.js       # External JavaScript
├── server.js           # Node.js/Express backend
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required keys:

- `SMTP_HOST` (e.g., `smtp.gmail.com`)
- `SMTP_PORT` (e.g., `465` for SSL or `587` for STARTTLS)
- `SMTP_SECURE` (`true` for 465, `false` for 587)
- `SMTP_USER` (SMTP username/email)
- `SMTP_PASS` (SMTP password or app password)
- `SMTP_FROM` (optional display From; defaults to SMTP_USER)
- `CONTACT_TO` (destination email; defaults to SMTP_USER)

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`.

### 4. Development Mode (with auto-restart)

```bash
npm run dev
```

## Features

- **Responsive Design**: Works on desktop and mobile
- **File Upload**: Contact form supports file attachments (max 4MB)
- **Email Integration**: Sends via configurable SMTP (Gmail, SendGrid, Mailgun, etc.)
- **Drag & Drop**: File upload with drag and drop support
- **Form Validation**: Client and server-side validation
- **Modern UI**: Dark theme with glassmorphism effects

## Email Details

Messages are sent with subject `Contact Form: [Name]` and include the body fields and optional attachment. `replyTo` is set to the sender's email.

## File Upload

Supported file types:
- Images: JPEG, JPG, PNG, GIF
- Documents: PDF, TXT, DOC, DOCX
- Maximum size: 4MB

## API Endpoints

- `POST /api/contact` - Submit contact form with optional file attachment

## Environment Variables

- `EMAIL_PASSWORD` - Gmail App Password for authentication
- `PORT` - Server port (default: 3000)

## Security Features

- File type validation
- File size limits
- Email format validation
- Temporary file cleanup
- Error handling

## Production Deployment (Nginx + Node)

1. Build server box with Node.js v18+ and Nginx.
2. Clone repo to `/var/www/static-portfolio`.
3. Create `.env` with SMTP credentials and `CONTACT_TO`.
4. Install deps: `npm ci --only=production`.
5. Start server (e.g., `pm2 start server.js --name portfolio` or `node server.js &`).
6. Copy `nginx.conf` to `/etc/nginx/sites-available/portfolio` and symlink to `sites-enabled`.
7. Set Nginx root path to `/var/www/static-portfolio` if different.
8. Test Nginx: `nginx -t` then reload: `systemctl reload nginx`.

## Troubleshooting

### Email not sending
- Verify all SMTP variables in `.env` are correct
- If using Gmail, use App Passwords and SMTP host `smtp.gmail.com`
- Confirm server can reach SMTP host/port (firewall)

### File upload issues
- Check file size (max 4MB)
- Verify file type is supported
- Check server logs for errors

