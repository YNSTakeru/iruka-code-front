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

    const classes = await ctx.db
      .query('classes')
      .withIndex('by_project_id', (q) => q.eq('project_id', args.projectId))
      .collect();

    for (const _class of classes) {
      await ctx.db.patch(_class._id, {
        is_archived: true,
      });
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
      is_archived: false,
      delete_flg: false,
    });

    return project;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const leaderAccessDatetimes = await ctx.db
      .query('leaderAccessDatetimes')
      .withIndex('by_leader', (q) => q.eq('leader_id', userId))
      .order('desc')
      .collect();

    const projects = await Promise.all(
      leaderAccessDatetimes.map(({ project_id }) => ctx.db.get(project_id)),
    );

    if (projects.length === 0) return;

    const filteredProjects = projects!.filter(
      (project) => project!.is_archived === true,
    );

    const projectsTeamTitle = await Promise.all(
      filteredProjects.map(async (project) => {
        const team = await ctx.db.get(project!.team_id);
        return { project, team_title: team!.title };
      }),
    );

    return projectsTeamTitle;
  },
});

export const restore = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const project = await ctx.db.get(args.id);

    if (!project) return;

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

    return project;
  },
});

export const remove = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error('Project not found');
    }

    const leaderAccessDatetimes = await ctx.db
      .query('leaderAccessDatetimes')
      .withIndex('by_project', (q) =>
        q.eq('leader_id', userId).eq('project_id', args.id),
      )
      .order('desc')
      .collect();

    if (leaderAccessDatetimes.length === 0) {
      throw new Error('Unauthorized');
    }

    const classes = await ctx.db
      .query('classes')
      .withIndex('by_project_id', (q) =>
        q.eq('project_id', existingProject._id),
      )
      .collect();

    for (const _class of classes) {
      await ctx.db.delete(_class._id);
    }

    const project = await ctx.db.delete(existingProject._id);

    return project;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const leaderAccessDatetimes = await ctx.db
      .query('leaderAccessDatetimes')
      .withIndex('by_leader', (q) => q.eq('leader_id', userId))
      .order('desc')
      .collect();

    const projects = await Promise.all(
      leaderAccessDatetimes.map(({ project_id }) => ctx.db.get(project_id)),
    );

    if (projects.length === 0) return;

    const filteredProjects = projects!.filter(
      (project) => project!.is_archived === false,
    );

    const projectsTeamTitle = await Promise.all(
      filteredProjects.map(async (project) => {
        const team = await ctx.db.get(project!.team_id);
        return { project, team_title: team!.title };
      }),
    );

    return projectsTeamTitle;
  },
});

export const getById = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.is_open && !project.is_archived) {
      return project;
    }

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const leaderAccessDatetimes = await ctx.db
      .query('leaderAccessDatetimes')
      .withIndex('by_project', (q) =>
        q.eq('leader_id', userId).eq('project_id', args.projectId),
      )
      .order('desc')
      .collect();

    if (leaderAccessDatetimes[0].leader_id !== userId) {
      throw new Error('Unauthorized');
    }

    return project;
  },
});

export const update = mutation({
  args: {
    id: v.id('projects'),
    team_id: v.id('teams'),
    project_name: v.string(),
    start_timestamp: v.optional(v.string()),
    end_timestamp: v.optional(v.string()),
    is_open: v.boolean(),
    is_archived: v.boolean(),
    description: v.optional(v.string()),
    max_participant_count: v.number(),
    max_class_num: v.number(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error('Project not found');
    }

    const existingLeaderAccessDatetimes = await ctx.db
      .query('leaderAccessDatetimes')
      .withIndex('by_project', (q) =>
        q.eq('leader_id', userId).eq('project_id', args.id),
      )
      .order('desc')
      .collect();

    if (existingLeaderAccessDatetimes[0].leader_id !== userId) {
      throw new Error('Unauthorized');
    }

    const project = await ctx.db.patch(args.id, {
      ...rest,
    });

    return project;
  },
});
