from flask import Flask, jsonify, request, abort, make_response
from db.db import DB
from controllers.auth import Auth, is_valid_email, set_attributes
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, unset_jwt_cookies
from db.models import User
from db.db import db
from datetime import datetime, timezone
from controllers.joblisting import Joblist, set_joblisting_attributes
from db.models import JobListing
from sqlalchemy.exc import DataError
import re
import os
from db.models import Application
from werkzeug.utils import secure_filename
from flask_mail import Message
from flask_mail import Mail
from flask import send_from_directory
from flask_cors import CORS
import jwt
import urllib.parse



app = Flask(__name__)
DB = DB(app)
jwt = JWTManager(app)
mail = Mail(app)
CORS(app, supports_credentials=True)


@app.route('/api', methods=['GET'])
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

    # Check if any of the required fields are missing or empty
    missing_fields = [
        field for field in data if field not in data or not data[field]]
    if missing_fields:
        return jsonify({"message": "All fields are required", "missing_fields": missing_fields, "success": False}), 400

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
        return make_response(jsonify({"error": "Email and password are required."}), 400)
    if Auth.valid_login(email, password):
        access_token = create_access_token(identity=email)
        return make_response({"success": True,
                              "message": "Logged in successfully",
                              "access_token": access_token})
    else:
        return make_response(jsonify({"success": False, "message": "Invalid email or password."}), 401)

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
        return jsonify({
            "message": "User profile retrieved successfully",
            "success": True,
            "profile": profile
        }), 200
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


# post a job 
@app.route('/api/joblisting', methods=['POST'])
@jwt_required()
def create_joblisting():
    data = request.json
    application_email = data.get('application_email')
    application_link = data.get('application_link')
    listing_type = data.get('listing_type')

    if not application_email and not application_link:
        return jsonify(
            {"message": "Please provide an application email or application link.", "success": False}), 400
    if not listing_type:
        return jsonify({"message": "Please select the listing type.", "success": False}), 400

    if application_email and not is_valid_email(application_email):
        return jsonify(
            {"message": "Please provide a valid email address.", "success": False}), 400

    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if not user:
            return jsonify(
                {"message": "User not found", "success": False}), 404

        # # Check if the application_link includes a protocol, and add if missing
        # application_link = add_https(application_link)

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


# Retrieve the list of all approved jobs
@app.route('/api/get_joblistings', methods=['GET'])
def get_approved_joblistings():
    try:
        # Query only the approved jobs
        job_listings = JobListing.query.filter_by(approved=True).all()
        job_listings_data = [job.to_dict() for job in job_listings]

        return jsonify({
            "message": "Approved job listings retrieved successfully",
            "success": True,
            "job_listings": job_listings_data
        }), 200
    except Exception as e:
        return jsonify(
            {"message": "Error occurred while retrieving approved job listings", "success": False}), 500



# Filter job listings by location with regex
@app.route('/api/joblistings/filter/location', methods=['GET'])
def filter_joblistings_by_location():
    try:
        location_input = request.args.get('location')
        if not location_input:
            return jsonify({"message": "Please provide a location", "success": False}), 400

        # Build the regex pattern
        pattern = r'\b{}\b'.format(re.escape(location_input))

        # Perform regex search using the REGEXP operator
        job_listings = JobListing.query.filter(
            JobListing.location.op("REGEXP")(pattern)
        ).all()

        job_listings_data = [job.to_dict() for job in job_listings]
        if job_listings_data == []:
            return jsonify({"message": "Sorry no jobs available with the location specified"})

        return jsonify({
            "message": "Job listings filtered by location successfully",
            "success": True,
            "job_listings": job_listings_data
        }), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while filtering job listings", "success": False}), 500


# Fileter job by salary


