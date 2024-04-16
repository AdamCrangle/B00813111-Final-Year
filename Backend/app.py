from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

# Setup MongoDB connection
client = MongoClient('mongodb+srv://adamcrangle0:pVvTCCMueTCiFfu1@cluster0.zdhwfcc.mongodb.net/')
db = client['Final_Year-Database']
Mongo_users = db.users
Mongo_books = db.books

@app.route('/api/register', methods=['POST'])
def Register_User():
    data = request.json
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({'message': 'Username and password are required'}), 400

    username = data['username']
    email = data.get('email')
    password = data['password']
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Check for existing user
    if Mongo_users.find_one({"username": username}):
        return jsonify({'message': 'User already exists'}), 409

    # Insert new user
    Mongo_users.insert_one({"email":email,"username": username, "password": hashed_password})
    return jsonify({'message': 'Test user created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def Login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Please provide details for all fields'}), 400

    # Find the user in the database
    user = Mongo_users.find_one({'username': username})

    if user and bcrypt.check_password_hash(user['password'], password):
        # If the password is correct
        return jsonify({'message': 'Login successful'}), 200
    else:
        # If the password is wrong or user does not exist
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/api/search_books', methods=['GET'])
def search_books_Title():
    title = request.args.get('title')
    if title:
        # Exclude the '_id' field from the returned document
        books = Mongo_books.find_one({"title": title}, {'_id': 0})
        if books:
            return jsonify(books), 200
        else:
            return jsonify({"error": "No books found matching the given title"}), 404
    else:
        return jsonify({"error": "No title provided"}), 400






if __name__ == '__main__':
    app.run(debug=True)