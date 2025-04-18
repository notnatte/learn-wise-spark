import { supabase } from '@/lib/supabase';

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  estimatedDuration: number; // in minutes
}

interface UserProfile {
  id: string;
  completedLessons: string[];
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  pace: 'slow' | 'moderate' | 'fast';
}

interface LearningPath {
  id: string;
  objectives: LearningObjective[];
  estimatedTotalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
}

export class LearningPathGenerator {
  private userProfile: UserProfile;
  private availableObjectives: LearningObjective[];

  constructor(userProfile: UserProfile, availableObjectives: LearningObjective[]) {
    this.userProfile = userProfile;
    this.availableObjectives = availableObjectives;
  }

  private calculateObjectiveScore(objective: LearningObjective): number {
    let score = 0;

    // Check if prerequisites are met
    const prerequisitesMet = objective.prerequisites.every(prereq =>
      this.userProfile.completedLessons.includes(prereq)
    );
    if (!prerequisitesMet) return -1;

    // Adjust score based on user's learning style
    if (this.userProfile.learningStyle === 'visual' && objective.title.toLowerCase().includes('visual')) {
      score += 2;
    }

    // Adjust score based on user's pace
    if (this.userProfile.pace === 'fast' && objective.estimatedDuration <= 30) {
      score += 1;
    } else if (this.userProfile.pace === 'slow' && objective.estimatedDuration >= 60) {
      score += 1;
    }

    // Adjust score based on user's strengths and weaknesses
    if (this.userProfile.strengths.some(strength => 
      objective.title.toLowerCase().includes(strength.toLowerCase())
    )) {
      score += 1;
    }

    if (this.userProfile.weaknesses.some(weakness =>
      objective.title.toLowerCase().includes(weakness.toLowerCase())
    )) {
      score += 2; // Prioritize areas of weakness
    }

    return score;
  }

  private async getRecommendedObjectives(): Promise<LearningObjective[]> {
    const scoredObjectives = this.availableObjectives
      .map(objective => ({
        objective,
        score: this.calculateObjectiveScore(objective)
      }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score);

    return scoredObjectives.map(({ objective }) => objective);
  }

  public async generateLearningPath(): Promise<LearningPath> {
    const recommendedObjectives = await this.getRecommendedObjectives();
    
    // Group objectives by difficulty
    const objectivesByDifficulty = recommendedObjectives.reduce((acc, objective) => {
      if (!acc[objective.difficulty]) {
        acc[objective.difficulty] = [];
      }
      acc[objective.difficulty].push(objective);
      return acc;
    }, {} as Record<string, LearningObjective[]>);

    // Determine appropriate difficulty level based on user profile
    let targetDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (this.userProfile.completedLessons.length > 20) {
      targetDifficulty = 'intermediate';
    }
    if (this.userProfile.completedLessons.length > 50) {
      targetDifficulty = 'advanced';
    }

    // Select objectives for the learning path
    const selectedObjectives: LearningObjective[] = [];
    const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    
    for (const difficulty of difficulties) {
      const objectives = objectivesByDifficulty[difficulty] || [];
      const count = difficulty === targetDifficulty ? 5 : 2;
      selectedObjectives.push(...objectives.slice(0, count));
    }

    // Calculate total duration and identify focus areas
    const estimatedTotalDuration = selectedObjectives.reduce(
      (total, obj) => total + obj.estimatedDuration,
      0
    );

    const focusAreas = Array.from(new Set(
      selectedObjectives.flatMap(obj => 
        obj.title.toLowerCase().split(' ').filter(word => 
          this.userProfile.weaknesses.some(weakness => 
            word.includes(weakness.toLowerCase())
          )
        )
      )
    ));

    return {
      id: Date.now().toString(),
      objectives: selectedObjectives,
      estimatedTotalDuration,
      difficulty: targetDifficulty,
      focusAreas
    };
  }
}

export async function getUserLearningPath(userId: string): Promise<LearningPath> {
  // Fetch user profile and available objectives from Supabase
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: objectives } = await supabase
    .from('learning_objectives')
    .select('*');

  if (!userProfile || !objectives) {
    throw new Error('Failed to fetch user profile or learning objectives');
  }

  const generator = new LearningPathGenerator(userProfile, objectives);
  return generator.generateLearningPath();
} 