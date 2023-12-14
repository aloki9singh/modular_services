import {Document, Model} from 'mongoose';
import { AdminUserRole } from './enums';

export interface User{
    role: AdminUserRole;
    email: string;
    password: string;
};

export interface UserDocument extends Document, User{ };

export interface UserModelInterface extends Model<UserDocument>{};