export class Pagination {

    pages: number;
    count: number;

    constructor(obj?: any) {
        this.pages = obj && obj.pages || null;
        this.count = obj && obj.count || null;
    }
}