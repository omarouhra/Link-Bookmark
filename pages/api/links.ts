import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { useSession } from "next-auth/react";

import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await getServerSession({ req, res }, authOptions);
  // if (!session) return res.status(401).end();
  // const { data: session } = useSession();
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    return await getLinks(req, res, session);
  } else if (req.method === "POST") {
    return await addLink(req, res, session);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getLinks(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  if (!session.user.id) {
    return res.status(500).end("Server failed to get session user ID");
  }
  try {
    const links = await prisma.link.findMany({
      where: {
        userId: session?.user?.id,
      },
    });
    return res.status(200).json(links);
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error getting books", success: false });
  }
}

async function addLink(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  const body = req.body;
  try {
    const newLink = await prisma.link.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        url: body.url,
        category: body.category,
        description: body.description,
        userId: body.userId,
      },
    });
    return res.status(200).json(newLink);
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error adding book", success: false });
  }
}
