import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  teams: defineTable({
    title: v.string(),
    userId: v.string(),
    is_archived: v.boolean(),
    project: v.optional(v.id('teams')),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_user_parent', ['userId', 'project']),

  projects: defineTable({
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
    delete_flg: v.boolean(),
  }).index('by_team_id', ['team_id']),

  leaderAccessDatetimes: defineTable({
    leader_id: v.string(),
    project_id: v.id('projects'),
    access_date: v.optional(v.string()),
  })
    .index('by_leader', ['leader_id'])
    .index('by_project', ['leader_id', 'project_id']),

  classes: defineTable({
    project_id: v.id('projects'),
    class_name: v.string(),
    start_timestamp: v.optional(v.string()),
    end_timestamp: v.optional(v.string()),
    is_open: v.boolean(),
    is_archived: v.boolean(),
    max_participant_count: v.number(),
    delete_flg: v.boolean(),
  }).index('by_project_id', ['project_id']),
});
