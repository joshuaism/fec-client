import {Committee} from './committee'

export class OutsideSpending {

    candidate: string;
    candidateParty: string;
    payee: string;
    supportOrOppose: string;
    description: string;
    committee: Committee;
    amount: number;
    date: Date;

    constructor(obj?: any) {
        this.candidate = obj && obj.candidate || null;
        this.candidateParty = obj && obj.candidateParty || null;
        this.payee = obj && obj.payee || null;
        if (obj && obj.supportOrOppose) {
            this.supportOrOppose = obj.supportOrOppose == "S" ? "Support" : "Oppose";
        } else {
            this.supportOrOppose = null;
        }
        this.description = obj && obj.description || null;
        this.committee = obj && new Committee(obj.committee) || null;
        this.amount = obj && obj.amount || 0;
        this.date = obj && obj.date || null;
    }
}
