
export class Assignment {
  _id ?: string;
  nom: string = '';
  dateDeRendu: Date = new Date();
  rendu: boolean=false;

  // Méthode pour vérifier si un assignment est en retard
  estEnRetard(): boolean {
    const today = new Date();
    const dateRendu = new Date(this.dateDeRendu);
    today.setHours(0, 0, 0, 0);
    dateRendu.setHours(0, 0, 0, 0);
    return !this.rendu && dateRendu < today;
  }
}
