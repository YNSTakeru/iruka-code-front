import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const archive = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const existingProject = await ctx.db.get(args.projectId);

    if (!existingProject) {
      throw new Error('Project not found');
    }

    const leaderAccessDatetimes = await ctx.db
      .query('leaderAccessDatetimes')
      .withIndex('by_project', (q) =>
        q.eq('leader_id', userId).eq('project_id', args.projectId),
      )
      .order('desc')
      .collect();

    if (leaderAccessDatetimes.length === 0) {
      throw new Error('Unauthorized');
    }

    const project = await ctx.db.patch(args.projectId, {
      is_archived: true,
    });

    return project;
  },
});

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
      .filter((q) => q.eq(q.field('is_archived'), false))
      .order('desc')
      .collect();

    return projects;
  },
});

export const create = mutation({
  args: {
    project_name: v.string(),
    class_name: v.string(),
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

    const project = await ctx.db.insert('projects', {
      team_id: args.team_id,
      project_name: args.project_name,
      max_participant_count: args.max_participant_count,
      max_class_num: args.max_class_num,
      is_open: true,
      is_archived: false,
      delete_flg: false,
    });

    const leaderAccessDatetime = await ctx.db.insert('leaderAccessDatetimes', {
      leader_id: userId,
      project_id: project,
    });

    const _class = await ctx.db.insert('classes', {
      project_id: project,
      class_name: args.class_name,
      max_participant_count: args.max_participant_count,
      is_open: true,
      delete_flg: false,
    });

    return project;
  },
});
