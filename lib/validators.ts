import { z } from 'zod';

const phone = z.string().trim().regex(/^\+?[0-9 ]{8,15}$/, 'Enter a valid phone number');

export const registrationSchema = z.object({
  tournament_id: z.string().uuid(),
  student_name: z.string().trim().min(2, 'Enter the student name').max(80),
  grade: z.coerce.number().int().min(1, 'Class must be 1 to 12').max(12, 'Class must be 1 to 12'),
  section: z.string().trim().min(1, 'Enter the section').max(3),
  roll_no: z.string().trim().min(1, 'Enter the roll number').max(10),
  team_name: z.string().trim().max(60).optional(),
  guardian_contact: phone,
  email: z.string().trim().email('Enter a valid email address'),
  emergency_contact: phone,
  consent: z.literal('on', { errorMap: () => ({ message: 'Guardian consent is required' }) }),
  website: z.string().max(200).optional(),
});
