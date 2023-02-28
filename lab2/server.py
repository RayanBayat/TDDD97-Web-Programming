
# flask --app server --debug run                             to run in debug
#insert into users values ("a@gmail.com","123","nigga","niggashaffa","bi","dick","boobies");

from flask import Flask, request, jsonify

import random
import database_helper

app = Flask(__name__)

# def validate_login(email,password):

loggedIn = {
    "email": "",
    "token": ""
}

loggedInUsers = []

def generate_token():
    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = ""
    for i in range(36):
        token += random.choice(letters)
    return token



@app.route('/',methods= ['GET'])
def root():

    return "",200

@app.route('/sign_in/',methods = ["POST"] )
def sign_in():

    print ( "Signing")
    data = request.get_json()
    email = data['email']
    password = data['password']

    if email and password:
        if  len(password) < 30:
            if database_helper.find_user(email, password):
                token = generate_token()
                loggedIn['token'] = token
                loggedIn['email'] = email

                loggedInUsers.append(loggedIn) #needs sign out

                print(loggedInUsers)

                return jsonify({"token":token}),200

            else: # user not found
                return "", 404
        else: # too long email or password
            return "", 400
    else:# user made a mistake
        return "",400

@app.route('/sign_up/',methods=["POST"])
def sign_up():
    data = request.get_json()
    email = data['email']
    password = data['password']
    firstname = data['firstname']
    familyname = data['familyname']
    gender = data['gender']
    city = data['city']
    country = data['country']

    if email and password and firstname and familyname and gender and city and country:
        if len(password) < 30 and len(password) > 6:

            if database_helper.create_user(email, password, firstname, familyname, gender, city, country):
                return '',201

            else:
                return "", 409
        else:
            return '', 400

    else: # wrong
        return '',400

@app.route('/sign_out/',methods = ['POST'] )
def sign_out():

    print ("Signing out")
    print (loggedInUsers)
    token = request.headers.get("Token")

    for i,loggedIn in enumerate(loggedInUsers):
        if token == loggedIn["token"]:
            loggedInUsers.pop(i)
            print (loggedInUsers)
            return "",204
            
            
    return "",401


@app.route('/change_password/',methods = ['POST'] )
def change_password():
    token = request.headers.get("Token")
    data = request.get_json()
    email = ""

    oldPassword = data['oldpsw']
    newPassword = data['newpsw']

    for user in loggedInUsers:
        if token == user["token"]:
            # Found a matching token, extract the email and break the loop
            email = user['email']
            break
    if database_helper.find_user(email, oldPassword):
        print("nigga1")
        if oldPassword != newPassword:
            print("nigga2")
            if len(newPassword) > 6:
                print("nigga3")
                if database_helper.update_user_password(email, newPassword):
                    print("nigga4")
                    return "",204
                else:
                    return "",400
            else: 
                return "",400
        else: 
            return "",400    
    else: 
        return "",400


@app.route('/get_user_data_by_token/',methods = ['GET'] )
def get_user_data_by_token():
    return 'Getting userdata by token!',200

@app.route('/get_user_data_by_email/',methods = ['GET'] )
def get_user_data_by_email():
    return 'Get user data by email!',200

@app.route('/get_user_messages_by_token/',methods = ['GET'] )
def get_user_messages_by_token():
    return 'Singing in!',200

@app.route('/get_user_messages_by_email/',methods = ['GET'] )
def get_user_messages_by_email():
    return 'Getting user messages by email!',200

@app.route('/post_message/',methods = ['POST'] )
def post_message():
    return 'Post Message!',200

if __name__ == '__main__':
    app.run(debug=True)