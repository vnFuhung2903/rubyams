import { CourseRepository } from "../repositories/course";
import { Prisma, Course } from "@prisma/client";

export class CourseService {
  private courseRepository: CourseRepository;

  constructor(courseRepository?: CourseRepository) {
    this.courseRepository = courseRepository || new CourseRepository();
  }

  async getCourseById(id: number): Promise<Course | null> {
    return this.courseRepository.findById(id);
  }

  async getCoursesBySemester(semester: number): Promise<Course[] | null> {
    return this.courseRepository.findBySemester(semester);
  }

  async getCoursesByName(courseName: string, semester?: number): Promise<Course[] | null> {
    return this.courseRepository.findByCourseName(courseName, semester);
  }

  async getRegisteredCoursesByStudent(studentId: number, semester?: number, weekday?: number): Promise<Course[] | null> {
    return this.courseRepository.findRegisteredCourses(studentId, semester, weekday);
  }

  async createNewCourse(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.courseRepository.createCourse(data);
  }

  async startSemesterCourses(semester: number) {
    const courses = await this.courseRepository.findBySemester(semester);
    if (!courses) {
      return;
    }
    const updateCourses = courses.map(course => ({
      id: course.id,
      inProgress: true
    }));
    this.courseRepository.batchUpdateCourses(updateCourses);
  }

  async getIncomingCourses(studentId: number, semester: number): Promise<Course[] | null> {
    return this.courseRepository.findRegisteredCourses(studentId, semester, new Date(Date.now()).getDay());
  }
}