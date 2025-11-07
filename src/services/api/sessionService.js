import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const sessionService = {
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "accuracy_c"}},
          {"field": {"Name": "challenges_completed_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "stars_earned_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "is_timed_c"}},
          {"field": {"Name": "average_time_c"}},
          {"field": {"Name": "bonus_stars_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('session_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching sessions:", error?.response?.data?.message || error);
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "accuracy_c"}},
          {"field": {"Name": "challenges_completed_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "stars_earned_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "is_timed_c"}},
          {"field": {"Name": "average_time_c"}},
          {"field": {"Name": "bonus_stars_c"}}
        ]
      };

      const response = await apperClient.getRecordById('session_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getRecent: async (count = 5) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "accuracy_c"}},
          {"field": {"Name": "challenges_completed_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "stars_earned_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "is_timed_c"}},
          {"field": {"Name": "average_time_c"}},
          {"field": {"Name": "bonus_stars_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": count, "offset": 0}
      };

      const response = await apperClient.fetchRecords('session_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent sessions:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (sessionData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          Name: sessionData.Name || `${sessionData.subject} Session`,
          subject_c: sessionData.subject,
          accuracy_c: sessionData.accuracy,
          challenges_completed_c: sessionData.challengesCompleted,
          duration_c: sessionData.duration,
          stars_earned_c: sessionData.starsEarned,
          timestamp_c: new Date().toISOString(),
          is_timed_c: sessionData.isTimed || false,
          average_time_c: sessionData.averageTime || 0,
          bonus_stars_c: sessionData.bonusStars || 0
        }]
      };

      const response = await apperClient.createRecord('session_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} session records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating session:", error?.response?.data?.message || error);
      return null;
    }
  }
};

export default sessionService;