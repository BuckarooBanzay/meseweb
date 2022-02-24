import Dexie, { Table } from 'dexie';

export interface MediaEntry {
    id?: number
    hash: string
    filename: string
    size: number
    data: Blob
}

export class MediaManager extends Dexie {
    media!: Table<MediaEntry>

    constructor(){
        super("mediacache")
        this.version(1).stores({
            media: "++id,hash,filename,size,data"
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
                        size: data.byteLength,
                        data: new Blob([data])
                    })
            
                }
            })
    }

    async hasMedia(hash: string): Promise<boolean> {
        return this.media.where("hash").equalsIgnoreCase(hash).first().then(v => !!v)
    }

    async getMedia(filename: string): Promise<Blob|undefined> {
        return this.media.where("filename").equals(filename).first().then(m => {
            return m?.data
        })
    }
}