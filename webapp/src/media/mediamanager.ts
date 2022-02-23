import Dexie, { Table } from 'dexie';

export interface MediaEntry {
    id?: number
    hash: string
    data: Uint8Array
}

export class MediaManager extends Dexie {
    media!: Table<MediaEntry>

    constructor(){
        super("mediacache")
        this.version(1).stores({
            media: "++id,hash,data"
        })
    }

    addMedia(key: string, data: Uint8Array){
        this.media.add({
            hash: key,
            data: data
        })
    }
}