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

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const teams = await ctx.db
      .query('teams')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('is_archived'), true))
      .order('desc')
      .collect();

    return teams;
  },
});

export const restore = mutation({
  args: { id: v.id('teams') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const existingTeam = await ctx.db.get(args.id);

    if (!existingTeam) {
      throw new Error('Team not found');
    }

    if (existingTeam.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_team_id', (q) => q.eq('team_id', args.id))
      .collect();

    for (const project of projects) {
      const classes = await ctx.db
        .query('classes')
        .withIndex('by_project_id', (q) => q.eq('project_id', project._id))
        .collect();

      for (const _class of classes) {
        await ctx.db.patch(_class._id, {
          is_archived: false,
        });
      }

      await ctx.db.patch(project._id, {
        is_archived: false,
      });
    }

    const team = await ctx.db.patch(args.id, {
      is_archived: false,
    });

    return team;
  },
});

export const remove = mutation({
  args: { id: v.id('teams') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const existingTeam = await ctx.db.get(args.id);

    if (!existingTeam) {
      throw new Error('Team not found');
    }

    if (existingTeam.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_team_id', (q) => q.eq('team_id', args.id))
      .collect();

    for (const project of projects) {
      const classes = await ctx.db
        .query('classes')
        .withIndex('by_project_id', (q) => q.eq('project_id', project._id))
        .collect();

      for (const _class of classes) {
        await ctx.db.delete(_class._id);
      }

      await ctx.db.delete(project._id);
    }

    const team = await ctx.db.delete(args.id);

    return team;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const teams = await ctx.db
      .query('teams')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('is_archived'), false))
      .order('desc')
      .collect();

    const obj = { test: 'aaa', teams };

    return teams;
  },
});

export const getById = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const team = await ctx.db.get(args.teamId);

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.isPublished && !team.is_archived) {
      return team;
    }

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    if (team.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return team;
  },
});

export const update = mutation({
  args: {
    id: v.id('teams'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingTeam = await ctx.db.get(args.id);

    if (!existingTeam) {
      throw new Error('Team not found');
    }

    if (existingTeam.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const team = await ctx.db.patch(args.id, {
      ...rest,
    });

    return team;
  },
});
