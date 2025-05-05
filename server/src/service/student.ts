import { Prisma, Student } from '@prisma/client';
import { StudentRepository } from '../repositories/student';

export class StudentService {
  private studentRepo: StudentRepository;

  constructor(studentRepo?: StudentRepository) {
    this.studentRepo = studentRepo || new StudentRepository();
  }

  async getStudentById(id: number): Promise<Student | null> {
    return this.studentRepo.findById(id);
  }

  async getStudentByNFTAddress(nftAddress: string): Promise<Student | null> {
    return this.studentRepo.findByNFTAddress(nftAddress);
  }

  async getStudentByStudentNumber(studentNumber: number): Promise<Student | null> {
    return this.studentRepo.findByStudentNumber(studentNumber);
  }

  async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
    return this.studentRepo.createStudent(data);
  }

  async updateStudent(id: number, data: Prisma.StudentUpdateInput): Promise<Student | null> {
    return this.studentRepo.updateStudent(id, data);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.studentRepo.deleteStudent(id);
  }

  async searchStudentsByNFTAddress(nftAddress: string): Promise<Student[]> {
    return this.studentRepo.searchStudentsByNFTAddress(nftAddress);
  }
} 