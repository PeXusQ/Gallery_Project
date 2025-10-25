-- Prosty skrypt SQL bez kluczy obcych (dla przypadku problemów z błędem 150)
-- Uruchom ten skrypt w phpMyAdmin

CREATE DATABASE IF NOT EXISTS myapp;
USE myapp;

-- Usuń wszystkie tabele jeśli istnieją
DROP TABLE IF EXISTS photo_ratings;
DROP TABLE IF EXISTS photo_comments;
DROP TABLE IF EXISTS photo_likes;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS users;

-- Tabela użytkowników
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela albumów
CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela zdjęć
CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200),
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    album_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela polubień zdjęć
CREATE TABLE photo_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (user_id, photo_id)
);

-- Tabela komentarzy do zdjęć
CREATE TABLE photo_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela ocen zdjęć
CREATE TABLE photo_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_id INT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_rating (user_id, photo_id)
);

-- Indeksy dla lepszej wydajności
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_photos_created_at ON photos(created_at);
CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX idx_photo_comments_photo_id ON photo_comments(photo_id);
CREATE INDEX idx_photo_ratings_photo_id ON photo_ratings(photo_id);

-- Przykładowe dane
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO albums (user_id, name, description) VALUES 
(1, 'Moje Zdjęcia', 'Kolekcja moich najlepszych zdjęć'),
(1, 'Wakacje 2024', 'Zdjęcia z wakacji'),
(2, 'Portrety', 'Zdjęcia portretowe');
