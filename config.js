// Database Configuration
const config = {
    database: {
        host: '127.0.0.1',
        name: 'myapp',
        user: 'root',
        password: ''
    },
    jwt: {
        secret: 'your-super-secret-jwt-key-change-this-in-production',
        expiresIn: '24h'
    },
    server: {
        port: 3000,
        env: 'development'
    },
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        uploadPath: 'uploads',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
};

module.exports = config;
