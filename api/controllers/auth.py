'''Module to handle all authentication requests'''
from db.models import User
from sqlalchemy import func
import uuid
import bcrypt
from db.db import DB
from sqlalchemy.orm.exc import NoResultFound
from db.db import db
import bcrypt
import re


# check if email address exists
def is_email_address_available(email: str) -> bool:
    existing_user = User.query.filter(func.lower(
        User.email) == func.lower(email)).first()
    return existing_user is not None

# Function to validate email format


def is_valid_email(email: str) -> bool:
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email) is not None


# generate uuid
def generate_uuid() -> str:
    return str(uuid.uuid4())


# password hash algorithm
def password_hash(password: str) -> str:
    encode_pwd = password.encode('utf-8')
    hash_pwd = bcrypt.hashpw(encode_pwd, bcrypt.gensalt())
    return hash_pwd

# add a user to the database


def add_user(data) -> User:
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    user_obj = User.query.filter(User.id == user.id).first()
    return user_obj

# find user and filter by arguments


def find_user_by(**kwargs: any) -> User:
    query = User.query.filter_by(**kwargs).first()
    if query is None:
        raise NoResultFound
    return query


# Update user with the given user key word argument
def set_attributes(obj, **kwargs):
    for key, value in kwargs.items():
        if hasattr(obj, key):
            setattr(obj, key, value)
    return obj


class Auth:
    @staticmethod
    def register_user(data: dict) -> User:
        password = data.pop('password', None)
        email = data.pop('email', None)
        try:
            find_user_by(email=email)
            raise ValueError('f"user with email {email} already registered"')
        except NoResultFound:
            pwd = password_hash(password)
            data['password'] = pwd
            data['email'] = email
            new_user = add_user(data)
            return new_user

    @staticmethod
    def valid_login(email: str, password: str) -> bool:
        try:
            user = find_user_by(email=email)
            if bcrypt.checkpw(
                    password.encode('utf-8'),
                    user.password.encode('utf-8')):
                return True
        except NoResultFound:
            return False
        else:
            return False
