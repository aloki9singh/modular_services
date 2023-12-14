import mongoose, { Document, Types, Model } from 'mongoose';

export interface Log extends Document {
  url_id: Types.ObjectId | string;
  ip_address: string;
  visit_time?: Date;
  referrer: string;
}

export interface LogDocument extends Document, Log{ };


export interface LogModelInterface extends Model<LogDocument>{};

