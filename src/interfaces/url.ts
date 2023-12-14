import mongoose, { Document, Model, Types } from 'mongoose';

interface URL extends Document {
    original_url: string;
    short_id: string;
    short_url: string;
    expiration_date?: Date;
    starting_date: Date;
    app_id?: Types.ObjectId;
    title?: string;
    description?: string;
    status: 'active' | 'expired' | 'draft';
    stats: { total_visitor: number };
    createdAt: Date;
    updatedAt: Date;
  }

  export interface UrlDocument extends Document, URL{ };

export interface UrlModelInterface extends Model<UrlDocument>{};