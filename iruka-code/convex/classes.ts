import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
      .order('desc')
      .collect();

    return classes;
  },
});

export const create = mutation({
  args: {
    class_name: v.string(),
    project_id: v.id('projects'),
    max_participant_count: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const classes = await ctx.db.insert('classes', {
      project_id: args.project_id,
      class_name: args.class_name,
      max_participant_count: args.max_participant_count,
      is_open: true,
      delete_flg: false,
    });

    return classes;
  },
});
