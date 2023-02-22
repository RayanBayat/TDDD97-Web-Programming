
# flask --app server --debug run

from flask import Flask, request, jsonify

import database_helper

app = Flask(__name__)

@app.route('/',methods= ['GET'])
def root():

    return data,200

@app.route('/sign_in/',methods = ['GET'] )
def sign_in():
    return 'Singing in!',200

@app.route('/sign_up/',methods=["POST"])
def sign_up():
    data = request.get_json()
    print (data)
    return 'datasdad',200

@app.route('/sign_out/',methods = ['POST'] )
def sign_out():
    print ('Signing out')
    return 'Singing out!',200

@app.route('/change_password/',methods = ['POST'] )
def change_password():
    return 'Change password!',200

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