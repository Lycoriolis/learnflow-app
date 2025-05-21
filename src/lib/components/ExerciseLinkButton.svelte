<script lang="ts">
    export let href: string | undefined = undefined;
    export let text: string = "Go to Exercise";
</script>

{#if href}
    <a href={href} class="exercise-link-button">
        {text} &rarr;
    </a>
{/if}

<style>
    .exercise-link-button {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #28a745; /* Green color for exercises */
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        transition: background-color 0.2s ease;
    }
    .exercise-link-button:hover {
        background-color: #218838;
    }
</style>
