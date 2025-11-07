import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const challengeService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "skill_c"}},
          {"field": {"Name": "type_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('challenge_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching challenges:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "skill_c"}},
          {"field": {"Name": "type_c"}}
        ]
      };

      const response = await apperClient.getRecordById('challenge_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching challenge ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByType: async (type) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "skill_c"}},
          {"field": {"Name": "type_c"}}
        ],
        where: [{
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": [type],
          "Include": true
        }]
      };

      const response = await apperClient.fetchRecords('challenge_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching challenges by type:", error?.response?.data?.message || error);
      return [];
    }
  },

  getBySkillAndDifficulty: async (skill, difficulty) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "skill_c"}},
          {"field": {"Name": "type_c"}}
        ],
        where: [
          {
            "FieldName": "skill_c",
            "Operator": "EqualTo",
            "Values": [skill],
            "Include": true
          },
          {
            "FieldName": "difficulty_c",
            "Operator": "EqualTo",
            "Values": [parseInt(difficulty)],
            "Include": true
          }
        ]
      };

      const response = await apperClient.fetchRecords('challenge_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching challenges by skill and difficulty:", error?.response?.data?.message || error);
      return [];
    }
  },

  getRandomByType: async (type, count = 5) => {
    try {
      const challenges = await challengeService.getByType(type);
      
      if (challenges.length === 0) return [];
      
      // Shuffle array and return random selection
      const shuffled = [...challenges].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    } catch (error) {
      console.error("Error fetching random challenges by type:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export default challengeService;