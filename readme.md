# This Twidder has statistical data, drag and drop and http response codes

## In order to Install virtual python:

virtualenv -p python3 virtualpython

source virtualpython/bin/activate

pip install flask

pip install flask_sock

pip install gunicorn

### install more libraries if needs be

## In order to run lab2:

cd lab2

flask --app server --debug run


## In order to run Twidder

cd Twidder

gunicorn -b 127.0.0.1:5000 --workers 1 --threads 100 server:app