import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password: string;
  walletAddress?: string;
  nftTokenId?: string;
  verificationLevel: number;
  earningsTotal: number;
  profile: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    country?: string;
  };
  settings: {
    emailNotifications: boolean;
    privacyLevel: 'public' | 'private' | 'selective';
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  walletAddress: { 
    type: String, 
    sparse: true 
  },
  nftTokenId: { 
    type: String, 
    sparse: true 
  },
  verificationLevel: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  earningsTotal: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    country: String
  },
  settings: {
    emailNotifications: { 
      type: Boolean, 
      default: true 
    },
    privacyLevel: { 
      type: String, 
      enum: ['public', 'private', 'selective'], 
      default: 'private' 
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLoginAt: Date,
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

// Create indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ walletAddress: 1 }, { sparse: true });
UserSchema.index({ verificationLevel: 1, createdAt: -1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update the updatedAt field on save
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser, UserModel>('User', UserSchema);

