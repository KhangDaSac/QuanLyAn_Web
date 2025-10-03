export default interface BatchSearchRequest {
    batchId: string | null;
    batchName: string | null;
    note: string | null;
    startStorageDate: string | null;
    endStorageDate: string | null;
}