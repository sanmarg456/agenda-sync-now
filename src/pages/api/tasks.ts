import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '@/lib/prisma';
import { Task } from '@/types';

const prisma = getPrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        include: {
          subtasks: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else if (req.method === 'POST') {
    try {
      const taskData = req.body as Omit<Task, 'id'>;
      const newTask = await prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
          completed: taskData.completed,
          duration: taskData.duration,
          timeBlock: taskData.timeBlock ? JSON.stringify(taskData.timeBlock) : null,
          userId: 'user-id', // TODO: Replace with actual user ID from auth
        },
        include: {
          subtasks: true,
        },
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 