import { supabase } from '@/lib/supabase';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineLesson {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'quiz';
  lastSynced: Date;
  localChanges: boolean;
}

interface OfflineProgress {
  lessonId: string;
  progress: number;
  completed: boolean;
  lastUpdated: Date;
}

interface OfflineAIChat {
  id: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  lastSynced: Date;
}

interface LearnWiseDB extends DBSchema {
  lessons: {
    key: string;
    value: OfflineLesson;
  };
  progress: {
    key: string;
    value: OfflineProgress;
  };
  aiChats: {
    key: string;
    value: OfflineAIChat;
  };
}

export class OfflineManager {
  private db: IDBPDatabase<LearnWiseDB> | null = null;
  private syncInProgress = false;

  async initialize() {
    this.db = await openDB<LearnWiseDB>('learn-wise-offline', 1, {
      upgrade(db) {
        db.createObjectStore('lessons');
        db.createObjectStore('progress');
        db.createObjectStore('aiChats');
      },
    });
  }

  async downloadLesson(lessonId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Fetch lesson from Supabase
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) throw error;

    // Store in IndexedDB
    await this.db.put('lessons', {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      type: lesson.type,
      lastSynced: new Date(),
      localChanges: false
    });
  }

  async saveProgress(progress: OfflineProgress): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('progress', progress);
  }

  async saveAIChat(chat: OfflineAIChat): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('aiChats', chat);
  }

  async getOfflineLesson(lessonId: string): Promise<OfflineLesson | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get('lessons', lessonId);
  }

  async getOfflineProgress(lessonId: string): Promise<OfflineProgress | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get('progress', lessonId);
  }

  async getOfflineAIChat(chatId: string): Promise<OfflineAIChat | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get('aiChats', chatId);
  }

  async syncWithServer(): Promise<void> {
    if (!this.db || this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      // Sync progress
      const progressStore = this.db.transaction('progress', 'readonly').store;
      const progressCursor = await progressStore.openCursor();
      
      while (progressCursor) {
        const progress = progressCursor.value;
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: progress.userId,
            lesson_id: progress.lessonId,
            progress: progress.progress,
            completed: progress.completed,
            last_updated: progress.lastUpdated.toISOString()
          });

        if (error) {
          console.error('Error syncing progress:', error);
        }

        await progressCursor.continue();
      }

      // Sync AI chats
      const chatStore = this.db.transaction('aiChats', 'readonly').store;
      const chatCursor = await chatStore.openCursor();
      
      while (chatCursor) {
        const chat = chatCursor.value;
        const { error } = await supabase
          .from('ai_chats')
          .upsert({
            id: chat.id,
            messages: chat.messages,
            last_synced: new Date().toISOString()
          });

        if (error) {
          console.error('Error syncing AI chat:', error);
        }

        await chatCursor.continue();
      }

      // Update last synced timestamps
      const lessonStore = this.db.transaction('lessons', 'readwrite').store;
      const lessonCursor = await lessonStore.openCursor();
      
      while (lessonCursor) {
        const lesson = lessonCursor.value;
        lesson.lastSynced = new Date();
        await lessonCursor.update(lesson);
        await lessonCursor.continue();
      }

    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async checkForUpdates(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const lessonStore = this.db.transaction('lessons', 'readonly').store;
    const lessonCursor = await lessonStore.openCursor();
    
    while (lessonCursor) {
      const lesson = lessonCursor.value;
      
      // Check if lesson has been updated on server
      const { data: serverLesson } = await supabase
        .from('lessons')
        .select('updated_at')
        .eq('id', lesson.id)
        .single();

      if (serverLesson && new Date(serverLesson.updated_at) > lesson.lastSynced) {
        // Download updated version
        await this.downloadLesson(lesson.id);
      }

      await lessonCursor.continue();
    }
  }

  async clearOfflineData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.clear('lessons');
    await this.db.clear('progress');
    await this.db.clear('aiChats');
  }
} 