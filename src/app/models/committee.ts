export class Committee {

    id: string;
    name: string;
    cycle: string;
    party: string;
    type: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.name = obj && obj.name || null;
        this.cycle = obj && obj.cycle || null;
        this.party = obj && obj.party || null;
        this.type = obj && obj.type || null;
    }
}
