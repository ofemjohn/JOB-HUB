from flask import Flask, jsonify, request, abort, make_response
from db.db import DB
from controllers.auth import Auth, is_valid_email, set_attributes
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, unset_jwt_cookies
from jwt.exceptions import InvalidTokenError
from db.models import User
from db.db import db
from datetime import datetime

app = Flask(__name__)
DB = DB(app)
jwt = JWTManager(app)


@app.route('/', methods=['GET'])
def test():
    # test route
    return jsonify({"message": "This is a test message"})


@jwt.user_identity_loader
def user_identity_lookup(user):
    '''
    Register a callback function that takes whatever object is passed in as the
    identity when creating JWTs and converts it to a JSON serializable format.
    '''
    return user


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    '''
    Register a callback function that loads a user from your
    database whenever a protected route is accessed. This should
    return any python object on a successful lookup, or None if the
    lookup failed for any reason (for example
    if the user has been deleted from the database).
    '''
    email = jwt_data["sub"]
    return User.query.filter_by(email=email).one_or_none()


# create a new user
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    email = data['email']
    if not email or not is_valid_email(email):
        return jsonify(
            {"message": "Please provide a valid email", "success": False}), 400
    try:
        Auth.register_user(data)
        return jsonify(
            {"message": f'User with email {email} created successfully', "success": True}), 200
    except ValueError:
        return jsonify(
            {"message": f'User with email {email} already exists', "success": False}), 400
    except IntegrityError as e:
        error_message = str(e.orig)  # Get the original error message
        if 'Duplicate entry' in error_message:
            return jsonify(
                {"message": f'Username or email already exists', "success": False}), 400
        else:
            return jsonify(
                {"success": False, "message": "IntegrityError occurred", "error": error_message}), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": "Error occurred", "error": str(e)}), 500


# Authenticate a user
@app.route("/api/authenticate", methods=["POST"])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    if not email or not password:
        return abort(400)
    if Auth.valid_login(email, password):
        access_token = create_access_token(identity=email)
        return make_response({"success": True,
                              "message": "Logged in successfully",
                              "access_token": access_token})
    else:
        return abort(401)


# Logout user
@app.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    try:
        user = get_jwt_identity()
        resp = make_response(
            jsonify({"success": True, "message": "Logged out successfully"}))
        unset_jwt_cookies(resp)
        return resp, 200
    except NoResultFound:
        return jsonify(
            {"success": False, "message": "Invalid Session Id or user does not exist"}), 403
    except Exception as e:
        # logging.error(e)
        return jsonify(
            {"success": False, "message": "Error occurred", "error": str(e)}), 500


# profile creation
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if user is None:
            return jsonify(
                {"success": False, "message": "User not found"}), 404
        profile = user.to_dict()
        return jsonify(profile)
    except Exception as e:
        return jsonify(
            {"success": False, "message": "Error occurred", "error": str(e)}), 500


# Update profile
@app.route('/api/update_profile', methods=['POST'])
@jwt_required()
def update_user():
    data = request.json
    email = data['email']
    if not email or not is_valid_email(email):
        return jsonify(
            {"message": "Please provide a valid email", "success": False}), 400

    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify(
                {"success": False, "message": "User not found"}), 404

        user = set_attributes(user, **data)
        user.updated_at = datetime.now()
        db.session.commit()

        return jsonify({"success": True,
                        "message": "Profile updated successfully"})
    except Exception as e:
        return jsonify(
            {"success": False, "message": "Error occurred", "error": str(e)}), 500


if __name__ == '__main__':
    DB.create_all()
    app.run(debug=True, port='5002')
