<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Icon from '@iconify/svelte';
  import { exerciseProgressService } from '$lib/services/exercises/exerciseProgressService';
  import { exerciseBookmarkService } from '$lib/services/exercises/exerciseBookmarkService';

  export let className = '';

  let isExporting = false;
  let isImporting = false;
  let importFileInput: HTMLInputElement;
  let exportStatus = '';
  let importStatus = '';
  let importErrors: string[] = [];

  // Export options
  let exportOptions = {
    progress: true,
    bookmarks: true,
    sessions: true,
    collections: true,
    includeTimestamps: true,
    format: 'json' as 'json' | 'csv'
  };

  // Import options
  let importOptions = {
    mergeStrategy: 'replace' as 'replace' | 'merge' | 'skip',
    validateData: true,
    createBackup: true
  };

  let dataStats = {
    progressEntries: 0,
    bookmarks: 0,
    sessions: 0,
    collections: 0,
    lastExport: null as Date | null,
    dataSize: '0 KB'
  };

  onMount(async () => {
    if (!browser) return;
    await updateDataStats();
    
    // Check for last export timestamp
    const lastExport = localStorage.getItem('exercise-data-last-export');
    if (lastExport) {
      dataStats.lastExport = new Date(lastExport);
    }
  });

  async function updateDataStats() {
    try {
      const [progress, bookmarks, sessions, collections] = await Promise.all([
        exerciseProgressService.getAllProgress(),
        exerciseBookmarkService.getAllBookmarks(),
        exerciseProgressService.getAllSessions(),
        exerciseBookmarkService.getAllCollections()
      ]);

      dataStats.progressEntries = progress.length;
      dataStats.bookmarks = bookmarks.length;
      dataStats.sessions = sessions.length;
      dataStats.collections = collections.length;

      // Estimate data size
      const sampleData = { progress, bookmarks, sessions, collections };
      const dataString = JSON.stringify(sampleData);
      dataStats.dataSize = formatBytes(new Blob([dataString]).size);
    } catch (error) {
      console.error('Failed to update data stats:', error);
    }
  }

  async function exportData() {
    isExporting = true;
    exportStatus = 'Preparing export...';

    try {
      const exportData: any = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        source: 'LearnFlow Exercise System'
      };

      // Collect selected data
      if (exportOptions.progress) {
        exportStatus = 'Collecting progress data...';
        exportData.progress = await exerciseProgressService.getAllProgress();
      }

      if (exportOptions.bookmarks) {
        exportStatus = 'Collecting bookmarks...';
        exportData.bookmarks = await exerciseBookmarkService.getAllBookmarks();
      }

      if (exportOptions.sessions) {
        exportStatus = 'Collecting session data...';
        exportData.sessions = await exerciseProgressService.getAllSessions();
      }

      if (exportOptions.collections) {
        exportStatus = 'Collecting collections...';
        exportData.collections = await exerciseBookmarkService.getAllCollections();
      }

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `learnflow-exercise-data-${timestamp}.${exportOptions.format}`;

      if (exportOptions.format === 'json') {
        await exportAsJSON(exportData, filename);
      } else {
        await exportAsCSV(exportData, filename);
      }

      // Save export timestamp
      localStorage.setItem('exercise-data-last-export', new Date().toISOString());
      dataStats.lastExport = new Date();

      exportStatus = 'Export completed successfully!';
      setTimeout(() => { exportStatus = ''; }, 3000);
    } catch (error) {
      exportStatus = `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('Export error:', error);
    } finally {
      isExporting = false;
    }
  }

  async function exportAsJSON(data: any, filename: string) {
    const jsonString = JSON.stringify(data, null, exportOptions.includeTimestamps ? 2 : 0);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, filename);
  }

  async function exportAsCSV(data: any, filename: string) {
    const csvParts: string[] = [];

    // Export progress as CSV
    if (data.progress && data.progress.length > 0) {
      csvParts.push('=== PROGRESS DATA ===');
      csvParts.push('ExerciseId,CompletionPercentage,TimeSpent,IsCompleted,LastAccessed,CompletedAt,SessionCount');
      data.progress.forEach((p: any) => {
        const row = [
          escapeCSV(p.exerciseId),
          p.completionPercentage,
          p.timeSpent,
          p.isCompleted,
          p.lastAccessed ? p.lastAccessed.toISOString() : '',
          p.completedAt ? p.completedAt.toISOString() : '',
          p.sessionCount
        ].join(',');
        csvParts.push(row);
      });
      csvParts.push('');
    }

    // Export bookmarks as CSV
    if (data.bookmarks && data.bookmarks.length > 0) {
      csvParts.push('=== BOOKMARKS DATA ===');
      csvParts.push('Id,ExerciseId,Title,Category,Difficulty,Tags,Url,CreatedAt');
      data.bookmarks.forEach((b: any) => {
        const row = [
          escapeCSV(b.id),
          escapeCSV(b.exerciseId),
          escapeCSV(b.title),
          escapeCSV(b.category),
          escapeCSV(b.difficulty || ''),
          escapeCSV((b.tags || []).join(';')),
          escapeCSV(b.url),
          b.createdAt.toISOString()
        ].join(',');
        csvParts.push(row);
      });
      csvParts.push('');
    }

    const csvContent = csvParts.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadBlob(blob, filename.replace('.csv', '') + '.csv');
  }

  function escapeCSV(value: string): string {
    if (typeof value !== 'string') return String(value);
    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportFile() {
    const file = importFileInput.files?.[0];
    if (!file) return;

    isImporting = true;
    importStatus = 'Reading file...';
    importErrors = [];

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          await importFromJSON(content);
        } else if (file.name.endsWith('.csv')) {
          await importFromCSV(content);
        } else {
          throw new Error('Unsupported file format. Please use JSON or CSV files.');
        }

        importStatus = 'Import completed successfully!';
        await updateDataStats();
        setTimeout(() => { importStatus = ''; }, 3000);
      } catch (error) {
        importStatus = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error('Import error:', error);
      } finally {
        isImporting = false;
        importFileInput.value = '';
      }
    };

    reader.readAsText(file);
  }

  async function importFromJSON(content: string) {
    importStatus = 'Parsing JSON data...';
    const data = JSON.parse(content);

    if (importOptions.validateData) {
      validateImportData(data);
    }

    if (importOptions.createBackup) {
      importStatus = 'Creating backup...';
      await createBackup();
    }

    // Import progress data
    if (data.progress) {
      importStatus = 'Importing progress data...';
      await importProgressData(data.progress);
    }

    // Import bookmarks
    if (data.bookmarks) {
      importStatus = 'Importing bookmarks...';
      await importBookmarkData(data.bookmarks);
    }

    // Import collections
    if (data.collections) {
      importStatus = 'Importing collections...';
      await importCollectionData(data.collections);
    }
  }

  async function importFromCSV(content: string) {
    importStatus = 'Parsing CSV data...';
    // Basic CSV parsing - in a real app, you'd want a more robust CSV parser
    const lines = content.split('\n');
    let currentSection = '';
    const data: any = {};

    for (const line of lines) {
      if (line.startsWith('=== ') && line.endsWith(' ===')) {
        currentSection = line.slice(4, -4).toLowerCase().replace(' data', '');
        data[currentSection] = [];
        continue;
      }

      if (currentSection && line.trim() && !line.includes('ExerciseId,') && !line.includes('Id,')) {
        // Parse CSV line (basic implementation)
        const values = parseCSVLine(line);
        if (currentSection === 'progress' && values.length >= 6) {
          data[currentSection].push({
            exerciseId: values[0],
            completionPercentage: parseInt(values[1]),
            timeSpent: parseInt(values[2]),
            isCompleted: values[3] === 'true',
            lastAccessed: values[4] ? new Date(values[4]) : null,
            completedAt: values[5] ? new Date(values[5]) : null,
            sessionCount: parseInt(values[6]) || 0
          });
        } else if (currentSection === 'bookmarks' && values.length >= 7) {
          data[currentSection].push({
            id: values[0],
            exerciseId: values[1],
            title: values[2],
            category: values[3],
            difficulty: values[4] || undefined,
            tags: values[5] ? values[5].split(';') : [],
            url: values[6],
            createdAt: new Date(values[7])
          });
        }
      }
    }

    await importFromJSON(JSON.stringify(data));
  }

  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  function validateImportData(data: any) {
    if (data.progress && !Array.isArray(data.progress)) {
      throw new Error('Invalid progress data format');
    }
    if (data.bookmarks && !Array.isArray(data.bookmarks)) {
      throw new Error('Invalid bookmarks data format');
    }
    // Add more validation as needed
  }

  async function createBackup() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const backupData = {
      progress: await exerciseProgressService.getAllProgress(),
      bookmarks: await exerciseBookmarkService.getAllBookmarks(),
      sessions: await exerciseProgressService.getAllSessions(),
      collections: await exerciseBookmarkService.getAllCollections()
    };
    
    const filename = `learnflow-backup-${timestamp}.json`;
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Store backup reference
    localStorage.setItem('exercise-data-last-backup', timestamp);
  }

  async function importProgressData(progressData: any[]) {
    for (const item of progressData) {
      try {
        // Note: This is a simplified import - in a real app you'd want more robust merging
        if (importOptions.mergeStrategy === 'replace' || 
            !(await exerciseProgressService.getProgress(item.exerciseId))) {
          await exerciseProgressService.updateProgress(item.exerciseId, {
            completionPercentage: item.completionPercentage,
            timeSpent: item.timeSpent,
            isCompleted: item.isCompleted
          });
        }
      } catch (error) {
        importErrors.push(`Failed to import progress for ${item.exerciseId}: ${error}`);
      }
    }
  }

  async function importBookmarkData(bookmarkData: any[]) {
    for (const item of bookmarkData) {
      try {
        if (importOptions.mergeStrategy === 'replace' ||
            !(await exerciseBookmarkService.isBookmarked(item.exerciseId))) {
          await exerciseBookmarkService.addBookmark({
            exerciseId: item.exerciseId,
            title: item.title,
            category: item.category,
            difficulty: item.difficulty,
            tags: item.tags,
            url: item.url
          });
        }
      } catch (error) {
        importErrors.push(`Failed to import bookmark for ${item.exerciseId}: ${error}`);
      }
    }
  }

  async function importCollectionData(collectionData: any[]) {
    for (const item of collectionData) {
      try {
        await exerciseBookmarkService.createCollection(item.name, item.description);
      } catch (error) {
        importErrors.push(`Failed to import collection ${item.name}: ${error}`);
      }
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg {className}">
  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Export your learning progress and bookmarks, or import data from a backup.
    </p>
  </div>

  <div class="p-6 space-y-8">
    <!-- Data Overview -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Data Overview</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{dataStats.progressEntries}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Progress Entries</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{dataStats.bookmarks}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Bookmarks</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{dataStats.sessions}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Sessions</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">{dataStats.collections}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Collections</div>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Estimated size: {dataStats.dataSize}</span>
        {#if dataStats.lastExport}
          <span>Last export: {formatDate(dataStats.lastExport)}</span>
        {/if}
      </div>
    </div>

    <!-- Export Section -->
    <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
      <div class="flex items-center mb-4">
        <Icon icon="mdi:download" class="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Export Data</h3>
      </div>

      <!-- Export Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">What to export:</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={exportOptions.progress} class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Progress data ({dataStats.progressEntries} entries)</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" bind:checked={exportOptions.bookmarks} class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Bookmarks ({dataStats.bookmarks} items)</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" bind:checked={exportOptions.sessions} class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Session data ({dataStats.sessions} sessions)</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" bind:checked={exportOptions.collections} class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Collections ({dataStats.collections} collections)</span>
            </label>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Export options:</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" bind:group={exportOptions.format} value="json" class="border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">JSON format (recommended)</span>
            </label>
            <label class="flex items-center">
              <input type="radio" bind:group={exportOptions.format} value="csv" class="border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">CSV format</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" bind:checked={exportOptions.includeTimestamps} class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Include timestamps</span>
            </label>
          </div>
        </div>
      </div>

      {#if exportStatus}
        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div class="flex items-center">
            {#if isExporting}
              <Icon icon="mdi:loading" class="h-4 w-4 text-blue-600 mr-2 animate-spin" />
            {:else}
              <Icon icon="mdi:check-circle" class="h-4 w-4 text-green-600 mr-2" />
            {/if}
            <span class="text-sm text-blue-800 dark:text-blue-200">{exportStatus}</span>
          </div>
        </div>
      {/if}

      <button
        on:click={exportData}
        disabled={isExporting || (!exportOptions.progress && !exportOptions.bookmarks && !exportOptions.sessions && !exportOptions.collections)}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon icon={isExporting ? 'mdi:loading' : 'mdi:download'} class="h-4 w-4 mr-2 {isExporting ? 'animate-spin' : ''}" />
        {isExporting ? 'Exporting...' : 'Export Data'}
      </button>
    </div>

    <!-- Import Section -->
    <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
      <div class="flex items-center mb-4">
        <Icon icon="mdi:upload" class="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Import Data</h3>
      </div>

      <!-- Import Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Import strategy:</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" bind:group={importOptions.mergeStrategy} value="replace" class="border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Replace existing data</span>
            </label>
            <label class="flex items-center">
              <input type="radio" bind:group={importOptions.mergeStrategy} value="merge" class="border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Merge with existing data</span>
            </label>
            <label class="flex items-center">
              <input type="radio" bind:group={importOptions.mergeStrategy} value="skip" class="border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Skip existing entries</span>
            </label>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Safety options:</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={importOptions.validateData} class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Validate imported data</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" bind:checked={importOptions.createBackup} class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Create backup before import</span>
            </label>
          </div>
        </div>
      </div>

      {#if importStatus}
        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div class="flex items-center">
            {#if isImporting}
              <Icon icon="mdi:loading" class="h-4 w-4 text-blue-600 mr-2 animate-spin" />
            {:else}
              <Icon icon="mdi:check-circle" class="h-4 w-4 text-green-600 mr-2" />
            {/if}
            <span class="text-sm text-blue-800 dark:text-blue-200">{importStatus}</span>
          </div>
        </div>
      {/if}

      {#if importErrors.length > 0}
        <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <h4 class="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Import Errors:</h4>
          <ul class="text-xs text-red-700 dark:text-red-300 space-y-1">
            {#each importErrors.slice(0, 5) as error}
              <li>• {error}</li>
            {/each}
            {#if importErrors.length > 5}
              <li>• ... and {importErrors.length - 5} more errors</li>
            {/if}
          </ul>
        </div>
      {/if}

      <div class="flex items-center space-x-4">
        <input
          bind:this={importFileInput}
          type="file"
          accept=".json,.csv"
          on:change={handleImportFile}
          class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
        />
        <button
          on:click={() => importFileInput?.click()}
          disabled={isImporting}
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Icon icon="mdi:file-upload" class="h-4 w-4 mr-2" />
          Choose File
        </button>
      </div>

      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Supported formats: JSON (.json) and CSV (.csv). Maximum file size: 10MB.
      </p>
    </div>
  </div>
</div>
