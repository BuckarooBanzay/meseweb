
export class MediaManager extends Dexie {
    constructor(dbname){
        super(dbname);
        this.version(1).stores({
            media: "++id,hash,filename,size,data"
        });
    }

    clear() {
        return this.media.clear();
    }

    getMediaCount() {
        return this.media.count();
    }

    addMedia(hash, filename, data){
            // only store if not already in cache
            return this.media
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
                    });
                }
            });
    }

    hasMedia(hash) {
        return this.media.where("hash").equalsIgnoreCase(hash).first().then(v => !!v);
    }

    getMedia(filename) {
        return this.media.where("filename").equals(filename).first().then(m => {
            return m ? m.data : null;
        });
    }
}