import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const archive = mutation({
  args: {
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const existingTeam = await ctx.db.get(args.teamId);

    if (!existingTeam) {
      throw new Error('Team not found');
    }

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_team_id', (q) => q.eq('team_id', args.teamId))
      .collect();

    for (const project of projects) {
      const classes = await ctx.db
        .query('classes')
        .withIndex('by_project_id', (q) => q.eq('project_id', project._id))
        .collect();

      for (const _class of classes) {
        await ctx.db.patch(_class._id, {
          is_archived: true,
        });
      }

      await ctx.db.patch(project._id, {
        is_archived: true,
      });
    }

    const team = await ctx.db.patch(args.teamId, {
      is_archived: true,
    });

    return team;
  },
});

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
