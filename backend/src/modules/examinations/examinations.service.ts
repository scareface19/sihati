import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalExamination } from '../../entities/medical-examination.entity';

@Injectable()
export class ExaminationsService {
  constructor(
    @InjectRepository(MedicalExamination)
    private examRepo: Repository<MedicalExamination>,
  ) {}

  async getAll(category?: string): Promise<MedicalExamination[]> {
    if (category) {
      return this.examRepo.find({
        where: { category, isActive: true },
        order: { id: 'ASC' },
      });
    }
    return this.examRepo.find({ order: { id: 'ASC' } });
  }

  async getById(id: number): Promise<MedicalExamination> {
    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Examen médical introuvable');
    return exam;
  }

  async create(data: Partial<MedicalExamination>): Promise<MedicalExamination> {
    const exam = this.examRepo.create(data);
    return this.examRepo.save(exam);
  }

  async update(id: number, data: Partial<MedicalExamination>): Promise<MedicalExamination> {
    const exam = await this.getById(id);
    Object.assign(exam, data);
    return this.examRepo.save(exam);
  }

  async delete(id: number): Promise<{ success: boolean; id: number }> {
    const exam = await this.getById(id);
    await this.examRepo.remove(exam);
    return { success: true, id };
  }
}
