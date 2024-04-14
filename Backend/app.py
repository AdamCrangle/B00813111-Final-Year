from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Setup MongoDB connection
client = MongoClient('mongodb+srv://adamcrangle0:pVvTCCMueTCiFfu1@cluster0.zdhwfcc.mongodb.net/')
db = client['Final_Year-Database']
users = db.users

@app.route('/api/register', methods=['POST'])
def Register_User():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400

    username = data['username']
    password = data['password']
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Check for existing user
    if users.find_one({"username": username}):
        return jsonify({'message': 'User already exists'}), 409

    # Insert new user
    users.insert_one({"username": username, "password": hashed_password})
    return jsonify({'message': 'Test user created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def Login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    # Find the user in the database
    user = users.find_one({'username': username})

    if user and bcrypt.check_password_hash(user['password'], password):
        # If the password is correct
        return jsonify({'message': 'Login successful'}), 200
    else:
        # If the password is wrong or user does not exist
        return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)
