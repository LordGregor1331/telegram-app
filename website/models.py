# -*- coding: utf-8 -*-
from flask_login import UserMixin
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from sqlalchemy import Date

from website import db


class Referral(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('users.tg_id'), nullable=False)
    referred_user_id = db.Column(db.Integer, db.ForeignKey('users.tg_id'), nullable=False)
    referrer_rewards = db.Column(db.Float, nullable=False, default=0.0)

    # Relationship to access the referred user
    referred_user = db.relationship('Users', foreign_keys=[referred_user_id])

class Users(db.Model, UserMixin):
    __tablename = 'users'
    id = db.Column(db.Integer, primary_key=True)
    tg_id = db.Column(db.Integer, unique=True)
    tg_username = db.Column(db.String(80), unique=False, nullable=True)
    tg_first_name = db.Column(db.String(25), nullable=True)
    tg_last_name = db.Column(db.String(25), nullable=True)
    tg_is_premium = db.Column(db.Boolean, default=False)

    total_balance = db.Column(db.Float, nullable=False, default=0.0)

    referrals = db.relationship('Referral', foreign_keys=[Referral.referrer_id], backref='referrer', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'