import { MediaManager } from "./MediaManager";
import Dexie from 'dexie';

export class IndexedDBMediaManager extends Dexie implements MediaManager {

    media!: Dexie.Table<CachedMedia, number>

    constructor() {
        super("meseweb")
        this.version(1).stores({
            media: "++id,hash,filename,size,data"
        })
    }

    size(): Promise<number> {
        return this.media.count()
    }
    hasMedia(hash: string): Promise<boolean> {
        return this.media.where("hash").equalsIgnoreCase(hash).first().then(v => !!v)
    }
    getMedia(filename: string): Promise<Blob> {
        return this.media.where("filename").equals(filename).first().then(m => {
            return m!.data
        })
    }
    addMedia(hash: string, filename: string, data: Blob): Promise<void> {
        console.log(filename, hash, data.size)
        // only store if not already in cache
        return this.hasMedia(hash)
        .then(exists => {
            if (!exists){
                return this.media.add({
                    hash: hash,
                    filename: filename,
                    size: data.size,
                    data: new Blob([data])
                })
                .then(() => {})
            }
        })
    }
    clear(): Promise<void> {
        return this.media.clear()
    }

}

interface CachedMedia {
    id?: number
    hash: string
    filename: string
    size: number
    data: Blob
}