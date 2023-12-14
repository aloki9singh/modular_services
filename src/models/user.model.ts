import {model,Schema} from 'mongoose';
import {UserDocument, UserModelInterface} from '@interfaces/user';


const userSchema = new Schema({
    password: String
},{timestamps: true});

const UserModel = model<UserDocument,UserModelInterface>('User',userSchema);

export default UserModel;