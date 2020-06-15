import {Committee} from '../models/committee'

export class Contribution {

    fullName: string;
    occupation: string;
    employer: string;
    city: string;
    state: string;
    committee: Committee;
    amount: number;
    date: Date;
    earmark: string;

    constructor(obj?: any) {
        this.fullName = obj && obj.fullName || null;
        this.occupation = obj && obj.occupation || null;
        this.employer = obj && obj.employer || null;
        this.city = obj && obj.city || null;
        this.state = obj && obj.state || null;
        this.committee = obj && new Committee(obj.committee) || null;
        this.amount = obj && obj.amount || 0;
        this.date = obj && obj.date || null;
        this.earmark = obj && obj.earmark || null;
    }
}
