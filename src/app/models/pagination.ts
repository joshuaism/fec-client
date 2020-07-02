export class Pagination {

    pages: number;
    count: number;

    constructor(obj?: any) {
        this.pages = obj && obj.pages || 0;
        this.count = obj && obj.count || 0;
    }
}