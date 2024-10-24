# -*- coding: utf-8 -*-
from flask_login import UserMixin
from sqlalchemy import ForeignKey, func, DateTime
from sqlalchemy.orm import relationship
from website import db
from datetime import datetime


class Referral(db.Model):
    __tablename = 'referrals'

    id = db.Column(db.Integer, primary_key=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    referred_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    referrer_rewards = db.Column(db.Float, nullable=False, default=0.0)

    # Relationships to access the referrer and referred user
    referrer = db.relationship('Users', foreign_keys=[referrer_id], backref='referrals_made', lazy=True)
    referred_user = db.relationship('Users', foreign_keys=[referred_user_id], backref='referrals_received', lazy=True)

    def __repr__(self):
        return f'<Referral from {self.referrer.tg_username} to {self.referred_user_name}>'


class Users(db.Model, UserMixin):
    __tablename = 'users'

    id = db.Column(db.Integer, primary_key=True)
    tg_id = db.Column(db.Integer, unique=True, nullable=False)
    tg_username = db.Column(db.String(80), nullable=True)
    tg_first_name = db.Column(db.String(25), nullable=True)
    tg_last_name = db.Column(db.String(25), nullable=True)
    tg_is_premium = db.Column(db.Boolean, default=False)

    # User game attributes
    level = db.Column(db.Integer, default=1)
    profit_per_hour = db.Column(db.Float, default=0.0)
    storage_lvl = db.Column(db.Integer, default=1)
    storage_max_volume = db.Column(db.Float, default=1000.0)
    is_autoclick_on = db.Column(db.Boolean, default=False)
    last_egg_coin_exchange = db.Column(DateTime, default=func.now())
    egg_balance = db.Column(db.Float, default=0.0)
    coin_balance = db.Column(db.Float, nullable=False, default=0.0)
    food_balance = db.Column(db.Integer, nullable=False, default=300)
    food_balance_max = db.Column(db.Integer, nullable=False, default=300)
    tap_lvl = db.Column(db.Integer, default=1)
    energy_lvl = db.Column(db.Integer, default=1)

    # NFTs owned by this user
    nfts = db.relationship('NFT', backref='owner', lazy=True)

    def __repr__(self):
        return f'<User {self.tg_username}>'


class NFT(db.Model):
    __tablename = 'nft'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=True)  # Nullable: Can be for sale without an owner
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    mint_address = db.Column(db.String(100), nullable=False, unique=True)
    picture_path = db.Column(db.String(255), nullable=False)

    # Relationship to NFT for sale
    sale_info = db.relationship('NFTForSale', uselist=False, back_populates='nft', cascade="all, delete-orphan")

    def __repr__(self):
        return f'<NFT {self.name} - {self.mint_address}>'


class NFTForSale(db.Model):
    __tablename = 'nft_for_sale'

    id = db.Column(db.Integer, primary_key=True)
    nft_id = db.Column(db.Integer, db.ForeignKey('nft.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    is_limited = db.Column(db.Boolean, default=False)
    limit_finish_datetime = db.Column(DateTime, nullable=True)

    # Relationship to NFT
    nft = db.relationship('NFT', back_populates='sale_info')

    def __repr__(self):
        return f'<NFTForSale {self.nft.name} for {self.price}>'
