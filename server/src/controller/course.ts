import express, { Request, Response } from 'express';
import { CourseService } from '../service/course';
import { Prisma } from '@prisma/client';

const router = express.Router();
const courseService = new CourseService();

/**
 * @swagger
 * /courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create a new course
 *     description: Add a new course to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const courseData: Prisma.CourseCreateInput = req.body;
    const course = await courseService.createNewCourse(courseData);
    res.status(201).json(course);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get course by ID
 *     description: Retrieves a course by its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course's unique ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const course = await courseService.getCourseById(Number(req.params.id));
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /courses/semester/{semester}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get courses by semester
 *     description: Retrieves all courses for a specific semester
 *     parameters:
 *       - in: path
 *         name: semester
 *         required: true
 *         description: Semester code (e.g., 20241 for Spring 2024)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Course'
 *       500:
 *         description: Server error
 */
router.get('/semester/:semester', async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getCoursesBySemester(Number(req.params.semester));
    res.status(200).json(courses || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /courses/name/{name}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get courses by name
 *     description: Retrieves courses matching a specific name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Course name to search for
 *         schema:
 *           type: string
 *       - in: query
 *         name: semester
 *         required: false
 *         description: Filter by semester
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of matching courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Course'
 *       500:
 *         description: Server error
 */
router.get('/name/:name', async (req: Request, res: Response) => {
  try {
    const { semester } = req.query;
    const courses = await courseService.getCoursesByName(req.params.name, semester ? Number(semester) : undefined);
    res.status(200).json(courses || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /courses/student/{studentId}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get courses by student
 *     description: Retrieves courses registered by a specific student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: ID of the student
 *         schema:
 *           type: integer
 *       - in: query
 *         name: semester
 *         required: false
 *         description: Filter by semester
 *         schema:
 *           type: integer
 *       - in: query
 *         name: weekday
 *         required: false
 *         description: Filter by weekday (0-6, where 0 is Sunday)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Course'
 *       500:
 *         description: Server error
 */
router.get('/student/:studentId', async (req: Request, res: Response) => {
  try {
    const { semester, weekday } = req.query;
    const courses = await courseService.getRegisteredCoursesByStudent(
      Number(req.params.studentId), 
      semester ? Number(semester) : undefined,
      weekday ? Number(weekday) : undefined
    );
    res.status(200).json(courses || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /courses/student/{studentId}/incoming:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get incoming courses for student
 *     description: Retrieves upcoming courses for a specific student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: ID of the student
 *         schema:
 *           type: integer
 *       - in: query
 *         name: semester
 *         required: false
 *         description: Semester code (defaults to current semester)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of upcoming courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Course'
 *       500:
 *         description: Server error
 */
router.get('/student/:studentId/incoming', async (req: Request, res: Response) => {
  try {
    const semester = req.query.semester ? Number(req.query.semester) : 20252;
    const courses = await courseService.getIncomingCourses(Number(req.params.studentId), semester);
    res.status(200).json(courses || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /courses/semester/{semester}/start:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Start courses for a semester
 *     description: Mark all courses for a semester as in progress
 *     parameters:
 *       - in: path
 *         name: semester
 *         required: true
 *         description: Semester code
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Courses started successfully
 *       500:
 *         description: Server error
 */
router.post('/semester/:semester/start', async (req: Request, res: Response) => {
  try {
    await courseService.startSemesterCourses(Number(req.params.semester));
    res.status(200).json({ message: 'Semester courses started successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

export default router; 