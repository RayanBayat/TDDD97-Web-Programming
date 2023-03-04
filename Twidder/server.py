
# flask --app server --debug run                             to run in debug
# sqlite3 database.db < schema.sql

from flask import Flask, request, jsonify

import random
import database_helper
import re

app = Flask(__name__)

# def validate_login(email,password):

loggedIn = {
    "email": "",
    "token": ""
}

loggedInUsers = []

def validate_email(email):
    # define regular expression pattern for email validation
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    # use re.match to match the email address against the pattern
    match = re.match(pattern, email)
    return bool(match)


def generate_token():
    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = ""
    for i in range(36):
        token += random.choice(letters)
    return token

def token_to_email(token):
    for user in loggedInUsers:
        if token == user["token"]:
            # Found a matching token, extract the email and break the loop
            email = user['email']
            return email

@app.route('/',methods= ['GET'])
def root():

    return app.send_static_file("client.html") ,200

@app.route('/sign_in/',methods = ["POST"] )
def sign_in():

    print ( "Signing")
    data = request.get_json()
    email = data['email']
    password = data['password']

    if email and password:
        if  len(password) < 30:
            database_helper.delete_old_token_if_exist(email)        
            if database_helper.find_user(email, password):
                token = generate_token()
                loggedIn['token'] = token
                loggedIn['email'] = email

                loggedInUsers.append(loggedIn) #needs sign out

                database_helper.add_token(email, token)

                return jsonify(token),200

            else: # user not found
                return "", 404
        else: # too long email or password
            return "", 400
    else:# user made a mistake
        return "",400

@app.route('/sign_up/',methods=["POST"])
def sign_up():

    print("sign_up was called")

    data = request.get_json()
    email = data['email']
    password = data['password']
    firstname = data['firstname']
    familyname = data['familyname']
    gender = data['gender']
    city = data['city']
    country = data['country']

    if email and password and firstname and familyname and gender and city and country and validate_email(email):
        if len(password) < 30 and len(password) > 6:

            if database_helper.create_user(email, password, firstname, familyname, gender, city, country):
                return '',201

            else: #already exists
                return "", 409
        else:# wrong syntax
            return '', 400

    else: # wrong syntax
        return '',400

@app.route('/sign_out/',methods = ['DELETE'] )
def sign_out():

    token = request.headers.get("Authorization")


    if database_helper.get_user_data(token) != None:
        if database_helper.remove_token(token):
            return "",204  #user successfully signed out
            
            
        return "",401 #token is  already invalid
    return "",401 #Session does not exist

@app.route('/change_password/',methods = ['PUT'] )
def change_password():
    token = request.headers.get("Authorization")
    data = request.get_json()
   
    oldPassword = data['oldpsw']
    newPassword = data['newpsw']
    email = database_helper.get_email(token)

  
    if database_helper.find_user(email, oldPassword):
        
            
        if len(newPassword) > 6:
        
            if database_helper.update_user_password(email, newPassword):
                
                return "",204
            else: # bad syntax
                return "",400
        else: # bad syntax
            return "",400

    else: # provided wrong old password
        return "",401


@app.route('/get_user_data_by_token/',methods = ['GET'] )
def get_user_data_by_token():
    token = request.headers.get("Authorization")

    data = database_helper.get_user_data(token)
    if data:
        return jsonify(data), 200
    else: #session does not exist
        return "",401


@app.route('/get_user_data_by_email/',methods = ['GET'] )
def get_user_data_by_email():
    token = request.headers.get("Authorization")

    req_data = request.args.to_dict()
    email = list(req_data.keys())[0]

  

    if email:
        data = database_helper.get_user_data(token,email)
        
        if data:
            return jsonify(data), 200
        else: 
            return "",404
    else: 
        return "",400


@app.route('/get_user_messages_by_token/',methods = ['GET'] )
def get_user_messages_by_token():
    token = request.headers.get("Authorization")

    data = database_helper.get_user_data(token)
    if data:
        messages = database_helper.get_user_messages(token)
        return jsonify(messages), 200
    else: #session does not exist
        return "",401

@app.route('/get_user_messages_by_email/',methods = ['GET'] )
def get_user_messages_by_email():
    
    
    token = request.headers.get("Authorization")
    req_data = request.args.to_dict()
    email = list(req_data.keys())[0]

    if email and validate_email(email) and token:
        if database_helper.get_user_data(token,email):
            messages = database_helper.get_user_messages(token,email)
            return jsonify(messages), 200
        else: #person does not exist
            return "",404
    else:# invalid email
        return "",401

@app.route('/post_message/',methods = ['POST'] )
def post_message():
    token = request.headers.get("Authorization")
    req_data = request.get_json()
    recieverEmail = req_data["email"]
    message = req_data["message"]

    if message and recieverEmail and validate_email(recieverEmail):

        if database_helper.post_message(token, recieverEmail, message):

            return "", 204
        else:
            return "",400

    else:# message is empty or email is invalid
        return "", 400
    

if __name__ == '__main__':
    app.run(debug=True)