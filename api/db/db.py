from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity


db = SQLAlchemy()
load_dotenv()

class DB:
    '''database class'''
    def __init__(self, app=None):
        self.app = app
        self.db = db
        self.session = db.session

        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

        db.init_app(app)


    def create_all(self):
        '''Create all the database tables with the SQLAlchemy object.'''
        with self.app.app_context():
            self.db.create_all()

    def drop_all(self):
        '''Drop all the database tables with the SQLAlchemy object.'''
        with self.app.app_context():
            self.db.drop_all()

    def save(self, user):
        '''Save the database'''
        self.db.session.add(user)
        self.db.session.commit()

    def delete(self, user):
        '''delete a user from the database'''
        self.db.session.delete(user)
        self.db.session.commit()

                                        
                                                           
    
