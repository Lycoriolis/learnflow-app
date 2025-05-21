<script lang="ts">
    // Props if needed in the future, e.g., for user status
</script>

<header class="app-header">
    <div class="header-content">
        <!-- All content (logo and nav) removed -->
    </div>
</header>

<style>
    .app-header {
        position: sticky; 
        top: 0;
        z-index: 1000; 
        height: 0; /* Make it take no visual space */
        overflow: hidden; /* Ensure no padding/border makes it visible */
    }
    .header-content {
        height: 0; /* Make it take no visual space */
    }
</style>