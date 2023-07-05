from db.models import JobListing
from sqlalchemy import func
import re
from db.db import db
from sqlalchemy.orm.exc import NoResultFound
import math
from db.models import JobListing


# check if email address exists
def is_email_address_available(email: str) -> bool:
    existing_user = JobListing.query.filter(func.lower(
        JobListing.email) == func.lower(email)).first()
    return existing_user is not None


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


class Joblist:
    @staticmethod
    def create_job_listing(data: dict) -> JobListing:
        application_email = data.get('application_email', None)
        application_link = data.get('application_link', None)

        if not application_email and not application_link:
            raise ValueError(
                "Either application_email or application_link is required to create a JobListing")

        new_job_listing = add_joblisting(data)
        return new_job_listing

    @staticmethod
    def job_listing_by_id(id: int) -> JobListing:
        Joblisting = find_joblisting(id=id)
        return Joblisting.to_dict()

    @staticmethod
    def paginate_results(
            results: list,
            page: int,
            per_page: int) -> JobListing:
        total_results = len(results)
        total_pages = math.ceil(total_results / per_page)

        if page < 1 or page > total_pages:
            return [], 0

        start_index = (page - 1) * per_page
        end_index = start_index + per_page

        paginated_results = results[start_index:end_index]

        return paginated_results, total_pages
