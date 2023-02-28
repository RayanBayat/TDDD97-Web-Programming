import sqlite3

from flask import g

DATABSE_URL = 'database.db'

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = sqlite3.connect(DATABSE_URL)


    return db
def disconnect():
    db = getattr(g, 'db', None)
    if db is None:
        g.db.close()
        g.db = None

def find_user(userEmail, userPassword):

    cursor = get_db().execute("SELECT city FROM users WHERE email = ? and password = ?;", (userEmail,userPassword))
    matches = cursor.fetchall()
    cursor.close()

    if matches:
        return True
    else: 
        return False

def create_user(email,password,firstname,familyname,gender,city,country):

    try:
        get_db().execute("INSERT INTO users values(?,?,?,?,?,?,?);", [email,password,firstname,familyname,gender,city,country])
        get_db().commit()
        return True
    except:
        return False


def update_user_password(email, password):

    try:    
        get_db().execute("UPDATE users set password = ? WHERE email = ?;", (password, email))
        get_db().commit()
        return True
    except:
        return False