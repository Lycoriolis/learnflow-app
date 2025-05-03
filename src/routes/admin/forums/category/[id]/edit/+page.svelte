<script lang="ts">
  import { getCategory, updateCategory } from '$lib/services/forums/forumService';
  let category = { name: '', description: '' };
  export let params: { id: string };
  
  async function loadCategory(id: string) {
    category = await getCategory(id) || { name: '', description: '' };
  }
  
  loadCategory(params.id);
  
  async function handleSubmit() {
    await updateCategory(category.id, category);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={category.name} placeholder="Category Name" />
  <textarea bind:value={category.description} placeholder="Description"></textarea>
  <button type="submit">Save</button>
</form>