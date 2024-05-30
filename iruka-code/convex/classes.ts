import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const archive = mutation({
  args: {
    classId: v.id('classes'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const existgingClass = await ctx.db.get(args.classId);

    if (!existgingClass) {
      throw new Error('Class not found');
    }

    const _class = await ctx.db.patch(args.classId, {
      is_archived: true,
    });

    return _class;
  },
});

export const getSidebar = query({
  args: {
    project_id: v.optional(v.id('projects')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const classes = await ctx.db
      .query('classes')
      .withIndex('by_project_id', (q) => q.eq('project_id', args.project_id!))
      .filter((q) => q.eq(q.field('is_archived'), false))
      .order('desc')
      .collect();

    return classes;
  },
});
