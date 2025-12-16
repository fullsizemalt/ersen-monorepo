# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at Ersen. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Send an email to: <security@daemon.app> (or your security contact)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Initial Assessment**: Within 5 business days
- **Status Updates**: Every 7 days until resolution
- **Resolution Timeline**: Depends on severity (see below)

### Severity Levels

| Severity | Description | Target Resolution |
|----------|-------------|-------------------|
| Critical | Remote code execution, auth bypass | 24-48 hours |
| High     | Data exposure, privilege escalation | 7 days |
| Medium   | Limited data exposure, XSS | 30 days |
| Low      | Information disclosure, minor issues | 90 days |

## Security Best Practices

### For Contributors

- Never commit secrets (API keys, passwords, tokens)
- Use environment variables for all sensitive configuration
- Validate and sanitize all user input
- Use parameterized queries for database operations
- Keep dependencies updated

### For Operators

- Use HTTPS in production
- Configure secure cookie settings
- Set up proper CORS policies
- Enable rate limiting
- Monitor logs for suspicious activity
- Regularly rotate secrets and API keys

## Known Security Considerations

### Authentication (WorkOS)

- OAuth 2.0 Authorization Code flow
- HttpOnly cookies for session management
- No password storage (delegated to WorkOS)

### Payments (Stripe)

- No card data stored locally
- Webhook signature verification required
- Stripe-hosted checkout pages

### Data Storage

- PostgreSQL with encrypted connections
- Secrets in environment variables only
- No PII in application logs

## Acknowledgments

We appreciate the security research community. Responsible disclosure helps keep DAEMON 2.0 users safe.

Contributors who report valid security issues will be acknowledged (with permission) in our security hall of fame.
