import { model, Schema, Types } from "mongoose";
import { UrlDocument, UrlModelInterface } from "../interfaces/url";


const urlSchema = new Schema(
    {
      original_url: { type: String, required: true },
      short_id: { type: String, required: true, unique: true },
      short_url: {type: String, required: true },
      expiration_date: { type: Date },
      starting_date: { type: Date, default: Date.now() },
      app_id: { type: Types.ObjectId },
      title: String,
      description: String,
      status: {
        type: String,
        enum: ['active', 'expired', 'draft'],
        default: 'active',
      },
      stats: { total_visitor: { type: Number, default: 0 } },
    },
    { timestamps: true }
  );
  
  const UrlModel = model<UrlDocument, UrlModelInterface>('urls', urlSchema);

  export default UrlModel;

