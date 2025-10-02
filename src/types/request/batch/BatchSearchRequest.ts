export default interface BatchSearchRequest {
    batchId: string | null;
    batchName: string | null;
    note: string | null;
    storageDateStart: string | null;
    storageDateEnd: string | null;
}