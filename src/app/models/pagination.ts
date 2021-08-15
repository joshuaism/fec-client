export class Pagination {

    pages: number;
    count: number;
    lastAmount: number;

    constructor(obj?: any) {
        this.pages = obj && obj.pages || 0;
        this.count = obj && obj.count || 0;
        this.lastAmount = obj && obj.last_indexes && obj.last_indexes.lastAmount || 0;
    }
}