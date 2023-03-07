
export interface MediaManager {
    size(): Promise<number>
    hasMedia(hash: string): Promise<boolean>
    getMedia(filename: string): Promise<Blob>
    addMedia(hash: string, filename: string, data: Blob): Promise<void>
    clear(): Promise<void>
}