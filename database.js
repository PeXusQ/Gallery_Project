const mysql = require('mysql2/promise');
const config = require('./config');

// Create connection pool
const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Initialize database tables if they don't exist
async function initializeDatabase() {
    try {
        // Check if tables exist
        const [tables] = await pool.execute("SHOW TABLES LIKE 'users'");
        
        if (tables.length === 0) {
            console.log('📝 Creating database tables...');
            
            // Create users table
            await pool.execute(`
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    bio TEXT,
                    avatar VARCHAR(255),
                    theme VARCHAR(10) DEFAULT 'light',
                    language VARCHAR(10) DEFAULT 'pl',
                    profile_photo VARCHAR(255) DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Create albums table
            await pool.execute(`
                CREATE TABLE albums (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Create photos table
            await pool.execute(`
                CREATE TABLE photos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    title VARCHAR(200),
                    description TEXT,
                    filename VARCHAR(255) NOT NULL,
                    album_id INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Create photo_likes table
            await pool.execute(`
                CREATE TABLE photo_likes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    photo_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_like (user_id, photo_id)
                )
            `);
            
            // Create photo_comments table
            await pool.execute(`
                CREATE TABLE photo_comments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    photo_id INT NOT NULL,
                    comment_text TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Create photo_ratings table
            await pool.execute(`
                CREATE TABLE photo_ratings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    photo_id INT NOT NULL,
                    rating INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_rating (user_id, photo_id)
                )
            `);
            
            // Create indexes
            await pool.execute('CREATE INDEX idx_photos_user_id ON photos(user_id)');
            await pool.execute('CREATE INDEX idx_photos_album_id ON photos(album_id)');
            await pool.execute('CREATE INDEX idx_photos_created_at ON photos(created_at)');
            await pool.execute('CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id)');
            await pool.execute('CREATE INDEX idx_photo_comments_photo_id ON photo_comments(photo_id)');
            await pool.execute('CREATE INDEX idx_photo_ratings_photo_id ON photo_ratings(photo_id)');
            
            console.log('✅ Database tables created successfully');
        }
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
    }
}

module.exports = {
    pool,
    testConnection,
    initializeDatabase
};
