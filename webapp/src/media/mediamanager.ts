import Dexie, { Table } from 'dexie';

export interface MediaEntry {
    id?: number
    hash: string
    filename: string
    data: Blob
}

export class MediaManager extends Dexie {
    media!: Table<MediaEntry>

    constructor(){
        super("mediacache")
        this.version(1).stores({
            media: "++id,hash,filename,data"
        })
    }

    async getMediaCount(): Promise<number> {
        return this.media.count()
    }

    addMedia(hash: string, filename: string, data: Uint8Array){
            // only store if not already in cache
            this.media
            .where("hash")
            .equalsIgnoreCase(hash)
            .first()
            .then(e => {
                if (e == undefined){
                    return this.media.add({
                        hash: hash,
                        filename: filename,
                        data: new Blob([data])
                    })
            
                }
            })
    }

    async hasMedia(hash: string): Promise<boolean> {
        return this.media.where("hash").equalsIgnoreCase(hash).first().then(v => !!v)
    }
}