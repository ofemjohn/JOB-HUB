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
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


    job_listings = db.relationship('JobListing', backref='user')
    applications = db.relationship('Application', backref='user')

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
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100))
    salary = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    application_email = db.Column(db.String(100))
    application_link = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    applications = db.relationship('Application', backref='job_listing')


    def to_dict(self):
        '''Return a dictionary'''
        return {
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "salary": self.salary,
            "user_id": self.user_id,
            "application_email": self.application_email,
            "application_link": self.application_link,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Application(db.Model):
    '''Application model for the application'''
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    job_listing_id = db.Column(db.Integer, db.ForeignKey('job_listings.id'))
    cover_letter = db.Column(db.Text)
    resume_public_id = db.Column(db.String(100))
    resume_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


    def to_dict(self):
        '''return a dictionary'''
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
