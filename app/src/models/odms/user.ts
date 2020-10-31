import { UserInterface, UserRole } from '../interfaces/user'
import { Document, model, Schema, Model } from 'mongoose'
import { ProfileSchema } from './profile'
import { hash, compare } from 'bcrypt'

export interface UserDocument extends UserInterface, Document {
  isValidPassword(password: string): Promise<boolean>
}

export interface UserModel extends Model<UserDocument> {
  findByIdentifier(identifier: string): Promise<UserDocument | null>
}

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  role: {
    type: UserRole,
    required: true,
  },
  profile: ProfileSchema,
})

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument
  const hashed = await hash(user.password, 10)
  user.password = hashed
  next()
})

UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this as UserDocument
  return await compare(password, user.password)
}

UserSchema.statics.findByIdentifier = async (identifier: string) => {
  return await UserODM.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  })
}

export const UserODM = model<UserDocument, UserModel>('User', UserSchema)
