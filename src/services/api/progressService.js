import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const progressService = {
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
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "last_active_c"}},
          {"field": {"Name": "math_level_c"}},
          {"field": {"Name": "reading_level_c"}},
          {"field": {"Name": "streak_c"}},
          {"field": {"Name": "total_stars_c"}},
          {"field": {"Name": "skills_mastered_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('progress_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching progress:", error?.response?.data?.message || error);
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
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "last_active_c"}},
          {"field": {"Name": "math_level_c"}},
          {"field": {"Name": "reading_level_c"}},
          {"field": {"Name": "streak_c"}},
          {"field": {"Name": "total_stars_c"}},
          {"field": {"Name": "skills_mastered_c"}}
        ]
      };

      const response = await apperClient.getRecordById('progress_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching progress ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getCurrentProgress: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "last_active_c"}},
          {"field": {"Name": "math_level_c"}},
          {"field": {"Name": "reading_level_c"}},
          {"field": {"Name": "streak_c"}},
          {"field": {"Name": "total_stars_c"}},
          {"field": {"Name": "skills_mastered_c"}}
        ],
        orderBy: [{"fieldName": "last_active_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const response = await apperClient.fetchRecords('progress_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error fetching current progress:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const updateData = {};
      if (data.mathLevel !== undefined) updateData.math_level_c = data.mathLevel;
      if (data.readingLevel !== undefined) updateData.reading_level_c = data.readingLevel;
      if (data.totalStars !== undefined) updateData.total_stars_c = data.totalStars;
      if (data.streak !== undefined) updateData.streak_c = data.streak;
      if (data.skillsMastered !== undefined) updateData.skills_mastered_c = Array.isArray(data.skillsMastered) ? data.skillsMastered.join(',') : data.skillsMastered;
      
      updateData.last_active_c = new Date().toISOString();

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };

      const response = await apperClient.updateRecord('progress_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} progress records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating progress:", error?.response?.data?.message || error);
      return null;
    }
  },

  updateStars: async (starsToAdd) => {
    try {
      const currentProgress = await progressService.getCurrentProgress();
      if (!currentProgress) return null;

      const newTotalStars = (currentProgress.total_stars_c || 0) + starsToAdd;
      
      return await progressService.update(currentProgress.Id, {
        totalStars: newTotalStars
      });
    } catch (error) {
      console.error("Error updating stars:", error?.response?.data?.message || error);
      return null;
    }
  },

  updateLevel: async (subject, newLevel) => {
    try {
      const currentProgress = await progressService.getCurrentProgress();
      if (!currentProgress) return null;

      const updateData = {};
      if (subject === "math") {
        updateData.mathLevel = newLevel;
      } else if (subject === "reading") {
        updateData.readingLevel = newLevel;
      }

      return await progressService.update(currentProgress.Id, updateData);
    } catch (error) {
      console.error("Error updating level:", error?.response?.data?.message || error);
      return null;
    }
  },

  addMasteredSkill: async (skill) => {
    try {
      const currentProgress = await progressService.getCurrentProgress();
      if (!currentProgress) return null;

      let currentSkills = [];
      if (currentProgress.skills_mastered_c) {
        currentSkills = typeof currentProgress.skills_mastered_c === 'string' 
          ? currentProgress.skills_mastered_c.split(',').filter(s => s.trim())
          : Array.isArray(currentProgress.skills_mastered_c) 
          ? currentProgress.skills_mastered_c 
          : [];
      }

      if (!currentSkills.includes(skill)) {
        currentSkills.push(skill);
      }

      return await progressService.update(currentProgress.Id, {
        skillsMastered: currentSkills
      });
    } catch (error) {
      console.error("Error adding mastered skill:", error?.response?.data?.message || error);
      return null;
    }
  },

  addBonusStars: async (bonusAmount) => {
    try {
      return await progressService.updateStars(bonusAmount);
    } catch (error) {
      console.error("Error adding bonus stars:", error?.response?.data?.message || error);
      return null;
    }
  },

  getAchievementStats: async () => {
    try {
      const stored = localStorage.getItem('learnquest_achievement_stats');
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        timedChallengesCompleted: 0,
        fastestTime: null,
        totalBonusStarsEarned: 0,
        achievementsUnlocked: 0
      };
    } catch (error) {
      console.error("Error getting achievement stats:", error);
      return {
        timedChallengesCompleted: 0,
        fastestTime: null,
        totalBonusStarsEarned: 0,
        achievementsUnlocked: 0
      };
    }
  },

  updateAchievementStats: async (newStats) => {
    try {
      const current = await progressService.getAchievementStats();
      const updated = { ...current, ...newStats };
      localStorage.setItem('learnquest_achievement_stats', JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error updating achievement stats:", error);
      return null;
    }
  }
};

export default progressService;