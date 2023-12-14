import axios from 'axios';
/**
 * Dummy service to get assessments
 * @returns 
 */
export async function getAssessments() {
    const res = await axios.get(`${process.env.ASSESSMENT_SERVICE_URL}/assessments`);
    return res.data;
}