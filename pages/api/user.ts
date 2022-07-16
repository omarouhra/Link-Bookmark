import type { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await getUsers(req, res);
  } else if (req.method === "POST") {
    return await getUserBookmark(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error getting Users", success: false });
  }
}

async function getUserBookmark(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  try {
    const users = await prisma.user.findFirst({
      where: {
        id: body.id,
      },
      include: {
        bookmarks: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error getting Users", success: false });
  }
}
