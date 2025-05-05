import express, { Request, Response } from 'express';
import { StudentService } from '../service/student';

const router = express.Router();
const studentService = new StudentService();

/**
 * @swagger
 * /students/nft-address/{nftAddress}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get a student by NFT address
 *     description: Retrieves a student using their NFT address
 *     parameters:
 *       - in: path
 *         name: nftAddress
 *         required: true
 *         description: NFT address of the student
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get('/nft-address/:nftAddress', async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudentByNFTAddress(req.params.nftAddress);
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /students/search/nft-address/{nftAddress}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Search students by NFT address
 *     description: Search for students using partial NFT address
 *     parameters:
 *       - in: path
 *         name: nftAddress
 *         required: true
 *         description: Partial or complete NFT address
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Student'
 *       500:
 *         description: Server error
 */
router.get('/search/nft-address/:nftAddress', async (req: Request, res: Response) => {
  try {
    const students = await studentService.searchStudentsByNFTAddress(req.params.nftAddress);
    res.status(200).json(students);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /students/student-number/{studentNumber}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student by student number
 *     description: Find a student by their unique student number
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         description: Student's unique number
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get('/student-number/:studentNumber', async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudentByStudentNumber(Number(req.params.studentNumber));
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student by ID
 *     description: Find a student by their unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student's unique ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 *   put:
 *     tags:
 *       - Students
 *     summary: Update student
 *     description: Update an existing student's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student's unique ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 *   delete:
 *     tags:
 *       - Students
 *     summary: Delete student
 *     description: Delete a student by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student's unique ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Student deleted successfully
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudentById(Number(req.params.id));
    
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create new student
 *     description: Add a new student to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       500:
 *         description: Server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const student = await studentService.updateStudent(Number(req.params.id), req.body);
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await studentService.deleteStudent(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

export default router; 