@app.route('/api/joblistings/filter/salary', methods=['GET'])
@jwt_required()
def filter_joblistings_by_salary():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if user is None:
            return jsonify(
                {"message": "User not found", "success": False}), 404

        data = request.json
        salary_range_input = data.get('salary')
        if not salary_range_input:
            return jsonify(
                {"message": "Please provide a salary range", "success": False}), 400

        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        # Parse the salary range input
        match = re.match(r'^(\d+)-(\d+)$', salary_range_input)
        if not match:
            return jsonify(
                {"message": "Invalid salary range format", "success": False}), 400

        min_salary = int(match.group(1))
        max_salary = int(match.group(2))

        # Perform the salary range filtering
        job_listings = JobListing.query.all()
        filtered_job_listings = []
        for job in job_listings:
            # Extract numeric value from salary field
            salary = re.findall(r'\d+', job.salary)
            if salary:
                salary_value = int(salary[0])
                if min_salary <= salary_value <= max_salary:
                    filtered_job_listings.append(job)

        paginated_job_listings, total_pages = Joblist.paginate_results(
            filtered_job_listings, page, per_page)

        job_listings_data = [job.to_dict() for job in paginated_job_listings]

        return jsonify({
            "message": "Job listings filtered by salary range successfully",
            "success": True,
            "job_listings": job_listings_data,
            "total_pages": total_pages
        }), 200
    except Exception as e:
        return jsonify(
            {"message": "Error occurred while filtering job listings", "success": False}), 500


# Update a job posting
@app.route("/api/update_joblistings/<int:job_id>", methods=["PUT"])
@jwt_required()
def update_job_post(job_id):
    data = request.json
    application_email = data.get('application_email')
    if not application_email or not is_valid_email(application_email):
        return jsonify(
            {"message": "Please provide a valid email address", "success": False}), 400

    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify(
                {"message": "User not found", "success": False}), 404

        job_listing = JobListing.query.filter_by(
            id=job_id, user_id=user.id).first()

        if not job_listing:
            return jsonify(
                {"message": "Job listing not found", "success": False}), 404

        job_listing = set_joblisting_attributes(job_listing, **data)
        job_listing.updated_at = datetime.now()
        db.session.commit()

        return jsonify(
            {"message": "Job listing updated successfully", "success": True}), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while updating job listing",
                       "success": False, "error": str(e)}), 500


# Delete a job posting from the database
@app.route("/api/delete_joblisting/<int:job_id>", methods=["DELETE"])
@jwt_required()
def delete_job_listing(job_id):
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify(
                {"message": "User not found", "success": False}), 404

        job_listing = JobListing.query.filter_by(
            id=job_id, user_id=user.id).first()

        if not job_listing:
            return jsonify(
                {"message": "Job listing not found", "success": False}), 404

        db.session.delete(job_listing)
        db.session.commit()

        return jsonify(
            {"message": "Job listing deleted successfully", "success": True}), 200
    except Exception as e:
        return jsonify({"message": "Error occurred while deleting job listing",
                       "success": False, "error": str(e)}), 500


@app.route("/uploads/<path:filename>", methods=["GET"])
def download_file(filename):
    # Update with the actual path to your uploads folder
    uploads_directory = os.environ.get('UPLOAD_FOLDER')
    return send_from_directory(uploads_directory, filename, as_attachment=True)

# apply for job submission


