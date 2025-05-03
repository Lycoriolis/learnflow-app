<script lang="ts">
  import { UserActivityService } from '$lib/services/user/userActivityService';
  import { user } from '$lib/stores/auth';
  import type { Course, Module, Lesson } from '$lib/types/shared';

  export let course: Course;
  export let currentModule: Module;
  export let currentLesson: Lesson;

  const activityService = UserActivityService.getInstance();

  async function trackProgress() {
    const userId = $user?.uid;
    if (!userId) return;

    // Calculate overall course progress
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) => {
      return acc + module.lessons.filter(lesson => lesson.completed).length;
    }, 0);
    const progress = Math.round((completedLessons / totalLessons) * 100);

    await activityService.trackCourseProgress(
      userId,
      course.id,
      currentLesson.id,
      progress
    );
  }

  $: if (currentLesson) {
    trackProgress();
  }
</script>

<!-- Your existing course content template --> 