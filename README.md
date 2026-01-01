# 2FA Authentication System - Backend

A robust Node.js/Express backend for a Two-Factor Authentication (2FA) system with device fingerprinting, session management, and secure login capabilities.


## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 2FA-Authentication-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4001

# Database Configuration
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Configuration
ACCESS_TOKEN_EXPIRY=3d
ACCESS_TOKEN_SECRETE=your_jwt_secret_key_here

# Google OAuth Configuration
CLIENT_ID=your_google_client_id
CLIENT_SECRETE=your_google_client_secret
CALLBACK_URL=http://localhost:4001/api/v1/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

The system uses MongoDB. Ensure MongoDB is running and the connection string is correct in `.env`.

**Optional: Create Indexes** (for performance)

```bash
# Connect to MongoDB and run:
db.sessions.createIndex({ userId: 1, isActive: 1 })
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
```

## 📖 Running the Application

### Development Mode

```bash
npm run dev
```

Server will start on `http://localhost:4001`


## 📁 Project Structure

```
2FA-Authentication-System/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── config/
│   │   ├── connectDB.js       # MongoDB connection
│   │   └── environment.config.js # Environment variables
│   ├── controller/            # Route handlers
│   │   ├── login.controller.js
│   │   ├── register.controller.js
│   │   ├── verifyOtp.controller.js
│   │   ├── generate2fa.controller.js
│   │   ├── logout.controller.js
│   │   ├── logoutFromDevice.controller.js
│   │   ├── GetUserLoginAccount.controller.js
│   │   ├── googleAuth.controller.js
│   │   └── home.controller.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── deviceFingerprint.middleware.js
│   │   ├── sessionExpiry.middleware.js
│   │   └── validationErrorHandler.middleware.js
│   ├── model/                 # Database schemas
│   │   ├── user.model.js
│   │   └── session.model.js
│   ├── routes/                # API routes
│   │   ├── auth.route.js
│   │   ├── home.route.js
│   │   └── routes.js
│   ├── services/              # Business logic
│   │   ├── passport.service.js
│   │   └── token.service.js
│   ├── utils/                 # Utility functions
│   │   ├── constants.util.js
│   │   ├── sendResponse.util.js
│   │   ├── logger.util.js
│   │   └── global.error.handler.js
│   └── validation/            # Schema validation
│       ├── loginSchema.validation.js
│       └── registerSchema.validation.js
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes

**POST** `/api/v1/auth/register`

- Register a new user
- Body: `{ userName, email, password, deviceFingerprint }`

**POST** `/api/v1/auth/login`

- Login user
- Body: `{ email, password, deviceFingerprint }`
- Returns: `{ user, accessToken, skipTwoFA }`

**POST** `/api/v1/auth/enable-2fa`

- Enable 2FA for user
- Headers: `Authorization: Bearer {token}`
- Returns: `{ qrCodeDataURL, secret }`

**POST** `/api/v1/auth/verifyOtp`

- Verify OTP for 2FA
- Body: `{ otp, accessToken }`
- Headers: `Authorization: Bearer {token}`

**POST** `/api/v1/auth/logout`

- Logout from current device
- Headers: `Authorization: Bearer {token}`

**POST** `/api/v1/auth/logout-all`

- Logout from all devices
- Headers: `Authorization: Bearer {token}`

**POST** `/api/v1/auth/logout-device`

- Logout from specific device
- Body: `{ sessionId }`
- Headers: `Authorization: Bearer {token}`

**GET** `/api/v1/auth/google`

- Initiate Google OAuth login

**GET** `/api/v1/auth/google/callback`

- Google OAuth callback URL

### Dashboard Routes

**GET** `/api/v1/dashboard`

- Get dashboard home message
- Headers: `Authorization: Bearer {token}`

**GET** `/api/v1/dashboard/login-accounts`

- Get all logged-in devices
- Headers: `Authorization: Bearer {token}`
- Returns: Array of devices with sessionId, ip, deviceName, os, loginDate, is2FaExpired, isTrustedDevice

## 🔐 Security

- **Passwords**: Hashed with bcrypt (10 salt rounds)
- **Tokens**: JWT with 3-day expiry
- **2FA Validity**: 15 days from verification
- **Device Trust**: Verified via fingerprint + 2FA expiry
- **Session Management**: Per-device session tracking
- **CORS**: Configured for frontend URL
- **Input Validation**: Joi schema validation

## 🗄️ Database Models

### User Model

```javascript
{
  userName: String,
  email: String (unique),
  password: String (hashed),
  enabled_2fa: Boolean,
  secrete2fa: String,
  timestamps: true
}
```

### Session Model

```javascript
{
  userId: ObjectId,
  accessToken: String,
  ip: String,
  deviceName: String,
  os: String,
  deviceFingerprint: String,
  isActive: Boolean,
  is2FaComplete: Boolean,
  isTrustedDevice: Boolean,
  createdAt: Date,
  twoFaExpiry: Date (15 days)
}
```

## 📦 Dependencies

Key dependencies:

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **speakeasy**: OTP generation
- **qrcode**: QR code generation
- **passport**: OAuth authentication
- **joi**: Schema validation
- **cors**: CORS middleware
- **express-device**: Device detection

Install all dependencies:

```bash
npm install
```

## 🧪 Testing the API

### Using cURL

**Register:**

```bash
curl -X POST http://localhost:4001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "John Doe",
    "email": "john@example.com",
    "password": "Password@123",
    "deviceFingerprint": "device-hash"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:4001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password@123",
    "deviceFingerprint": "device-hash"
  }'
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for `BASE_URL` and `TOKEN`
3. Use the token from login response in subsequent requests
4. Set header: `Authorization: Bearer {token}`