@app.route("/api/apply_job/<int:job_id>", methods=["POST"])
@jwt_required()
def apply_job(job_id):
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify({"message": "User not found", "success": False}), 404

        job_listing = JobListing.query.filter_by(id=job_id).first()
        if not job_listing:
            return jsonify({"message": "Job listing not found", "success": False}), 404

        applicant_name = request.form.get('applicant_name')
        applicant_email = request.form.get('applicant_email')

        resume = request.files.get('resume')
        resume_filename = secure_filename(resume.filename) if resume else ""
        resume_url = f"/uploads/{resume_filename}" if resume_filename else ""

        cover_letter = request.files.get('cover_letter')
        cover_letter_filename = secure_filename(cover_letter.filename) if cover_letter else ""
        cover_letter_url = f"/uploads/{cover_letter_filename}" if cover_letter_filename else ""

        if job_listing.listing_type == 'self':
            # Save other application details to the database
            application = Application(
                job_listing_id=job_listing.id,
                user_id=user.id,
                applicant_name=applicant_name,
                applicant_email=applicant_email,
                resume=resume_url,
                cover_letter=cover_letter_url
            )

            db.session.add(application)
            db.session.commit()

            # Send email to the employer if applicant_email is provided
            if applicant_email:
                employer_email = job_listing.application_email
                job_title = job_listing.title

                msg = Message("New Job Application",
                              sender="info@johnteacher.tech",
                              recipients=[employer_email])

                msg.body = f"Job Title: {job_title}\n\n" \
                           f"Applicant Name: {applicant_name}\n" \
                           f"Applicant Email: {applicant_email}\n" \
                           f"Resume: {resume_url}\n" \
                           f"Cover Letter: {cover_letter_url}"

                # Attach resume and cover letter as downloadable links
                if resume:
                    resume_path = os.path.join(
                        app.config['UPLOAD_FOLDER'], resume_filename)
                    resume.save(resume_path)
                    with app.open_resource(resume_path) as resume_file:
                        msg.attach(
                            resume_filename,
                            "application/octet-stream",
                            resume_file.read())
                    os.remove(resume_path)
                if cover_letter:
                    cover_letter_path = os.path.join(
                        app.config['UPLOAD_FOLDER'], cover_letter_filename)
                    cover_letter.save(cover_letter_path)
                    with app.open_resource(cover_letter_path) as cover_letter_file:
                        msg.attach(
                            cover_letter_filename,
                            "application/octet-stream",
                            cover_letter_file.read())
                    os.remove(cover_letter_path)

                mail.send(msg)

            return jsonify({"message": "Job application submitted and sent to employer's mail successfully", "success": True}), 200
            
        elif job_listing.listing_type == 'third party':
            if applicant_email and job_listing.application_link:
                    # Send email to the employer

                employer_email = job_listing.application_email
                job_title = job_listing.title

                msg = Message("New Job Application",
                            sender="info@johnteacher.tech",
                            recipients=[employer_email])

                msg.body = f"Job Title: {job_title}\n\n" \
                            f"Applicant Name: {applicant_name}\n" \
                            f"Applicant Email: {applicant_email}\n" \
                            f"Resume: {resume_url}\n" \
                            f"Cover Letter: {cover_letter_url}"
                    

                # Attach resume and cover letter as downloadable links
                if resume:
                    resume_path = os.path.join(
                        app.config['UPLOAD_FOLDER'], resume_filename)
                    resume.save(resume_path)
                    with app.open_resource(resume_path) as resume_file:
                        msg.attach(
                            resume_filename,
                            "application/octet-stream",
                            resume_file.read())
                    os.remove(resume_path)
                if cover_letter:
                    cover_letter_path = os.path.join(
                        app.config['UPLOAD_FOLDER'], cover_letter_filename)
                    cover_letter.save(cover_letter_path)
                    with app.open_resource(cover_letter_path) as cover_letter_file:
                        msg.attach(
                            cover_letter_filename,
                            "application/octet-stream",
                            cover_letter_file.read())
                    os.remove(cover_letter_path)
                mail.send(msg)

                return jsonify({"message": "Job application submitted and email sent to employer", "success": True}), 200

            if applicant_email:
                # Send email to the employer
                print("Sending email to the employer")

                employer_email = job_listing.application_email
                job_title = job_listing.title

                msg = Message("New Job Application",
                            sender="info@johnteacher.tech",
                            recipients=[employer_email])

                msg.body = f"Job Title: {job_title}\n\n" \
                        f"Applicant Name: {applicant_name}\n" \
                        f"Applicant Email: {applicant_email}\n" \
                        f"Resume: {resume_url}\n" \
                        f"Cover Letter: {cover_letter_url}"

                    # Attach resume and cover letter as downloadable links
                if resume:
                    resume_path = os.path.join(
                        app.config['UPLOAD_FOLDER'], resume_filename)
                    resume.save(resume_path)
                    with app.open_resource(resume_path) as resume_file:
                        msg.attach(
                            resume_filename,
                            "application/octet-stream",
                            resume_file.read())
                    os.remove(resume_path)
                if cover_letter:
                    cover_letter_path = os.path.join(
                        app.config['UPLOAD_FOLDER'], cover_letter_filename)
                    cover_letter.save(cover_letter_path)
                    with app.open_resource(cover_letter_path) as cover_letter_file:
                        msg.attach(
                            cover_letter_filename,
                            "application/octet-stream",
                            cover_letter_file.read())
                    os.remove(cover_letter_path)
                mail.send(msg)

                return jsonify({"message": "Job application submitted and email sent to employer", "success": True}), 200

            if job_listing.application_link:
                # Redirect to third-party link if only link is present
                print("Redirecting to third-party link")
                return jsonify({"message": "Redirecting to third party application link", "success": True,
                                "redirect_url": job_listing.application_link}), 200

            # No email or link provided
            return jsonify({"message": "No applicant email or application link provided", "success": False}), 400
        
    except Exception as e:
        return jsonify({"message": "Error occurred while applying for job",
                        "success": False, "error": str(e)}), 500





