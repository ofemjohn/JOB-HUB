from db.models import JobListing
from sqlalchemy import func
import re
from db.db import db
from sqlalchemy.orm.exc import NoResultFound


# check if email address exists
def is_email_address_available(email: str) -> bool:
    existing_user = JobListing.query.filter(func.lower(
        JobListing.email) == func.lower(email)).first()
    return existing_user is not None


# Function to validate email format
def is_valid_email(email: str) -> bool:
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email) is not None


# Add Joblisting
def add_joblisting(data) -> JobListing:
    joblisting = JobListing(**data)
    db.session.add(joblisting)
    db.session.commit()
    user_obj = JobListing.query.filter(JobListing.id == joblisting.id).first()
    return user_obj


# find Joblisting and filter by arguments
def find_joblisting(**kwargs: any) -> JobListing:
    query = JobListing.query.filter_by(**kwargs).first()
    if query is None:
        raise NoResultFound
    return query


# Update Joblisting with the given user key word argument
def set_joblisting_attributes(obj, **kwargs):
    for key, value in kwargs.items():
        if hasattr(obj, key):
            setattr(obj, key, value)
    return obj


class Auth:
    @staticmethod
    def create_job_listing(data: dict) -> JobListing:
        application_email = data.pop('application_email', None)
        application_link = data.pop('application_link', None)

        if not application_email and not application_link:
            raise ValueError(
                "Either application_email or application_link is required to create a JobListing")

        new_job_listing = add_joblisting(data)
        return new_job_listing
