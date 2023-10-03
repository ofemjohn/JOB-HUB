from datetime import datetime
from db.db import db


class User(db.Model):
    '''the class representing'''
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(250), nullable=False)
    phone = db.Column(db.String(100), nullable=False)
    Country = db.Column(db.String(100), nullable=False)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow)

    job_listings = db.relationship('JobListing', backref='user', cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='user', cascade='all, delete-orphan')

    def to_dict(self):
        '''Return a dictionary'''
        return {
            "username": self.username,
            "email": self.email,
            "address": self.address,
            "phone": self.phone,
            "country": self.Country,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class JobListing(db.Model):
    '''Listing model'''
    __tablename__ = 'job_listings'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description  = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100))
    salary = db.Column(db.String(250))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    listing_type = db.Column(db.String(20),
                             nullable=False)  # 'self' or 'third_party'
    # Required for self-posted listings
    application_email = db.Column(db.String(100))
    # Required for third-party listings
    job_type = db.Column(db.String(20), nullable=True)  # Full-time, Part-time, Contract, etc.
    skills_required = db.Column(db.Text, nullable=True)  # Comma-separated list of skills
    experience_level = db.Column(db.String(100), nullable=True)  # Entry-level, Mid-level, Senior, etc.
    application_deadline = db.Column(db.DateTime, nullable=True)  # Deadline for applications
    approved = db.Column(db.Boolean, default=False, nullable=False)


    application_link = db.Column(db.String(200))
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow)
    


    applications = db.relationship('Application', backref='job_listing', cascade='all, delete-orphan')

    def to_dict(self):
        '''Return a dictionary'''
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "salary": self.salary,
            "user_id": self.user_id,
            "listing_type": self.listing_type,
            "application_email": self.application_email,
            "application_link": self.application_link,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "job_type": self.job_type,
            "skills_required": self.skills_required,
            "experience_level": self.experience_level,
            "application_deadline": self.application_deadline,
            "approved": self.approved
        }


class Application(db.Model):
    '''Application model'''
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    job_listing_id = db.Column(
        db.Integer,
        db.ForeignKey('job_listings.id'),
        nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    applicant_name = db.Column(db.String(100), nullable=False)
    applicant_email = db.Column(db.String(100), nullable=False)
    resume = db.Column(db.Text)
    cover_letter = db.Column(db.Text)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow)

    def to_dict(self):
        '''Return a dictionary'''
        return {
            "id": self.id,
            "job_listing_id": self.job_listing_id,
            "user_id": self.user_id,
            "applicant_name": self.applicant_name,
            "applicant_email": self.applicant_email,
            "resume": self.resume,
            "cover_letter": self.cover_letter,
            "created_at": self.created_at
        }
