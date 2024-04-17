from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import re

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['JWT_SECRET_KEY'] = 'super-secret'
CORS(app)
jwt = JWTManager(app)

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

    #Encrypting Password for security purposes
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Check for existing user
    if Mongo_users.find_one({"username": username}):
        return jsonify({'message': 'User already exists'}), 409

    # Creating New User
    Mongo_users.insert_one({
        "email": email,
        "username": username,
        "password": hashed_password,
        "rentalHistory": [],
        "currentlyRented": []
    })
    return jsonify({'message': 'Test user created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = Mongo_users.find_one({"username": username})

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=username)
        user_data = {
            'username': username,
            'email': user['email'],
            'rentalHistory' : user['rentalHistory'],
            'currentlyRented' : user['currentlyRented']
        }
        return jsonify(access_token=access_token, user=user_data), 200

    return jsonify({"msg": "Invalid username or password"}), 401




@app.route('/api/search_books', methods=['GET'])
def search_books():
    search_type = request.args.get('type')
    keyword = request.args.get('keyword')
    print(search_type)
    print(keyword)
    if not keyword:
        return jsonify({"error": f"No {search_type} provided"}), 400
    field_map = {
        'Title': 'Title',
        'Genre': 'Genre',
        'Author': 'Author',
        'Country': 'Country',
        'Language': 'Language'
    }
    # Get the correct field to search on, default to 'title' if not found
    search_field = field_map.get(search_type, 'Title')

    regex_pattern = f"\\b{re.escape(keyword)}"  # \b asserts a word boundary

    books_cursor = Mongo_books.find(
        {search_field: {"$regex": regex_pattern, "$options": "i"}},
        {'_id': 0}
    )
    books = list(books_cursor)

    if books:
        print(jsonify(books))
        return jsonify(books), 200
    else:
        return jsonify({"error": f"No books found matching the given {search_type}"}), 404

@app.route('/api/users/<username>', methods=['GET'])
def get_user_by_username(username):
    user = Mongo_users.find_one({"username": username})  # Find the user by username
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404
if __name__ == '__main__':
    app.run(debug=True)