# Retrieve all jobs applied to by a given user
@app.route("/api/applications/applied", methods=["GET"])
@jwt_required()
def get_applied_applications():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify(
                {"message": "User not found", "success": False}), 404

        applications = Application.query.filter_by(user_id=user.id).all()

        # You can customize the response format as per your application's needs
        application_list = []
        for application in applications:
            job_listing = JobListing.query.get(application.job_listing_id)
            if job_listing:
                application_data = {
                    "id": application.id,
                    "job_listing_id": application.job_listing_id,
                    "job_title": job_listing.title,  # Add job title to response
                    "location": job_listing.location,
                    "applicant_name": application.applicant_name,
                    "applicant_email": application.applicant_email,
                    "resume": application.resume,
                    "cover_letter": application.cover_letter,
                    "created_at": application.created_at,
                }
                application_list.append(application_data)

        return jsonify(
            {"applications": application_list, "success": True}), 200

    except Exception as e:
        return jsonify({"message": "Error occurred while retrieving applied applications",
                        "success": False, "error": str(e)}), 500


# get all jobs posted by the user
@app.route("/api/applications/listings", methods=["GET"])
@jwt_required()
def get_listing_applications():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify({"message": "User not found", "success": False}), 404

        job_listings = JobListing.query.filter_by(user_id=user.id).all()

        listing_data = []
        for listing in job_listings:
            listing_data.append({
                "job_listing_id": listing.id,
                "title": listing.title,
                "description": listing.description,
                "location": listing.location,
                "salary": listing.salary,
                "listing_type": listing.listing_type,
                "application_email": listing.application_email,
                "application_link": listing.application_link,
                "created_at": listing.created_at,
                "updated_at": listing.updated_at
            })

        return jsonify({"listings": listing_data, "success": True}), 200

    except Exception as e:
        return jsonify({"message": "Error occurred while retrieving listing applications",
                        "success": False, "error": str(e)}), 500
    

# Route for sending feedback via email
@app.route("/api/send_feedback", methods=["POST"])
# @jwt_required()
def send_feedback():
    try:
        # Parse JSON data from the request
        data = request.json

        feedback_type = data.get('feedback_type')
        job_title = data.get('job_title')
        date = data.get('date')
        comments = data.get('comments')

        # Create and send feedback email
        msg = Message("Feedback Submission",
                      sender="info@johnteacher.tech",
                      recipients=["ofemjohn@gmail.com"])  # Replace with the recipient's email address

        msg.body = f"Feedback Type: {feedback_type}\n\n" \
                   f"Job Title: {job_title}\n" \
                   f"Date: {date}\n" \
                   f"Comments: {comments}"

        mail.send(msg)

        return jsonify({"message": "Feedback sent successfully", "success": True}), 200

    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
    




