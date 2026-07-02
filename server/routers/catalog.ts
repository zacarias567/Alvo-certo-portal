import { publicProcedure, router } from "../_core/trpc";
import { getWeapons, getAmmunition, getCourses } from "../db";

export const catalogRouter = router({
  weapons: publicProcedure.query(async () => {
    return getWeapons();
  }),

  ammunition: publicProcedure.query(async () => {
    return getAmmunition();
  }),

  courses: publicProcedure.query(async () => {
    return getCourses();
  }),
});
