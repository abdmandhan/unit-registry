import { z } from "zod";
import { prisma } from "~~/server/utils/db";
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { username, password } = z
    .object({
      username: z.string().min(1),
      password: z.string().min(1),
    })
    .parse(body);

  const user = await prisma.users.findFirst({
    where: {
      is_active: true,
      OR: [{ username }, { email: username }],
    },
  });
  console.log('user', user)

  if (!user || !user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    },
    loggedInAt: Date.now(),
  });

  return { success: true };
});

