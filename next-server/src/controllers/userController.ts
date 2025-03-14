import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";


const prisma = new PrismaClient()


export const createUser = async (req: Request, res: Response) => {

}


export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await prisma.users.findMany()
    res.status(200).json({
      users: user
    })
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' })
  }
}