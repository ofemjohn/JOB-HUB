from flask import Flask, jsonify, request, abort, make_response
from db.db import DB
from controllers.auth import Auth, is_valid_email, set_attributes
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, unset_jwt_cookies
from db.models import User
from db.db import db
from datetime import datetime
from controllers.joblisting import Joblist, set_joblisting_attributes
from db.models import JobListing
from sqlalchemy.exc import DataError
import re


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

# Create  a new Job Post
@app.route('/api/joblisting', methods=['POST'])
@jwt_required()
def create_joblisting():
    data = request.json
    application_email = data['application_email']
    if not application_email or not is_valid_email(application_email):
        return jsonify(
            {"message": "Please provide a valid email address", "success": False}), 400
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if not user:
            return jsonify(
                {"message": "User not found", "success": False}), 404
        data['user_id'] = user.id
        Joblist.create_job_listing(data)
        return jsonify(
            {"message": f'Job posted successfully', "success": True}), 200
    except DataError as e:
        return jsonify(
            {"success": False, "message": "Data truncation error occurred", "error": str(e)}), 400
    except Exception as e:
        return jsonify(
            {"success": False, "message": "Error occurred while posting job", "error": str(e)}), 500


# Retrieve the list of jobs
@app.route('/api/get_joblistings', methods=['GET'])
@jwt_required()
def get_joblisting():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if user is None:
            return jsonify(
                {"message": "User not found", "success": False}), 404
        
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        job_listings = JobListing.query.filter_by(user_id=user.id).all()
        paginated_job_listings, total_pages = Joblist.paginate_results(job_listings, page, per_page)

        job_listings_data = [job.to_dict() for job in paginated_job_listings]

        return jsonify({
            "message": "Job listings retrieved successfully",
            "success": True,
            "job_listings": job_listings_data,
            "total_pages": total_pages
        }), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while retrieving job listings", "success": False}), 500


# Filter job listings by location with regex and pagination
@app.route('/api/joblistings/filter/location', methods=['GET'])
@jwt_required()
def filter_joblistings_by_location():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if user is None:
            return jsonify({"message": "User not found", "success": False}), 404

        data = request.json
        location_input = data.get('location')
        if not location_input:
            return jsonify({"message": "Please provide a location", "success": False}), 400

        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        # Build the regex pattern
        pattern = r'\b{}\b'.format(re.escape(location_input))

        # Perform regex search using the REGEXP operator
        job_listings = JobListing.query.filter(
            JobListing.location.op("REGEXP")(pattern)
        ).all()

        paginated_job_listings, total_pages = Joblist.paginate_results(job_listings, page, per_page)

        job_listings_data = [job.to_dict() for job in paginated_job_listings]

        return jsonify({
            "message": "Job listings filtered by location successfully",
            "success": True,
            "job_listings": job_listings_data,
            "total_pages": total_pages
        }), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while filtering job listings", "success": False}), 500



# Filter job listings by salary range with regex and pagination
@app.route('/api/joblistings/filter/salary', methods=['GET'])
@jwt_required()
def filter_joblistings_by_salary():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if user is None:
            return jsonify({"message": "User not found", "success": False}), 404

        data = request.json
        salary_range_input = data.get('salary')
        if not salary_range_input:
            return jsonify({"message": "Please provide a salary range", "success": False}), 400

        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        # Parse the salary range input
        match = re.match(r'^(\d+)-(\d+)$', salary_range_input)
        if not match:
            return jsonify({"message": "Invalid salary range format", "success": False}), 400

        min_salary = int(match.group(1))
        max_salary = int(match.group(2))

        # Perform the salary range filtering
        job_listings = JobListing.query.filter(
            JobListing.salary.between(min_salary, max_salary)
        ).all()

        paginated_job_listings, total_pages = Joblist.paginate_results(job_listings, page, per_page)

        job_listings_data = [job.to_dict() for job in paginated_job_listings]

        return jsonify({
            "message": "Job listings filtered by salary range successfully",
            "success": True,
            "job_listings": job_listings_data,
            "total_pages": total_pages
        }), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while filtering job listings", "success": False}), 500


    

# Update a job posting
@app.route("/api/update_joblistings/<int:job_id>", methods=["PUT"])
@jwt_required()
def update_job_post(job_id):
    data = request.json
    application_email = data.get('application_email')
    if not application_email or not is_valid_email(application_email):
        return jsonify({"message": "Please provide a valid email address", "success": False}), 400

    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify({"message": "User not found", "success": False}), 404

        job_listing = JobListing.query.filter_by(id=job_id, user_id=user.id).first()

        if not job_listing:
            return jsonify({"message": "Job listing not found", "success": False}), 404

        job_listing = set_joblisting_attributes(job_listing, **data)
        job_listing.updated_at = datetime.now()
        db.session.commit()

        return jsonify({"message": "Job listing updated successfully", "success": True}), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while updating job listing", "success": False, "error": str(e)}), 500
    

# Delete a job posting from the database
@app.route("/api/delete_joblisting/<int:job_id>", methods=["DELETE"])
@jwt_required()
def delete_job_listing(job_id):
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify({"message": "User not found", "success": False}), 404

        job_listing = JobListing.query.filter_by(id=job_id, user_id=user.id).first()

        if not job_listing:
            return jsonify({"message": "Job listing not found", "success": False}), 404

        db.session.delete(job_listing)
        db.session.commit()

        return jsonify({"message": "Job listing deleted successfully", "success": True}), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while deleting job listing", "success": False, "error": str(e)}), 500

    





if __name__ == '__main__':
    DB.create_all()
    app.run(debug=True, port='5002')
