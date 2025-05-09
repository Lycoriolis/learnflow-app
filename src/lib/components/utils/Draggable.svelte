<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let element: HTMLElement | null = null; // Bound element from parent
  export let disabled = false; // Prop to disable dragging
  export let boundaryElement: HTMLElement | 'window' = 'window'; // Optional boundary

  let isDragging = false;
  let startX: number, startY: number;
  let initialLeft: number, initialTop: number;

  function getBoundaryRect(): { top: number; left: number; bottom: number; right: number } {
    if (boundaryElement === 'window' || !boundaryElement) {
      return { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth };
    }
    const rect = boundaryElement.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right
    };
  }

  function handleMouseDown(e: MouseEvent) {
      if (!element || disabled || e.button !== 0 || (e.target instanceof Element && e.target.closest('button, input, textarea, select, a'))) {
          // Don't drag if disabled, not left mouse button, or clicking interactive elements/links
          return;
      }
      e.preventDefault(); // Prevent text selection issues
      e.stopPropagation();

      isDragging = true;
      const computedStyle = getComputedStyle(element);
      // Use matrix transformation if available, otherwise fallback to left/top
      const transform = computedStyle.transform;
      if (transform && transform !== 'none') {
          const matrix = new DOMMatrix(transform);
          initialLeft = matrix.e;
          initialTop = matrix.f;
      } else {
          initialLeft = parseFloat(computedStyle.left || '0') || element.offsetLeft;
          initialTop = parseFloat(computedStyle.top || '0') || element.offsetTop;
      }

      startX = e.clientX;
      startY = e.clientY;

      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
      // Optional: Add a class for visual feedback during drag
      element.classList.add('dragging');

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
      if (!isDragging || !element) return;
      e.preventDefault();

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      // Apply boundary constraints
      const boundary = getBoundaryRect();
      const elRect = element.getBoundingClientRect(); // Current position might be needed
      const parentRect = element.offsetParent?.getBoundingClientRect() ?? { left: 0, top: 0 };

      // Calculate constraints based on transform or left/top
      const elWidth = element.offsetWidth;
      const elHeight = element.offsetHeight;

      // Note: Boundary calculations can be complex depending on positioning (fixed, absolute)
      // This is a simplified version assuming fixed/absolute relative to viewport or boundaryElement
      // Adjust if needed based on specific layout

      // Simple viewport constraint for fixed positioning
      if (getComputedStyle(element).position === 'fixed') {
          newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - elWidth));
          newTop = Math.max(0, Math.min(newTop, window.innerHeight - elHeight));
      }
      // Add more complex boundary logic here if boundaryElement is used with absolute positioning


      // Use transform for better performance
      element.style.transform = `translate3d(${newLeft}px, ${newTop}px, 0)`;
      // Clear left/top if setting transform to avoid conflicts
      element.style.left = '0';
      element.style.top = '0';
  }

  function handleMouseUp(e: MouseEvent) {
      if (!isDragging || !element) return;
      isDragging = false;
      element.style.cursor = 'grab';
      element.style.removeProperty('user-select');
      element.classList.remove('dragging');

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
  }

  onMount(() => {
    if (element) {
      // Ensure initial positioning is applied if using transform
      if (!element.style.transform) {
         const computedStyle = getComputedStyle(element);
         const transform = computedStyle.transform;
         if (!transform || transform === 'none') {
            const initialLeft = parseFloat(computedStyle.left || '0') || element.offsetLeft;
            const initialTop = parseFloat(computedStyle.top || '0') || element.offsetTop;
            element.style.transform = `translate3d(${initialLeft}px, ${initialTop}px, 0)`;
            element.style.left = '0';
            element.style.top = '0';
         }
      }

      element.addEventListener('mousedown', handleMouseDown);
      element.style.cursor = 'grab';
    }
  });

  onDestroy(() => {
    if (element) {
      element.removeEventListener('mousedown', handleMouseDown);
    }
    // Clean up global listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  });

</script>

<!-- Add a slot to wrap the content that should be draggable -->
<slot></slot>

<style>
  /* Optional: Indicate dragging state */
  :global(.dragging) {
    /* Example: slightly reduced opacity or different border */
    opacity: 0.9;
    z-index: 1000; /* Ensure it stays on top */
  }
</style>