## 🔧 Environment Variables Reference

| Variable             | Description               | Example                                           |
| -------------------- | ------------------------- | ------------------------------------------------- |
| PORT                 | Server port               | 4001                                              |
| MONGO_URL            | MongoDB connection string | mongodb+srv://...                                 |
| ACCESS_TOKEN_EXPIRY  | JWT expiry time           | 3d                                                |
| ACCESS_TOKEN_SECRETE | JWT secret key            | your_secret_key                                   |
| CLIENT_ID            | Google OAuth client ID    | xxxxxxx.apps.googleusercontent.com                |
| CLIENT_SECRETE       | Google OAuth secret       | GOCSPX-xxxxx                                      |
| CALLBACK_URL         | Google OAuth callback URL | http://localhost:4001/api/v1/auth/google/callback |
| FRONTEND_URL         | Frontend application URL  | http://localhost:5173                             |

## 📝 Development Tips

### Enable Logging

Check console logs for request tracking and debugging:

```javascript
// Already configured in controllers and middleware
console.log("Request data:", req.body);
```

### Database Connection Issues

If MongoDB connection fails:

1. Verify MONGO_URL is correct
2. Check MongoDB is running (for local setup)
3. Verify network access (for MongoDB Atlas)
4. Check firewall settings

### JWT Issues

- Ensure ACCESS_TOKEN_SECRETE is set in .env
- Check token expiry time matches your needs
- Verify token is properly passed in Authorization header

### 2FA Issues

- Verify Google Authenticator or similar app is synced
- OTP window is ±30 seconds
- 2FA expires 15 days after verification
- Check server time is synchronized

## 🚨 Common Issues & Solutions

### "Session Not Found" Error

- User needs to login again
- Token might be expired
- Session might have been deleted

### "Invalid OTP" Error

- Check OTP hasn't expired (30 second window)
- Verify device time is synchronized
- Try regenerating QR code

### CORS Errors

- Verify FRONTEND_URL matches frontend origin
- Check CORS configuration in app.js
- Ensure credentials: true is set if needed

### Device Fingerprint Issues

- Install fingerprint.js on frontend
- Ensure fingerprint is passed on login/register
- Check device fingerprint is consistent



---

**Last Updated**: January 1, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
