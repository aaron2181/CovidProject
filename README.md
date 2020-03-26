# Malaria Detection Website Application

## Windows Installation Instructions
- Create the git repo locally and cd into it
```
git clone https://github.com/atsang14/project_m.git
cd project_m
```
- Download or decrement to Python (below 3.7 version and 64-bit version) for TensorFlow
```
I used 3.6.8, 64-bit Python
https://www.python.org/downloads/release/python-368/
```
If you're using anaconda, update the system path and anaconda to this version of Python.
- Create & activate virtual environment 
```
python -m venv malariaenv
virtualenv malariaenv
malariaenv\Scripts\activate
```
- Install Dependencies & Packages
```
pip install flask, boto3, keras, tensorflow, Pillow
```

## Running the code 
- Activate Virtual Environment
```
(virtual environment name: enter malariaenv if you followed above steps)\Scripts\activate
```
- In the "flask-backend" directory:
```
python app.py
```
- Open another terminal and In the "react-frontend" directory:
```
npm install
npm start
```