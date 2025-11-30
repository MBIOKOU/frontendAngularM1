
export class Assignment {
  _id ?: string;
  id!: number;
  nom: string = '';
  dateDeRendu: Date = new Date();
  rendu: boolean=false;
}
