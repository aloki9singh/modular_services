
import {model,Schema, Types} from 'mongoose';
import { LogDocument, LogModelInterface } from '../interfaces/log';

// Created the Schema for log
const logSchema= new Schema({
    url_id: { type: Types.ObjectId, ref: 'urls' },
    ip_address: { type: String, required: true },
    visit_time: { type: Date },
    referrer: { type: String }
  });
  
  const LogModel = model<LogDocument, LogModelInterface>('logs', logSchema);
  

  export default LogModel;

