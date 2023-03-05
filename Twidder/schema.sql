DROP TABLE IF EXISTS users; 
DROP TABLE IF EXISTS loggedInUsers; 
DROP TABLE IF EXISTS messages; 

CREATE TABLE users ( email VARCHAR(200) PRIMARY KEY, 
                    password VARCHAR(60) NOT NULL,
                    firstname VARCHAR(200) NOT NULL,
                    lastname VARCHAR(200) NOT NULL,
                    gender VARCHAR(10) NOT NULL,
                    city VARCHAR(200) NOT NULL,
                    country VARCHAR(200) NOT NULL,
                    visited INTEGER NOT NULL
                    );

CREATE Table loggedInUsers ( token VARCHAR(36) PRIMARY KEY,
                            email varchar(200) NOT NULL,
                            FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE);

CREATE TABLE messages ( id INTEGER PRIMARY KEY AUTOINCREMENT,
                        message TEXT NOT NULL,
                        sender Varchar(200) NOT NULL,
                        reciever VARCHAR(200) NOT NULL,
                        FOREIGN KEY (reciever) REFERENCES users(email),
                        FOREIGN KEY (sender) REFERENCES users(email));

