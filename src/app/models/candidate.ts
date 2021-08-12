export class Candidate {

    id: string;
    name: string;
    years: number[];
    party: string;
    state: string;
    office: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || '';
        this.name = obj && obj.name || '';
        this.years = obj && obj.years || '';
        this.party = obj && obj.party || '';
        this.state = obj && obj.state || '';
        this.office = obj && obj.office || '';
    }
}