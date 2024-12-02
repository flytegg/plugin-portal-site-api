import {Document, Schema} from "mongoose";
import {database} from "../database";
import { z } from "zod";
import { zodSchema, zUUID } from "@zodyac/zod-mongoose"

const PlatformType = z.enum(["paper", "folia", "velocity", "waterfall"]);

const VersionInfo = z.object({
  version: z.string(),
  mcVersions: z.array(z.string()),
  platforms: z.array(PlatformType),
  downloadUrl: z.string().url(),
  sha256: z.string(),
  releaseDate: z.string().datetime(),
  changelog: z.string().optional(),
});


// const Dependency = z.object({
//   id: z.string(),
//   name: z.string(),
//   version: z.string(),
//   required: z.boolean(),
// });

const ExternalLink = z.object({
  type: z.enum(["website", "source", "issues", "discord", "wiki", "donation"]),
  url: z.string().url(),
  title: z.string().optional(),
});

const Statistics = z.object({
  downloads: z.number().nonnegative(),
  views: z.number().nonnegative(),
  stargazers: z.array(z.string()),
  followers: z.number().nonnegative(),
  lastUpdated: z.string().datetime(),
});


export const ZodPlugin = z.object({
  _id: zUUID(),

  slug: z.string().min(3).max(32).regex(/^[a-z0-9-]+$/), // Only lowercase letters, numbers, and hyphens
  title: z.string().min(3).max(32).regex(/^[a-zA-Z0-9 ]+$/), // Only letters, numbers, and spaces

  author: z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.enum(["user", "organization"]),
  }),

  visibility: z.enum(["public", "private"]),

  summary: z.string().max(256), // Tag line
  body: z.string().optional(), // Long description
  
//   versions: z.array(VersionInfo),

  categories: z.array(z.enum(["moderation", "fun", "economy", "utility"])),
  tags: z.array(z.string()), // Keywords

  platforms: z.array(PlatformType).min(1), // paper, folia, velocity, waterfall
//   dependencies: z.array(Dependency).optional(),

  license: z.object({
    id: z.string(),
    name: z.string().min(3).max(64),
    url: z.string().url().optional(),
  }),

  links: z.array(ExternalLink), // Source, Website, Issues, Discord, Wiki, Donation
  icon: z.string().url().optional(),

  stats: Statistics,

  monetization: z.object({  
    isMonetized: z.boolean().default(false),
    premium: z.object({
      isPremium: z.boolean().default(false),
      price: z.number().optional(),
    }),
  }),

  lastUpdated: z.string().date(),
  createdAt: z.string().datetime(),
});

export type PluginType = z.infer<typeof ZodPlugin>
export const PluginModel = database.model("plugins", zodSchema(ZodPlugin))