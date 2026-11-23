import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from '../../entities/medication.entity';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepo: Repository<Medication>,
  ) {}

  // Recherche par Nom de Marque ou DCI
  async search(query: string, limit: number = 25): Promise<Medication[]> {
    if (!query || query.trim().length === 0) {
      return this.medicationRepo.find({ take: limit, order: { brandName: 'ASC' } });
    }

    const cleanQ = `%${query.trim()}%`;
    return this.medicationRepo
      .createQueryBuilder('m')
      .where('m.brandName LIKE :q OR m.dci LIKE :q OR m.code LIKE :q', { q: cleanQ })
      .orderBy('m.brandName', 'ASC')
      .take(limit)
      .getMany();
  }

  // Obtenir par ID
  async findOne(id: number): Promise<Medication> {
    const med = await this.medicationRepo.findOne({ where: { id } });
    if (!med) throw new NotFoundException('Médicament introuvable dans la nomenclature');
    return med;
  }

  // Obtenir les équivalents génériques (même DCI)
  async findGenerics(dci: string): Promise<Medication[]> {
    return this.medicationRepo.find({
      where: { dci },
      order: { brandName: 'ASC' },
    });
  }

  // Compter le total des médicaments enregistrés
  async countTotal(): Promise<number> {
    return this.medicationRepo.count();
  }

  // Injecter / Ajouter un nouveau médicament (Admin)
  async create(data: Partial<Medication>): Promise<Medication> {
    const med = this.medicationRepo.create(data);
    return this.medicationRepo.save(med);
  }

  // Modifier un médicament existant (Admin)
  async update(id: number, data: Partial<Medication>): Promise<Medication> {
    const med = await this.findOne(id);
    Object.assign(med, data);
    return this.medicationRepo.save(med);
  }

  // Supprimer / Retirer un médicament de la nomenclature (Admin)
  async delete(id: number): Promise<{ success: boolean; id: number }> {
    const med = await this.findOne(id);
    await this.medicationRepo.remove(med);
    return { success: true, id };
  }
}
