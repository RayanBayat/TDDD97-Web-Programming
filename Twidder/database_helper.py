import sqlite3

from flask import g

DATABSE_URI = 'database.db'

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = sqlite3.connect(DATABSE_URI)


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

def get_user_data(token,email = None):


    myemail = get_email(token)
    
    if myemail is None:
        return None
    if email is None:
        email = myemail 

    cursor = get_db().execute("SELECT * FROM users WHERE email = ?;", [email])
    matches = cursor.fetchall()
    
    cursor.close()

    result = []
    for index in range(len(matches)):
        result.append({'email': matches[index][0],
                     'first_name': matches[index][2],  
                     'family_name': matches[index][3],  
                     'gender': matches[index][4],  
                     'country': matches[index][5],  
                     'city': matches[index][6]})

    return result



def get_user_messages(token,email = None):

    myemail = get_email(token)
    if myemail is None:
        return None
    if email is None:
        email = myemail
    cursor = get_db().execute("SELECT * FROM messages WHERE reciever = ?;", [email])
    matches = cursor.fetchall()
    cursor.close()

    result = []
    for index in range(len(matches)):
        result.append({'messages': matches[index][1],
                     'sender': matches[index][2]})
    return result

def post_message(token,recieverEmail, message):
    
    email = get_email(token)
    if email is None:
        return False
    try:
        get_db().execute('INSERT INTO messages (message,sender,reciever) values(?,?,?);', [message, email,recieverEmail])
        get_db().commit()
        return True
    except:
        return False

def get_email(token):
    cursor = get_db().execute("SELECT email FROM loggedInUsers WHERE token = ?;", [token])
    matches = cursor.fetchall()
    cursor.close()
    if matches:
        email = matches[0][0] 
        return email
    else:
        return None
    
def add_token(email, token):
    try: 
        get_db().execute("INSERT INTO loggedInUsers values(?,?);", [token,email])
        get_db().commit()
        return True
    except:
        return False

def delete_old_token_if_exist(email):
    cursor = get_db().execute("SELECT token FROM loggedInUsers WHERE email = ?;", [email])
    matches = cursor.fetchall()
    cursor.close()
    if matches:
        token = matches[0][0]
        remove_token(token)

def remove_token(token):
    try: 
        get_db().execute("DELETE FROM loggedInUsers WHERE token = ?;", [token])
        get_db().commit()
        return True
    except:
        return False