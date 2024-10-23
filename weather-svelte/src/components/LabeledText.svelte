<script>
  export let label;
  export let text;
</script>
<p class:shimmer={!text}>
  <span class="text-label">{label}:</span>
  <span class="text">{text}</span>
</p>
