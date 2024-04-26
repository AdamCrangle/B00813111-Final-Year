from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import re
import datetime

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
Mongo_reviews = db.reviews

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
    
@app.route('/api/rent_book', methods=['POST'])
def rent_book():
    username = request.json.get('username')
    book_title = request.json.get('Title')

    if not username or not book_title:
        return jsonify({"message": "Username and book title are required"}), 400

    # Find the book by title to get its ID
    book = Mongo_books.find_one({"Title": book_title})
    if not book:
        return jsonify({"message": "Book not found"}), 404

    rent_time = datetime.datetime.now()

    # Update the user document to add the book to currentlyRented
    user_update = Mongo_users.update_one(
        {"username": username},
        {"$push": {"currentlyRented": {"Title": book_title, "rented_on": rent_time}}}
    )

    if user_update.modified_count > 0:
        return jsonify({"message": "Book rented successfully"}), 200
    else:
        return jsonify({"message": "Failed to rent book"}), 400

@app.route('/api/return_book', methods=['POST'])
def return_book():
    username = request.json.get('username')
    book_title = request.json.get('Title')

    if not username or not book_title:
        return jsonify({"message": "Username and book title are required"}), 400

    # Find the rental entry
    user = Mongo_users.find_one({"username": username})
    if not user:
        return jsonify({"message": "User not found"}), 404

    currently_rented = user.get('currentlyRented', [])
    book_rental = next((item for item in currently_rented if item['Title'] == book_title), None)
    if not book_rental:
        return jsonify({"message": "Rental record not found"}), 404

    return_time = datetime.datetime.now()
    rent_time = book_rental['rented_on']

    # Update the user document to move the book from currentlyRented to rentalHistory
    user_update = Mongo_users.update_one(
        {"username": username},
        {
            "$pull": {"currentlyRented": {"Title": book_title}},
            "$push": {
                "rentalHistory": {
                    "Title": book_title,
                    "rented_on": rent_time,
                    "returned_on": return_time
                }
            }
        }
    )

    if user_update.modified_count > 0:
        return jsonify({"message": "Book returned successfully"}), 200
    else:
        return jsonify({"message": "Failed to return book"}), 400
    


@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    # Fetch all reviews, excluding MongoDB's _id field for compatibility
    reviews = list(Mongo_reviews.find({}, {'_id': 0}))
    return jsonify(reviews), 200


@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.json
    required_fields = ['user', 'rating', 'comment', 'accessibility_rating']

    # Validate that all required fields are present
    if not all(field in data for field in required_fields):
        return jsonify({"message": "All required fields must be provided"}), 400

    # Validate rating and accessibility_rating to be between 1 and 5
    rating = data.get('rating', 0)
    accessibility_rating = data.get('accessibility_rating', 0)
    
    if not (1 <= rating <= 5) or not (1 <= accessibility_rating <= 5):
        return jsonify({"message": "Rating and accessibility rating must be between 1 and 5"}), 400

    # Create the review object
    review = {
        "user": data['user'],
        "rating": data['rating'],
        "comment": data['comment'],
        "accessibility_rating": data['accessibility_rating'],
    }

    # Insert the new review into Mongo_reviews
    Mongo_reviews.insert_one(review)

    return jsonify({"message": "Review added successfully"}), 201



if __name__ == '__main__':
    app.run(debug=True)