import requests
import json

base_url = 'http://127.0.0.1:5000/'

# test sign up
# data = {
#     "email": "test@example.com",
#     "password": "test_password",
#     "firstname": "John",
#     "familyname": "Doe",
#     "gender": "Male",
#     "city": "Stockholm",
#     "country": "Sweden"
# }

# response = requests.post(base_url + 'sign_up/', json=data)
# print(response.text)

# test sign in
data = {
    "email": "test@example.com",
    "password": "test_password"
}

response = requests.post(base_url + 'sign_in/', json=data)
print (response.text)


response_data = json.loads(response.content)
token = response_data['token']

print (token)

# # test get user data by token
# headers = {'Token': token}
# response = requests.get(base_url + 'get_user_data_by_token/', headers=headers)
# assert response.status_code == 200

# response_data = json.loads(response.content)
# assert response_data[0] == 'test@example.com'
# assert response_data['firstname'] == 'John'

# # test post message
# data = {
#     "email": "test@example.com",
#     "message": "Hello World"
# }

# headers = {'Token': token}
# response = requests.post(base_url + 'post_message/', headers=headers, json=data)
# assert response.status_code == 204

# # test get user messages by token
# headers = {'Token': token}
# response = requests.get(base_url + 'get_user_messages_by_token/', headers=headers)
# assert response.status_code == 200

# response_data = json.loads(response.content)
# assert len(response_data) == 1
# assert response_data[0]['message'] == 'Hello World'

# # test sign out
# headers = {'Token': token}
# response = requests.post(base_url + 'sign_out/', headers=headers)
# assert response.status_code == 204

# # try to access user data again after signing out
# headers = {'Token': token}
# response = requests.get(base_url + 'get_user_data_by_token/', headers=headers)
# assert response.status_code == 401
