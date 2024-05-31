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

export const create = mutation({
  args: {
    project_id: v.id('projects'),
    class_name: v.string(),
    max_participant_count: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const _class = await ctx.db.insert('classes', {
      project_id: args.project_id,
      class_name: args.class_name,
      max_participant_count: args.max_participant_count,
      is_open: true,
      is_archived: false,
      delete_flg: false,
    });

    const project = await ctx.db.get(args.project_id);

    await ctx.db.patch(args.project_id, {
      max_class_num: project!.max_class_num + args.max_participant_count,
    });

    return _class;
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

    const projectClasses = await Promise.all(
      projects.map((project) =>
        ctx.db
          .query('classes')
          .withIndex('by_project_id', (q) => q.eq('project_id', project!._id))
          .filter((q) => q.eq(q.field('is_archived'), true))
          .collect(),
      ),
    );

    const filteredProjectClasses = projectClasses.filter(
      (classes) => classes.length > 0,
    );

    const projectNameClasses = await Promise.all(
      filteredProjectClasses.map(async (classes) => {
        const project = await ctx.db.get(classes[0].project_id);
        return {
          projectName: project?.project_name,
          classes,
          team_id: project!.team_id,
        };
      }),
    );

    const teamTitleProjectNameClasses = await Promise.all(
      projectNameClasses.map(async (projectNameClass) => {
        const team = await ctx.db.get(projectNameClass.team_id);
        return { projectNameClass, team_title: team!.title };
      }),
    );

    return teamTitleProjectNameClasses;
  },
});

export const restore = mutation({
  args: { id: v.id('classes') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const _class = await ctx.db.get(args.id);

    if (!_class) return;

    await ctx.db.patch(args.id, { is_archived: false });

    return _class;
  },
});

export const remove = mutation({
  args: { id: v.id('classes') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const existingClass = await ctx.db.get(args.id);

    if (!existingClass) {
      throw new Error('Class not found');
    }

    await ctx.db.delete(args.id);
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

    const projectClasses = await Promise.all(
      filteredProjects.map((project) =>
        ctx.db
          .query('classes')
          .withIndex('by_project_id', (q) => q.eq('project_id', project!._id))
          .filter((q) => q.eq(q.field('is_archived'), false))
          .collect(),
      ),
    );

    const filteredProjectClasses = projectClasses.filter(
      (classes) => classes.length > 0,
    );

    const projectNameClasses = await Promise.all(
      filteredProjectClasses.map(async (classes) => {
        const project = await ctx.db.get(classes[0].project_id);
        return {
          projectName: project?.project_name,
          classes,
          team_id: project!.team_id,
        };
      }),
    );

    const teamTitleProjectNameClasses = await Promise.all(
      projectNameClasses.map(async (projectNameClass) => {
        const team = await ctx.db.get(projectNameClass.team_id);
        return { projectNameClass, team_title: team!.title };
      }),
    );

    return teamTitleProjectNameClasses;
  },
});
