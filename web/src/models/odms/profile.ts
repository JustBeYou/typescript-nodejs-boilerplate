import { Document, Schema, model } from 'mongoose'
import { ProfileInterface } from '../interfaces/profile'

export const NO_IMAGE = ''

export interface ProfileDocument extends ProfileInterface, Document {}
export const ProfileSchema = new Schema({
    headline: {
        type: String,
        required: true,
        default: "I'm new here!",
    },
    description: {
        type: String,
        required: true,
        default: '...',
    },
    image: {
        type: String,
        default: NO_IMAGE,
    },
})
export const ProfileODM = model<ProfileDocument>('Profile', ProfileSchema)