# Backend route to handle admin login
@app.route("/api/admin-login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if the provided username and password match the admin credentials
    if username == "admin" and password == "adminpassword":
        # Assuming you use the same JWT secret key for both user and admin authentication
        access_token = create_access_token(identity=username, additional_claims={"is_admin": True})
        return jsonify({"success": True, "message": "Admin logged in successfully", "access_token": access_token})
    else:
        return jsonify({"success": False, "message": "Invalid admin credentials"})



# Retrieve all applied jobs (applications) for admin
@app.route("/api/admin/all-applied-jobs", methods=["GET"])
def get_all_applied_jobs():
    try:
        # Fetch all applications
        applications = Application.query.all()

        # You can customize the response format as per your application's needs
        application_list = []
        for application in applications:
            job_listing = JobListing.query.get(application.job_listing_id)
            if job_listing:
                application_data = {
                    "id": application.id,
                    "job_listing_id": application.job_listing_id,
                    "job_title": job_listing.title,  # Add job title to response
                    "location": job_listing.location,
                    "applicant_name": application.applicant_name,
                    "applicant_email": application.applicant_email,
                    "resume": application.resume,
                    "cover_letter": application.cover_letter,
                    "created_at": application.created_at,
                }
                application_list.append(application_data)

        return jsonify(
            {"applications": application_list, "success": True}), 200

    except Exception as e:
        return jsonify({"message": "Error occurred while retrieving applied applications",
                        "success": False, "error": str(e)}), 500


# Route to approve a job by the admin
@app.route("/api/admin/approve-job/<int:job_id>", methods=["PUT"])
def approve_job(job_id):
    try:
        # Retrieve the job by its ID
        job = JobListing.query.get(job_id)

        # Check if the job exists
        if not job:
            return jsonify({"message": "Job not found", "success": False}), 404

        # Set the job's approval status to True
        job.approved = True

        # Commit the changes to the database
        db.session.commit()

        # Return a success response
        return jsonify({"message": "Job approved successfully", "success": True}), 200

    except Exception as e:
        # If an error occurs, rollback the changes and return an error response
        db.session.rollback()
        return jsonify({"message": "Error occurred while approving job", "success": False, "error": str(e)}), 500
    

# Route to fetch all posted jobs for approval by the admin
@app.route("/api/admin/all-posted-jobs", methods=["GET"])
def get_all_posted_jobs():
    try:
        # Query all jobs with the approved status as False
        posted_jobs = JobListing.query.filter_by(approved=False).all()

        # Convert the jobs to a list of dictionaries
        job_listings = [job.to_dict() for job in posted_jobs]

        # Return the job listings in the response
        return jsonify({"job_listings": job_listings, "success": True}), 200

    except Exception as e:
        # If an error occurs, return an error response
        return jsonify({"message": "Error occurred while fetching posted jobs", "success": False, "error": str(e)}), 500


# Route to delete a job by the admin
@app.route("/api/admin/delete-job/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    try:
        # Retrieve the job by its ID
        job = JobListing.query.get(job_id)

        # Check if the job exists
        if not job:
            return jsonify({"message": "Job not found", "success": False}), 404

        # Delete the job from the database
        db.session.delete(job)
        db.session.commit()

        # Return a success response
        return jsonify({"message": "Job deleted successfully", "success": True}), 200

    except Exception as e:
        # If an error occurs, rollback the changes and return an error response
        db.session.rollback()
        return jsonify({"message": "Error occurred while deleting job", "success": False, "error": str(e)}), 500
    

# Route to delete jobs with a deadline date later than the current date
@app.route("/api/admin/delete-expired-jobs", methods=["DELETE"])
def delete_expired_jobs():
    try:
        # Get the current date and time
        current_datetime = datetime.now(timezone.utc)

        # Query jobs with a deadline date later than the current date
        expired_jobs = JobListing.query.filter(JobListing.application_deadline < current_datetime).all()

        # Delete each expired job and associated applications from the database
        for job in expired_jobs:
            db.session.delete(job)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Expired jobs deleted successfully", "success": True}), 200

    except Exception as e:
        # If an error occurs, rollback the changes and return an error response
        db.session.rollback()
        return jsonify({"message": "Error deleting expired jobs", "success": False, "error": str(e)}), 500



if __name__ == '__main__':
    DB.create_all()
    app.run(debug=True, port=5000)
