import { createTRPCRouter } from '../init';
import { userRouter } from './User';
import { projectRouter } from './Project';
import { aiRouter } from './Ai';

export const appRouter = createTRPCRouter({
  user: userRouter,
  project: projectRouter,
  Ai: aiRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;