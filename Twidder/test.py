import telnetlib
import json
import time
import requests
import random
import pycountry
import string
from faker import Faker

host = 'localhost'
port = 5000


def get_random_city_and_country():
    cities = {'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'}
    city = random.choice(list(cities))
    country = 'Sweden'
    return city, country

def generate_random_password(length=8):
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-='
    password = ''.join(random.choice(chars) for i in range(length))
    return password

def generate_random_email(name):
    domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    domain = random.choice(domains)
    email = f"{name.lower()}_{random.randint(1, 100)}@{domain}"
    return email

def generate_random_name(gender):
    if gender == 'Male':
        first_names = ['Adam', 'Bjorn', 'Carl', 'David', 'Erik', 'Fredrik', 'Gustav', 'Henrik', 'Isak', 'Johan']
    else:
        first_names = ['Anna', 'Bella', 'Clara', 'Diana', 'Ella', 'Frida', 'Gabriella', 'Hanna', 'Isabella', 'Jasmine']
    last_names = ['Andersson', 'Berg', 'Carlsson', 'Dahlberg', 'Eklund', 'Fredriksson', 'Gustavsson', 'Henriksson', 'Isaksson', 'Johansson']
    return f"{random.choice(first_names)}",f"{random.choice(last_names)}"

def generate_random_gender():
    genders = ['Male', 'Female']
    gender = random.choice(genders)
    return gender

def generate_user():
    gender = generate_random_gender()
    firstname,lastname = generate_random_name(gender)
    email = generate_random_email(firstname+lastname)
    password = generate_random_password()
    city, country = get_random_city_and_country()
    user = {
        'email': email,
        'password': password,
        'firstname': firstname,
        'familyname': lastname,
        'gender': gender,
        'city': city,
        'country': country
    }
    return user


def generate_random_quote():
    fake = Faker()
    quote = fake.sentence(nb_words=random.randint(10, 40))
    return f'"{quote}"'


def send_request(reqType,address = None, payload = None,print_output = True):
    tn = telnetlib.Telnet(host, port)
    payload_str = json.dumps(payload)
    content_length = len(payload_str.encode('utf-8'))

    if address:
        address = address + '/'
    else:
        address = ''
    tn.write(reqType.encode('utf-8') + b' /'  +address.encode('utf-8')+  b" HTTP/1.1\r\n") 
    tn.write(b"Host: localhost\r\n")
    tn.write(b"Content-Type: application/json\r\n")
    tn.write(b"Connection: keep-alive\r\n")
    tn.write(b"Content-Length: " + str(content_length).encode('utf-8') + b"\r\n")
    tn.write(b"\r\n")
    tn.write(payload_str.encode('utf-8'))
    response = tn.read_all().decode('utf-8')
    tn.close()

        # Extract the response code from the response string
    response_code = response.split()[1]

    if  response_code == '201' and "sign_up" in address:
        print('\x1b[32m'+"User"+ " created succesfully" + '\x1b[0m')
    else:
        print('\033[31m' + "Failed to add user." + "\x1b[0m")
    # Concatenate the response code with the response string
    if print_output:
        return response
    else:
        return None


for i in range(100):
#     # Example usage
    result = send_request('POST', 'sign_up',generate_user(),False)
    if result is not None:
        print(result)
# print(generate_random_quote())
    # time.sleep(10)


#print (send_request('POST','sign_in',login))
# # Send a POST request to the server
# tn.write(b"POST /submit HTTP/1.1\r\n")
# tn.write(b"Host: localhost\r\n")
# tn.write(b"Content-Type: application/x-www-form-urlencoded\r\n")
# tn.write(b"Content-Length: 29\r\n")
# tn.write(b"\r\n")
# tn.write(b"name=John&email=john@example.com\r\n")

# # Read the response from the server and print it to the console
# response = tn.read_all().decode('utf-8')
# print(response)


# def generate_random_password(length=8):
#     # Define the character set to choose from
#     chars = string.ascii_letters + string.digits + string.punctuation
    
#     # Generate a random password
#     password = ''.join(random.choice(chars) for i in range(length))
    
#     return password
# def get_random_city_and_country():
#     # Get a random country
#     country = random.choice(list(pycountry.countries))
    
#     # Get a list of cities in the country
#     cities = list(pycountry.subdivisions.get(country_code=country.alpha_2))
    
#     # Choose a random city from the list
#     if not cities:
#         # If there are no cities for the country, return N/A as the city name
#         city = "N/A"
#     else:
#         # Choose a random city from the list
#         city = random.choice(list(cities)).name
    
#     return city, country.name

# def generate_random_email():
#     # Generate a random username
#     username = ''.join(random.choices(string.ascii_lowercase, k=10))
    
#     # Generate a random domain name
#     domain = ''.join(random.choices(string.ascii_lowercase, k=10))
    
#     # Choose a random top-level domain
#     tld = random.choice(['com', 'net', 'org'])
    
#     # Combine the parts to create the email address
#     email = '{}@{}.{}'.format(username, domain, tld)
    
#     return email

# def generate_random_name():
#     # Create a Faker object
#     fake = Faker()
    
#     # Generate a random first name
#     first_name = fake.first_name()
    
#     # Generate a random last name
#     last_name = fake.last_name()
    
#     return first_name, last_name

# def generate_random_gender():
#     # Generate a random number (0 or 1)
#     num = random.randint(0, 1)
    
#     # Use the number to choose a gender
#     if num == 0:
#         gender = "male"
#     else:
#         gender = "female"
    
#     return gender

# def create_random_user():
#     email = generate_random_email()
#     password = generate_random_password()
#     firstname,lastname = generate_random_name()
#     gender = generate_random_gender()
#     city,country = get_random_city_and_country()

#     user= {
#         'email': email,
#         'password': password,
#         'firstname': firstname,
#         'familyname': lastname,
#         'gender': gender,
#         'city': city,
#         'country': country
#     }
#     return user
