import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const teams = await ctx.db.query('teams').collect();

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

    const teams = await ctx.db.insert('teams', {
      title: args.title,
      project: args.project,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return teams;
  },
});
