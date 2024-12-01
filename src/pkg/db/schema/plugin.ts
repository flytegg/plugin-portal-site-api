import {Document, Schema} from "mongoose";
import {database} from "../database";
import { z } from "zod";

interface Plugin extends Document {
    name: string
    platforms: Record<string, {
        id: string,
        name: string,
        author: string,
        description: string,
        downloads: number,
        imageURL: string,
        download: {
            url: string,
            version: string,
        },
        lastUpdated: string,
    }>
}

const PluginSchema = new Schema<Plugin>({
    name: { type: String, required: true },
    platforms: {
        type: Map,
        of: {
            _id: false,
            id: { type: String, required: true },
            name: { type: String, required: true },
            author: { type: String, required: false },
            description: { type: String, required: false },
            downloads: { type: Number, required: false },
            imageURL: { type: String, required: false },
            download: {
                url: { type: String, required: false },
                version: { type: String, required: false },
            },
            lastUpdated: String
        },
    }
}, {
    versionKey: false
})

const ZodPlugin = z.object({
    name: z.string(),
    platforms: z.record(z.string(), z.object({
        id: z.string(),
        name: z.string(),
        author: z.string().optional(),
        description: z.string().optional(),
        downloads: z.number().optional(),
        imageURL: z.string().optional(),
        download: z.object({
            url: z.string().optional(),
            version: z.string().optional(),
        }),
        lastUpdated: z.string(),
    }))
})

export type PluginType = z.infer<typeof ZodPlugin>

export const PluginModel = database.model<Plugin>("Plugin", PluginSchema)