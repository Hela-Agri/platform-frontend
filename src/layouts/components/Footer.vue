<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon
        icon="bx-heart"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By <a
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >Dyna Strategic Solutions</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a target="noopener noreferrer">License</a>
      <a target="noopener noreferrer">More Themes</a>
      <a>Support</a>
    </span>
  </div>
</template>
