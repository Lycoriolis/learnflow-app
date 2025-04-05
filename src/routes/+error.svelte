<script>
  export let error, status;
</script>

<svelte:head>
  <title>{status} - Something went wrong</title>
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-4">
  <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">{status}</h1>
  <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">{error.message}</p>
  <a href="/" class="btn btn-primary">Go Home</a>
</div>

<style>
    .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        background-color: #f9fafb;
    }

    .error-content {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        max-width: 600px;
        text-align: center;
    }

    h1 {
        color: #ef4444;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    p {
        color: #4b5563;
        margin-bottom: 2rem;
    }

    .button {
        display: inline-block;
        background-color: #3b82f6;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .button:hover {
        background-color: #2563eb;
    }
</style>