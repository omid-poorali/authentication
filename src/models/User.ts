import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
};

export interface IUser {
    username: string;
    password: string;
    role: string;
}

interface UserDoc extends mongoose.Document {
    username: string;
    password: string;
    role: string;
    isPasswordCorrect(providedPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDoc>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: [8, 'Username too short'],
            maxLength: [40, 'Username too long'],
            validate: {
                validator: async function (v: string): Promise<boolean> {
                    const doc = await User.findOne({ username: v });
                    // @ts-expect-error I don't know
                    if (doc) return this._id.toString() === doc._id.toString();
                    else return Boolean(!doc);
                },
                message: 'Username already in use.'
            }
        },
        password: {
            type: String,
            required: true,
            minLength: [8, 'Password too short'],
            maxLength: [120, 'Password too long']
        },
        role: {
            type: String,
            required: true,
            enum: [ROLES.USER, ROLES.ADMIN],
            default: ROLES.USER
        }
    },
    // Created at and updated at timestamps
    { timestamps: true }
);

// Hash the password prior to saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare passwords, instance method for the user
userSchema.method('isPasswordCorrect', async function (providedPassword: string): Promise<boolean> {
    return await bcrypt.compare(providedPassword, this.password);
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    }
});

const User = mongoose.model<UserDoc>('User', userSchema);

export { User };
