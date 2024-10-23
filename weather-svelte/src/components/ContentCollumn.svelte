<script>
  export let num = '0';
  export let flex = false;
  export let flexOptions = 'row';
</script>

<div class={`col-${num} ${flex ? 'display-flex' : ''} ${flex && flexOptions ? flexOptions : ''}`}>
  <slot />
</div>
