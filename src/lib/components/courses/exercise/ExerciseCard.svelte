<script lang="ts">
  import { fade } from 'svelte/transition';
  
  export let title: string;
  export let description: string = '';
  export let difficulty: 'beginner' | 'intermediate' | 'advanced' | null = null;
  export let estimatedTime: string = '';
  export let tags: string[] = [];
  export let id: string = '';
  export let type: 'exercise' | 'course' = 'exercise';
  export let onClick: () => void = () => {};
  export let progressStatus: 'notStarted' | 'inProgress' | 'completed' = 'notStarted';

  $: isCompleted = progressStatus === 'completed';
  $: isInProgress = progressStatus === 'inProgress';

  function getDifficultyColor(diff: string | null): string {
    switch (diff) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  }
  
  function getDifficultyLabel(diff: string | null): string {
    if (!diff) return '';
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  }
  
  function handleCardClick(e: MouseEvent) {
    if (e.target && (e.target as HTMLElement).closest('.progress-toggle')) {
      return;
    }
    onClick();
  }

  function handleCardKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleCardClick(event as any);
    }
  }
</script>

{#if type === 'exercise'}
  <!-- Exercise Card (New Design) -->
  <div 
    role="button"
    tabindex="0"
    class="exercise-card {isCompleted ? 'completed' : isInProgress ? 'in-progress' : ''} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-red-500"
    on:click={handleCardClick}
    on:keydown={handleCardKeydown}
    in:fade={{ duration: 300 }}
  >
    <!-- State indicator -->
    <div class="completion-indicator">
      <div class="indicator-dot {isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'not-started'}">
        <i class="fas {isCompleted ? 'fa-check' : isInProgress ? 'fa-spinner' : ''}"></i>
      </div>
    </div>
    
    <!-- Card content -->
    <div class="card-content">
      <h3 class="exercise-title">{title}</h3>
      
      {#if description}
        <p class="exercise-description">{description}</p>
      {/if}
      
      <div class="exercise-meta">
        {#if difficulty}
          <div class="difficulty-badge {difficulty}">
            <span class="difficulty-dot {getDifficultyColor(difficulty)}"></span>
            <span>{getDifficultyLabel(difficulty)}</span>
          </div>
        {/if}
        
        {#if estimatedTime}
          <div class="time-badge">
            <i class="fas fa-clock"></i>
            <span>{estimatedTime}</span>
          </div>
        {/if}
      </div>
      
      {#if tags && tags.length > 0}
        <div class="tags-container">
          {#each tags.slice(0, 3) as tag}
            <span class="tag">{tag}</span>
          {/each}
          {#if tags.length > 3}
            <span class="tag-more">+{tags.length - 3}</span>
          {/if}
        </div>
      {/if}
    </div>
    
    {#if difficulty}
      <div class="difficulty-stripe {difficulty}"></div>
    {/if}
    
    <div class="card-overlay"></div>
  </div>
{:else}
  <!-- Course Card (Original Design) -->
  <div 
    role="button"
    tabindex="0"
    class="course-card focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    on:click={onClick} 
    on:keydown={handleCardKeydown}
    in:fade={{ duration: 300 }}
  >
    <h3 class="course-title">{title}</h3>
    
    {#if description}
      <p class="course-description">{description}</p>
    {/if}
    
    <div class="card-meta">
      {#if difficulty}
        <span class="card-badge difficulty">
          {getDifficultyLabel(difficulty)}
        </span>
      {/if}
      
      {#if estimatedTime}
        <span class="card-badge time">
          <i class="fas fa-clock"></i> {estimatedTime}
        </span>
      {/if}
    </div>
    
    {#if tags && tags.length > 0}
      <div class="tags-row">
        {#each tags.slice(0, 3) as tag}
          <span class="tag-pill">{tag}</span>
        {/each}
        {#if tags.length > 3}
          <span class="tag-pill more">+{tags.length - 3}</span>
        {/if}
      </div>
    {/if}
    
    <div class="card-arrow">
      <i class="fas fa-arrow-right"></i>
    </div>
  </div>
{/if}

<style>
  /* Original Course Card Styles */
  .course-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .course-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .course-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
    padding-right: 1.5rem;
  }
  
  .course-description {
    color: #4b5563;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    flex-grow: 1;
  }
  
  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .card-badge {
    font-size: 0.85rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .card-badge.difficulty {
    background: #f3f4f6;
    color: #374151;
  }
  
  .card-badge.time {
    background: #f3f4f6;
    color: #374151;
  }
  
  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  
  .tag-pill {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 0.25rem;
    background: #e5e7eb;
    color: #4b5563;
  }
  
  .tag-pill.more {
    background: transparent;
    color: #9ca3af;
  }
  
  .card-arrow {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    color: #4b5563;
    transition: all 0.3s ease;
  }
  
  .course-card:hover .card-arrow {
    background: #111827;
    color: white;
    transform: translateX(3px);
  }
  
  /* New Exercise Card Styles */
  .exercise-card {
    background: linear-gradient(145deg, #ffffff, #f9fafb);
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    padding: 1.5rem 1.25rem 1.5rem 3rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .exercise-card:hover {
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
  
  .exercise-card.completed {
    border: 1px solid rgba(16, 185, 129, 0.3);
    background: linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
  }
  
  .exercise-card.in-progress {
    border: 1px solid rgba(245, 158, 11, 0.3);
    background: linear-gradient(145deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02));
  }
  
  .completion-indicator {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .indicator-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: transparent;
    transition: all 0.3s ease;
  }
  
  .indicator-dot.completed {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }
  
  .indicator-dot.in-progress {
    background: #f59e0b;
    border-color: #f59e0b;
    color: white;
  }
  
  .difficulty-stripe {
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 100%;
    z-index: 1;
  }
  
  .difficulty-stripe.beginner {
    background: linear-gradient(to bottom, #10b981, #059669);
  }
  
  .difficulty-stripe.intermediate {
    background: linear-gradient(to bottom, #f59e0b, #d97706);
  }
  
  .difficulty-stripe.advanced {
    background: linear-gradient(to bottom, #ef4444, #dc2626);
  }
  
  .card-content {
    position: relative;
    z-index: 2;
  }
  
  .exercise-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  
  .exercise-description {
    color: #4b5563;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .exercise-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .difficulty-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .difficulty-badge.beginner {
    background: rgba(16, 185, 129, 0.1);
    color: #065f46;
  }
  
  .difficulty-badge.intermediate {
    background: rgba(245, 158, 11, 0.1);
    color: #92400e;
  }
  
  .difficulty-badge.advanced {
    background: rgba(239, 68, 68, 0.1);
    color: #b91c1c;
  }
  
  .difficulty-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  
  .time-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    background: rgba(79, 70, 229, 0.1);
    color: #4338ca;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
    border-radius: 0.25rem;
    background: #f3f4f6;
    color: #4b5563;
    font-weight: 500;
  }
  
  .tag-more {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    color: #9ca3af;
  }
  
  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent, transparent);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 0;
    pointer-events: none;
  }
  
  .exercise-card:hover .card-overlay {
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.02));
    opacity: 1;
  }
  
  .exercise-card.completed:hover .card-overlay {
    background: linear-gradient(to right, transparent, rgba(16, 185, 129, 0.05));
  }
  
  .exercise-card.in-progress:hover .card-overlay {
    background: linear-gradient(to right, transparent, rgba(245, 158, 11, 0.05));
  }
</style>