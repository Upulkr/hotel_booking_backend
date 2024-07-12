import { hashSync, compareSync } from "bcrypt";
import { prismaclient } from "./../../index.js";
import { JWT_SECRET } from "../secrets.js";

import jwt from "jsonwebtoken";
import { BadRequestsException } from "./../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { SignupSchema } from "../schema/users.js";

export const signup = async (req, res, next) => {
  try {
    SignupSchema.parse(req.body);
    const { email, password, name } = req.body;

    let user = await prismaclient.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      return next(
        new BadRequestsException(
          "user already exists",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaclient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.json(user);
  } catch (error) {
    next(
      new UnprocessableEntity(
        error?.issues,
        "Unprocessable enitiy",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user = await prismaclient.user.findFirst({
    where: { email },
    include: { bookings: true },
  });

  if (!user) {
    return next(
      new BadRequestsException(
        "user does not  exists",
        ErrorCode.USER_NOT_FOUND
      )
    );
  }
  if (!compareSync(password, user.password)) {
    return next(
      new BadRequestsException("wrong password", ErrorCode.INCORRECT_PASSWORD)
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({ user, token });
};
