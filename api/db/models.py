from datetime import datetime
from db.db import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    job_listings = db.relationship('JobListing', backref='user')
    applications = db.relationship('Application', backref='user')

    def __init__(self, username, email, password, role):
        self.username = username
        self.email = email
        self.password = password
        self.role = role

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "role": self.role,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class JobListing(db.Model):
    __tablename__ = 'job_listings'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100))
    salary = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    email = db.Column(db.String(100))
    application_link = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    applications = db.relationship('Application', backref='job_listing')

    def __init__(self, title, description, location=None, salary=None, email=None, application_link=None):
        self.title = title
        self.description = description
        self.location = location
        self.salary = salary
        self.email = email
        self.application_link = application_link

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "salary": self.salary,
            "user_id": self.user_id,
            "email": self.email,
            "application_link": self.application_link,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    job_listing_id = db.Column(db.Integer, db.ForeignKey('job_listings.id'))
    cover_letter = db.Column(db.Text)
    resume_public_id = db.Column(db.String(100))
    resume_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, user_id, job_listing_id, cover_letter, resume_public_id=None, resume_url=None):
        self.user_id = user_id
        self.job_listing_id = job_listing_id
        self.cover_letter = cover_letter
        self.resume_public_id = resume_public_id
        self.resume_url = resume_url

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "job_listing_id": self.job_listing_id,
            "cover_letter": self.cover_letter,
            "resume_public_id": self.resume_public_id,
            "resume_url": self.resume_url,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
