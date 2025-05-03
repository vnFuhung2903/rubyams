import { Prisma, PrismaClient, Course } from "@prisma/client";

export class CourseRepository {
  private db: PrismaClient;
  constructor(db?: PrismaClient) {
    this.db = db || new PrismaClient(); 
  }

  async findById(id: number): Promise<Course | null> {
    return this.db.course.findUnique({
      where: { id },
    });
  }

  async findBySemester(semester: number): Promise<Course[] | null> {
    return this.db.course.findMany({
      where: { semester },
    });
  }

  async findByCourseName(courseName: string, semester?: number): Promise<Course[] | null> {
    return this.db.course.findMany({
      where: {
        courseName,
        semester
      },
    });
  }

  async findRegisteredCourses(studentId: number, semester?: number, weekday?: number): Promise<Course[] | null> {
    return this.db.course.findMany({
      where: {
        semester,
        weekday,
        students: {
          some: {
            studentId,
          },
        },
      },
      include: {
        students: true,
      },
    });
  }

  async createCourse(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.db.course.create({
      data: {
        ...data,
        inProgress: false,
      },
    });
  }

  async updateCourse(id: number, data: Prisma.CourseUpdateInput) {
    return this.db.course.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async batchUpdateCourses(courses: ({ id: number } & Prisma.CourseUpdateInput )[]): Promise<Course[] | null> {
    try {
      const updatedCourses = await this.db.$transaction(
        courses.map(course => {
          const { id, ...data } = course;
          return this.db.course.update({
            where: { id },
            data,
          });
        })
      );
      return updatedCourses;
    } catch (error) {
      console.error('Batch update failed:', error);
      return null;
    }
  }
}