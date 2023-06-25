import speakeasy from 'speakeasy';
import bcrypt from 'bcrypt';

import UserModel from "../models/user";

import { User } from "../../shared/types/models";
import { Document } from 'mongoose';

const activateTFA = async (userID: string, tfaToken: string, tfaCode: string) => {
    const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
    if (!user) return "unauthorized";

    if (user.tfa.secret !== "") return "unauthorized";

    const verified = speakeasy.totp.verify({
        secret: tfaToken,
        encoding: "base32",
        token: tfaCode,
    });

    if (verified == false) return "invalid-code";

    // Update the secret
    user.tfa.secret = tfaToken;
    user.save();

    return "done";
}

const deactivateTFA = async (userID: string, password: string) => {
    const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
    if (!user) return "unauthorized";

    if (!bcrypt.compareSync(password, user.password)) return "invalid-password";

    if (user.tfa.secret == "") return "unauthorized";
    user.tfa.secret = "";
    user.save();

    return "done";
}

export { activateTFA, deactivateTFA }