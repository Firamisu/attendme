<template>
  <div class="min-h-screen bg-white text-black flex flex-col font-sans">
    <nav class="w-full border-b-4 border-black bg-white sticky top-0 z-50">
      <div
        class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span
              class="text-xs font-black uppercase tracking-tighter bg-black text-white px-2 py-0.5"
            >
              Account
            </span>
            <span
              class="text-sm font-bold uppercase truncate max-w-[100px] sm:max-w-none"
            >
              John Doe
            </span>
          </div>

          <button
            class="border-2 border-black px-3 py-1 text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-none rounded-none"
          >
            Log Out
          </button>
        </div>

        <div class="text-xl sm:text-2xl font-black tracking-tighter uppercase">
          Attend<span class="text-blue-600">Me</span>
        </div>
      </div>
    </nav>

    <main class="flex-grow w-full max-w-7xl mx-auto p-4 md:p-8">
      <slot />
    </main>

    <footer
      class="border-t-2 border-black p-4 text-center text-xs font-bold uppercase"
    >
      &copy; 2026 AttendMe System
    </footer>
  </div>
</template>
