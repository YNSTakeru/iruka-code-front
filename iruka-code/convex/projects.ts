import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getSidebar = query({
  args: {
    team_id: v.optional(v.id('teams')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_team_id', (q) => q.eq('team_id', args.team_id!))
      .order('desc')
      .collect();

    return projects;
  },
});

export const create = mutation({
  args: {
    project_name: v.string(),
    team_id: v.id('teams'),
    max_participant_count: v.number(),
    max_class_num: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const projects = await ctx.db.insert('projects', {
      team_id: args.team_id,
      project_name: args.project_name,
      max_participant_count: args.max_participant_count,
      max_class_num: args.max_class_num,
      is_open: true,
      delete_flg: false,
    });

    return projects;
  },
});
