import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';

interface SkillMastery {
  skill: string;
  level: 'emerging' | 'developing' | 'secure' | 'mastered';
  attempts: number;
  successRate: number;
  lastPracticed: Date;
}

interface LearningAnalytics {
  strengths: string[];
  needsWork: string[];
  recommendedActivities: string[];
  timeSpentToday: number;
  engagementScore: number;
}

interface AdvancedProgressProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

const AdvancedProgressTracker: React.FC<AdvancedProgressProps> = ({ progress, onUpdateProgress }) => {
  const [skillMasteries, setSkillMasteries] = useState<SkillMastery[]>([
    { skill: 'Letter Recognition', level: 'developing', attempts: 15, successRate: 0.8, lastPracticed: new Date() },
    { skill: 'Phoneme Isolation', level: 'emerging', attempts: 8, successRate: 0.6, lastPracticed: new Date() },
    { skill: 'Blending CVC Words', level: 'secure', attempts: 25, successRate: 0.9, lastPracticed: new Date() },
    { skill: 'Segmenting Words', level: 'developing', attempts: 12, successRate: 0.7, lastPracticed: new Date() },
    { skill: 'Rhyming Recognition', level: 'mastered', attempts: 30, successRate: 0.95, lastPracticed: new Date() },
  ]);

  const [analytics, setAnalytics] = useState<LearningAnalytics>({
    strengths: ['Rhyming', 'Letter Recognition', 'Motivation'],
    needsWork: ['Phoneme Isolation', 'Blending Complex Words'],
    recommendedActivities: ['More isolation practice', 'Sound stretching games'],
    timeSpentToday: 15, // minutes
    engagementScore: 85
  });

  const getSkillColor = (level: SkillMastery['level']) => {
    switch (level) {
      case 'emerging': return 'bg-red-100 text-red-700 border-red-300';
      case 'developing': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'secure': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'mastered': return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getRecommendations = (): string[] => {
    const recommendations = [];
    
    skillMasteries.forEach(skill => {
      if (skill.level === 'emerging' && skill.successRate < 0.7) {
        recommendations.push(`Focus on ${skill.skill.toLowerCase()} with shorter, more frequent sessions`);
      }
      if (skill.level === 'developing' && skill.attempts > 20) {
        recommendations.push(`${skill.skill} is ready for the next challenge level`);
      }
    });

    if (analytics.timeSpentToday < 10) {
      recommendations.push('Aim for 15-20 minutes of daily practice for optimal learning');
    }

    if (analytics.engagementScore < 70) {
      recommendations.push('Try different game types to maintain engagement');
    }

    return recommendations;
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-3xl shadow-lg">
      {/* Overall Progress Summary */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-purple-800 mb-4">Learning Progress</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="text-3xl font-black text-blue-600">{progress.currentStreak}</div>
            <div className="text-sm text-blue-500">Day Streak</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="text-3xl font-black text-green-600">{analytics.timeSpentToday}min</div>
            <div className="text-sm text-green-500">Today</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4">
            <div className="text-3xl font-black text-purple-600">{analytics.engagementScore}%</div>
            <div className="text-sm text-purple-500">Engagement</div>
          </div>
        </div>
      </div>

      {/* Skill Mastery Breakdown */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Phonics Skills</h3>
        <div className="space-y-3">
          {skillMasteries.map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl border-2 bg-gray-50">
              <div className="flex-1">
                <div className="font-bold text-gray-800">{skill.skill}</div>
                <div className="text-sm text-gray-600">
                  {skill.attempts} attempts • {Math.round(skill.successRate * 100)}% success
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getSkillColor(skill.level)}`}>
                {skill.level.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Areas for Growth */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-2xl p-4">
          <h4 className="font-bold text-green-800 mb-2">💪 Strengths</h4>
          <ul className="space-y-1">
            {analytics.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-green-700">• {strength}</li>
            ))}
          </ul>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4">
          <h4 className="font-bold text-orange-800 mb-2">🎯 Focus Areas</h4>
          <ul className="space-y-1">
            {analytics.needsWork.map((area, index) => (
              <li key={index} className="text-sm text-orange-700">• {area}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <h4 className="font-bold text-blue-800 mb-3">📚 Recommendations</h4>
        <ul className="space-y-2">
          {getRecommendations().map((rec, index) => (
            <li key={index} className="text-sm text-blue-700 flex items-start">
              <span className="text-blue-500 mr-2">→</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Parent Insights */}
      <div className="bg-purple-50 rounded-2xl p-4">
        <h4 className="font-bold text-purple-800 mb-3">👨‍👩‍👧 Parent Insights</h4>
        <div className="space-y-2 text-sm">
          <p className="text-purple-700">
            <strong>Learning Style:</strong> Visual and auditory learner who responds well to encouragement
          </p>
          <p className="text-purple-700">
            <strong>Best Time:</strong> Most engaged during morning sessions
          </p>
          <p className="text-purple-700">
            <strong>Motivation:</strong> Loves earning badges and hearing progress celebrations
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedProgressTracker;