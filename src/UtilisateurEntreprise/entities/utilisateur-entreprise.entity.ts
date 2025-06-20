import { Entreprise } from 'src/entreprise/entities/entreprise.entity';
import { Utilisateur } from 'src/User/entities/utilisateur.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UtilisateurEntreprise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.entreprises)
  utilisateur!: Utilisateur;

  @ManyToOne(() => Entreprise, (entreprise) => entreprise.utilisateurs)
  entreprise!: Entreprise;

  @Column({ default: false })
  isOwner: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateAjout: Date;
}
