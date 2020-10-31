import { Document, Schema, model } from 'mongoose'
import { ProfileInterface } from '../interfaces/profile'

export interface ProfileDocument extends ProfileInterface, Document {}
export const ProfileSchema = new Schema({
  headline: String,
  description: String,
})
export const ProfileODM = model<ProfileDocument>('Profile', ProfileSchema)
