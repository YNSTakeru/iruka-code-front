import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getSidebar = query({
  args: {
    project: v.optional(v.id('teams')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const teams = await ctx.db
      .query('teams')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('project', args.project),
      )
      .filter((q) => q.eq(q.field('is_archived'), false))
      .order('desc')
      .collect();

    return teams;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    project: v.optional(v.id('teams')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const team = await ctx.db.insert('teams', {
      title: args.title,
      project: args.project,
      userId,
      is_archived: false,
      isPublished: false,
    });

    return team;
  },
});
