import { Prisma, PrismaClient, Student } from "@prisma/client";

export class StudentRepository {
  private db: PrismaClient | Prisma.TransactionClient;
  constructor(db?: PrismaClient | Prisma.TransactionClient) {
    this.db = db || new PrismaClient(); 
  }

  async findById(id: number): Promise<Student | null> {
    return this.db.student.findUnique({
      where: { id },
    });
  }

  async findByNFTAddress(nftAddress: string): Promise<Student | null> {
    return this.db.student.findUnique({
      where: { nftAddress },
    });
  }

  async findByStudentNumber(studentNumber: number): Promise<Student | null> {
    return this.db.student.findUnique({
      where: { studentNumber },
    });
  }

  async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
    return this.db.student.create({
      data: {
        ...data,
      },
    });
  }

  async updateStudent(id: number, data: Prisma.StudentUpdateInput): Promise<Student | null> {
    return this.db.student.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}